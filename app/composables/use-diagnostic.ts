import type { Session, StartedSession, SurveyMode } from '#shared/diagnostic'
import type { Profile } from '#shared/config'
import { sessionStorageKey, type SavedSession } from './use-session-access'
export const useDiagnostic = (mode: SurveyMode) => {
  const key = sessionStorageKey(mode)
  const access = useSessionAccess()
  const session = ref<Session | null>(null)
  const saved = ref<SavedSession | null>(null)
  const answers = ref<Record<string,string>>({})
  const persistedAnswers = ref<Record<string,string>>({})
  const currentIndex = ref(0)
  const loading = ref(true)
  const submitting = ref(false)
  const error = ref('')
  const storageWarning = ref('')
  const canStartNewSession = ref(false)
  const currentQuestion = computed(() => session.value?.questions[currentIndex.value])
  const currentAnswer = computed(() => currentQuestion.value ? answers.value[currentQuestion.value.id] : undefined)
  const hasCurrentAnswer = computed(() => !!currentAnswer.value)
  const isFirstQuestion = computed(() => currentIndex.value === 0)
  const isLastQuestion = computed(() => currentIndex.value === (session.value?.questions.length ?? 0) - 1)
  const progress = computed(() => 100 * (currentIndex.value + 1) / (session.value?.questions.length || 1))
  function persist(completed = false) {
    if (!session.value) return
    saved.value = { completed, sessionId: session.value.sessionId, accessToken: access.tokenFor(session.value.sessionId), ...(completed ? {} : { answers: answers.value }) }
    try { localStorage.setItem(key, JSON.stringify(saved.value)) }
    catch { storageWarning.value = 'Este navegador não permitiu salvar a participação neste dispositivo. O resultado ficará acessível durante esta visita; a retomada após fechar a página pode não funcionar.' }
  }
  async function restore() {
    loading.value = true
    error.value = ''
    try {
      let stored: string | null = null
      try { stored = localStorage.getItem(key) } catch { storageWarning.value = 'Armazenamento local indisponível; a retomada pode não funcionar neste navegador.' }
      if (!stored) {
        // Only unfinished participation needs recovery on a new visit.
        try {
          const legacy = JSON.parse(localStorage.getItem(`padi:${mode}:v1`) || 'null') as SavedSession | null
          if (legacy?.sessionId && !legacy.completed) {
            canStartNewSession.value = true
            error.value = 'Existe uma participação anterior à atualização de segurança. O identificador antigo não permite recuperar o acesso individual.'
          }
        } catch { /* Invalid legacy state does not authorize access. */ }
        return
      }
      let value: SavedSession
      try { value = JSON.parse(stored) } catch { throw new Error('invalid-storage') }
      if (typeof value.sessionId !== 'string' || !/^[0-9a-f-]{36}$/i.test(value.sessionId)) throw new Error('invalid-storage')
      if (value.completed) return
      if (!value.accessToken || !/^[A-Za-z0-9_-]{43}$/.test(value.accessToken)) { canStartNewSession.value = !value.completed; throw new Error('missing-token') }
      access.remember(value.sessionId, value.accessToken)
      const loaded = await $fetch<Session>(`/api/sessions/${value.sessionId}`, { headers: access.headers(value.sessionId) })
      if (loaded.mode !== mode) throw new Error('invalid-mode')
      if (loaded.completed) return
      session.value = loaded
      persistedAnswers.value = Object.fromEntries(loaded.answers.map(a => [a.questionId, a.optionId]))
      answers.value = Object.fromEntries(loaded.questions.flatMap(q => {
        const id = value.answers?.[q.id]
        const serverId = persistedAnswers.value[q.id]
        const selected = q.options.some(o => o.id === id) ? id : serverId
        return selected && q.options.some(o => o.id === selected) ? [[q.id,selected]] : []
      }))
      currentIndex.value = Math.max(0, loaded.questions.findIndex(q => !answers.value[q.id]))
      persist(loaded.completed)
    } catch { error.value = 'Não foi possível recuperar sua sessão. Confira a conexão e tente novamente; suas respostas locais foram mantidas.' }
    finally { loading.value = false }
  }
  async function start(profile?: Profile) {
    loading.value = true; error.value = ''
    try {
      const started = await $fetch<StartedSession>(`/api/surveys/${mode}/start`, { method: 'POST', body: profile ? { profile } : {} })
      access.remember(started.sessionId, started.accessToken)
      session.value = { sessionId: started.sessionId, mode: started.mode, completed: started.completed, questions: started.questions, answers: started.answers }
      answers.value = {}; persistedAnswers.value = {}; currentIndex.value = 0; persist()
    } catch { error.value = 'Não foi possível iniciar. Confira os dados e tente novamente em instantes.' }
    finally { loading.value = false }
  }
  async function saveQuestionAnswer(questionId: string, optionId: string) {
    if (!session.value) return false
    if (persistedAnswers.value[questionId] === optionId) return true
    submitting.value = true; error.value = ''
    try {
      await $fetch(`/api/sessions/${session.value.sessionId}/answer`, {
        method: 'POST', headers: access.headers(session.value.sessionId), body: { questionId, optionId }
      })
      persistedAnswers.value[questionId] = optionId
      persist()
      return true
    } catch {
      error.value = 'Não foi possível salvar sua resposta agora. Ela continua neste dispositivo; tente novamente antes de avançar.'
      return false
    } finally { submitting.value = false }
  }
  function selectAnswer(id: string) {
    if (!currentQuestion.value || submitting.value) return
    const questionId = currentQuestion.value.id
    answers.value[questionId] = id
    delete persistedAnswers.value[questionId]
    persist()
    void saveQuestionAnswer(questionId, id)
  }
  async function focusQuestion() { await nextTick(); document.querySelector<HTMLElement>('[data-question-heading]')?.focus() }
  async function next() {
    const question = currentQuestion.value
    const answer = currentAnswer.value
    if (!question || !answer || isLastQuestion.value || submitting.value) return
    if (!await saveQuestionAnswer(question.id, answer)) return
    currentIndex.value++; await focusQuestion()
  }
  async function previous() { if (!isFirstQuestion.value) { currentIndex.value--; await focusQuestion() } }
  async function finish() {
    if (!session.value || submitting.value) return
    const active = session.value
    if (active.questions.some(q => !answers.value[q.id])) { error.value = 'Responda todas as questões antes de concluir.'; return }
    submitting.value = true; error.value = ''
    try {
      await $fetch(`/api/sessions/${active.sessionId}/submit`, { method:'POST', headers: access.headers(active.sessionId), body: { answers: active.questions.map(q => ({questionId:q.id,optionId:answers.value[q.id]})) } })
      persist(true)
      await navigateTo(`/resultado/${active.sessionId}`)
    } catch {
      // A lost response or another tab may have completed the atomic submission.
      try {
        const remote = await $fetch<Session>(`/api/sessions/${active.sessionId}`, { headers: access.headers(active.sessionId) })
        if (remote.completed) { persist(true); await navigateTo(`/resultado/${active.sessionId}`); return }
      } catch { /* Retain local answers for retry. */ }
      error.value = 'Não foi possível confirmar o envio. Suas respostas foram mantidas; tente novamente.'
    } finally { submitting.value = false }
  }
  function restartUnavailable() {
    if (!canStartNewSession.value || saved.value?.completed) return
    try { localStorage.removeItem(key); localStorage.removeItem(`padi:${mode}:v1`) } catch { /* Memory-only participation remains possible. */ }
    session.value = null; saved.value = null; answers.value = {}; persistedAnswers.value = {}; currentIndex.value = 0
    canStartNewSession.value = false; error.value = ''
  }
  onMounted(restore)
  return { canStartNewSession,restartUnavailable,session,saved,loading,submitting,error,storageWarning,currentIndex,currentQuestion,currentAnswer,hasCurrentAnswer,isFirstQuestion,isLastQuestion,progress,start,restore,selectAnswer,next,previous,finish }
}
