import { computed, ref } from 'vue'
import { calculateDiagnosticResult } from '~/utils/diagnostic-result'
import type { DiagnosticResult, Question } from '~/types/diagnostic'

export const useDiagnostic = (questions: Question[]) => {
  const currentIndex = ref(0)
  const answers = useState<Record<string, string>>('diagnostic-answers', () => ({}))
  const result = useState<DiagnosticResult | null>('diagnostic-result', () => null)

  const currentQuestion = computed(() => questions[currentIndex.value])
  const currentAnswer = computed(() => answers.value[currentQuestion.value?.id])
  const isFirstQuestion = computed(() => currentIndex.value === 0)
  const isLastQuestion = computed(() => currentIndex.value === questions.length - 1)
  const hasCurrentAnswer = computed(() => Boolean(currentAnswer.value))
  const progress = computed(() => ((currentIndex.value + 1) / questions.length) * 100)

  const selectAnswer = (optionId: string) => {
    if (!currentQuestion.value) return

    answers.value[currentQuestion.value.id] = optionId
  }

  const next = () => {
    if (!hasCurrentAnswer.value) return

    if (isLastQuestion.value) {
      return
    }

    currentIndex.value += 1
  }

  const finish = () => {
    if (questions.some(question => !answers.value[question.id])) return false

    result.value = calculateDiagnosticResult(questions, answers.value)
    return true
  }

  const reset = () => {
    currentIndex.value = 0
    answers.value = {}
    result.value = null
  }

  const previous = () => {
    if (!isFirstQuestion.value) currentIndex.value -= 1
  }

  return {
    currentAnswer,
    currentIndex,
    currentQuestion,
    hasCurrentAnswer,
    isFirstQuestion,
    isLastQuestion,
    finish,
    next,
    previous,
    progress,
    selectAnswer,
    result,
    reset
  }
}