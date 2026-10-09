<script setup lang="ts">
import { competencyLabels, type SurveyResult } from '#shared/diagnostic'
import { sessionStorageKey } from '~/composables/use-session-access'
definePageMeta({ key: route => route.path })
const route = useRoute()
const access = useSessionAccess()
const missingAccess = ref(false)
const { data: result, status, error, refresh } = await useFetch<SurveyResult>(`/api/sessions/${route.params.sessionId}/result`, { server: false, immediate: false, headers: computed(() => access.headers(String(route.params.sessionId))) })
const competencies = computed(() => result.value?.competencies ?? [])
const highest = computed(() => Math.max(...competencies.value.map(c => c.percentage)))
const lowest = computed(() => Math.min(...competencies.value.map(c => c.percentage)))
const tied = computed(() => highest.value === lowest.value)
const labelsAt = (value: number) => competencies.value.filter(c => c.percentage === value).map(c => competencyLabels[c.competency]).join('; ')
useHead({ title: 'Seu resultado · PADI', meta: [{ name: 'robots', content: 'noindex,nofollow' }, { name: 'referrer', content: 'no-referrer' }] })
onMounted(async () => {
  if (!access.tokenFor(String(route.params.sessionId))) { missingAccess.value = true; return }
  await refresh()
})
watch(result, value => {
  if (!value) return
  try { localStorage.setItem(sessionStorageKey(value.mode), JSON.stringify({completed:true, sessionId:value.sessionId, accessToken:access.tokenFor(value.sessionId)})) } catch { /* Access stays in memory during this visit. */ }
})
</script>
<template>
  <section class="mx-auto max-w-5xl space-y-8 px-5 py-12 sm:px-8">
    <h1 class="text-3xl font-semibold text-white sm:text-4xl">{{ result?.mode === 'fair' ? 'Suas respostas no desafio' : 'Seu resultado na pesquisa' }}</h1>
    <p v-if="!missingAccess && (status === 'pending' || status === 'idle')" role="status">Carregando resultado…</p>
    <div v-else-if="error || missingAccess" role="alert" class="space-y-4 rounded-xl border border-rose-800 p-5">
      <p>{{ missingAccess || error?.statusCode === 403 ? 'Acesso à sessão não autorizado. Use o dispositivo em que iniciou a participação.' : error?.statusCode === 404 ? 'Sessão não encontrada. Confira o link.' : error?.statusCode === 409 ? 'Esta sessão ainda não foi concluída. Retome sua participação.' : 'Não foi possível carregar o resultado. Tente novamente em instantes.' }}</p>
      <UButton v-if="!missingAccess" @click="refresh()">Tentar novamente</UButton>
      <UButton to="/pesquisa" variant="outline" class="ml-3">Pesquisa</UButton>
      <UButton to="/desafio" variant="outline" class="ml-3">Desafio</UButton>
    </div>
    <template v-else-if="result">
      <p class="max-w-3xl leading-7 text-slate-300">Este é um retrato das suas respostas às situações apresentadas. O instrumento não é psicometricamente validado e não certifica alfabetização digital.</p>
      <p v-if="result.mode === 'fair'" class="rounded-xl border border-teal-800 p-5 text-teal-200">Experiência rápida: este resultado se limita às competências apresentadas e não representa um diagnóstico completo.</p>
      <div v-else class="rounded-2xl border border-slate-700 bg-slate-900 p-6">
        <p class="text-sm text-slate-300">Percentual geral nas situações apresentadas</p>
        <p class="mt-2 text-4xl font-semibold text-teal-200">{{ result.overallPercentage?.toFixed(1) }}%</p>
        <p class="mt-2 text-sm text-slate-400">{{ result.earnedScore }} de {{ result.maxScore }} pontos possíveis</p>
      </div>
      <h2 class="text-2xl font-semibold">Desempenho por competência</h2>
      <div class="grid gap-4 md:grid-cols-2">
        <article v-for="c in competencies" :key="c.competency" class="space-y-4 rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
          <DataBars :label="competencyLabels[c.competency]" :items="[{label:competencyLabels[c.competency],value:c.percentage}]" />
          <p class="text-sm text-slate-400">{{ c.earnedScore }} / {{ c.maxScore }} pontos nas questões recebidas</p>
          <p class="text-sm leading-6 text-slate-300">{{ c.feedback }}</p>
        </article>
      </div>
      <section class="space-y-4 border-y border-slate-800 py-6">
        <h2 class="text-xl font-semibold">Para continuar aprendendo</h2>
        <p v-if="tied">As competências apresentadas tiveram o mesmo percentual. Explore novas situações em todos esses eixos.</p>
        <template v-else>
          <p><strong class="text-teal-200">Maior desempenho:</strong> {{ labelsAt(highest) }}.</p>
          <p><strong class="text-teal-200">Maiores oportunidades de desenvolvimento:</strong> {{ labelsAt(lowest) }}.</p>
        </template>
        <p class="text-sm text-slate-400">Pratique em ambientes de teste, consulte orientações oficiais e compare informações antes de agir. Os percentuais consideram apenas as questões apresentadas em cada competência.</p>
      </section>
      <p class="text-sm text-slate-400">Consulte este resultado no mesmo navegador e dispositivo. O link sozinho não permite acesso à sua participação.</p>
      <UButton to="/" variant="outline">Voltar ao início</UButton>
    </template>
  </section>
</template>
