<script setup lang="ts">
import { computed } from 'vue'
import { diagnosticQuestions } from '~/data/diagnostic-questions'
import { useDiagnostic } from '~/composables/use-diagnostic'
import { getCompetencyLabel } from '~/utils/diagnostic-result'

const { result, reset } = useDiagnostic(diagnosticQuestions)
const competencies = computed(() => result.value?.competencies ?? [])
const hasResult = computed(() => Boolean(result.value))
const highestPercentage = computed(() => {
  if (!competencies.value.length) return 0
  return Math.max(...competencies.value.map(item => item.percentage))
})
const lowestPercentage = computed(() => {
  if (!competencies.value.length) return 0
  return Math.min(...competencies.value.map(item => item.percentage))
})
const highestCompetencies = computed(() => competencies.value.filter(item => item.percentage === highestPercentage.value))
const lowestCompetencies = computed(() => competencies.value.filter(item => item.percentage === lowestPercentage.value))

const formatPercentage = (percentage: number) => `${Math.round(percentage)}%`

const formatCompetencyList = (items: typeof competencies.value) => {
  const labels = items.map(item => getCompetencyLabel(item.competency))
  if (labels.length <= 1) return labels[0] ?? ''
  if (labels.length === 2) return `${labels[0]} e ${labels[1]}`
  return `${labels.slice(0, -1).join(', ')} e ${labels.at(-1)}`
}

const restartDiagnostic = async () => {
  reset()
  await navigateTo('/diagnostico')
}
</script>

<template>
  <section class="mx-auto w-full max-w-5xl px-5 py-10 sm:px-8 sm:py-16">
    <div v-if="!hasResult" class="rounded-3xl border border-slate-800 bg-slate-900/80 px-5 py-10 text-center shadow-2xl shadow-black/20 sm:px-10 sm:py-14">
      <p class="text-sm font-semibold uppercase tracking-[0.18em] text-teal-300">Resultado indisponível</p>
      <h1 class="mt-4 text-3xl font-semibold tracking-tight text-white sm:text-4xl">Nenhum diagnóstico concluído</h1>
      <p class="mx-auto mt-5 max-w-lg text-base leading-7 text-slate-300">Conclua o questionário para visualizar um retrato das suas respostas e das competências apresentadas.</p>
      <UButton class="mt-8" size="lg" leading-icon="i-lucide-arrow-right" @click="restartDiagnostic">
        Iniciar diagnóstico
      </UButton>
    </div>

    <div v-else class="space-y-10">
      <header class="max-w-3xl space-y-4">
        <p class="text-sm font-semibold uppercase tracking-[0.18em] text-teal-300">Diagnóstico concluído</p>
        <h1 class="text-3xl font-semibold tracking-tight text-white sm:text-5xl">Seu diagnóstico digital</h1>
        <p class="text-base leading-7 text-slate-300">Este resultado apresenta um retrato das suas respostas e pode ajudar a identificar competências já desenvolvidas e aspectos que ainda podem ser explorados.</p>
      </header>

      <section aria-labelledby="competencies-title" class="space-y-5">
        <div>
          <h2 id="competencies-title" class="text-2xl font-semibold text-white">Desempenho por competência</h2>
          <p class="mt-2 text-sm leading-6 text-slate-400">Os percentuais indicam a proporção de pontos alcançados nas situações apresentadas em cada competência.</p>
        </div>

        <div class="grid gap-4 md:grid-cols-2">
          <article v-for="item in competencies" :key="item.competency" class="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
            <div class="flex items-start justify-between gap-4">
              <h3 class="font-semibold leading-6 text-white">{{ getCompetencyLabel(item.competency) }}</h3>
              <span class="shrink-0 rounded-full bg-teal-950 px-3 py-1 text-sm font-semibold text-teal-200">{{ formatPercentage(item.percentage) }}</span>
            </div>
            <div class="mt-5 space-y-2">
              <div class="h-3 overflow-hidden rounded-full bg-slate-800" role="progressbar" :aria-label="`Percentual em ${getCompetencyLabel(item.competency)}`" aria-valuemin="0" aria-valuemax="100" :aria-valuenow="Math.round(item.percentage)" :aria-valuetext="formatPercentage(item.percentage)">
                <div class="h-full rounded-full bg-teal-300 transition-[width] duration-500" :style="{ width: `${item.percentage}%` }"></div>
              </div>
              <p class="text-sm leading-6 text-slate-300">{{ item.feedback }}</p>
            </div>
          </article>
        </div>
      </section>

      <section class="border-y border-slate-800 py-7" aria-labelledby="summary-title">
        <h2 id="summary-title" class="text-xl font-semibold text-white">Um resumo para continuar aprendendo</h2>
        <div class="mt-4 space-y-3 text-sm leading-6 text-slate-300">
          <p>Entre as situações apresentadas, <strong class="font-semibold text-teal-200">{{ formatCompetencyList(highestCompetencies) }}</strong> foi a competência em que suas respostas demonstraram maior domínio.</p>
          <p><strong class="font-semibold text-teal-200">{{ formatCompetencyList(lowestCompetencies) }}</strong> apresentou mais oportunidades de desenvolvimento.</p>
        </div>
      </section>

      <div class="flex flex-col gap-4 rounded-2xl border border-teal-900/70 bg-teal-950/30 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
        <p class="max-w-2xl text-sm leading-6 text-slate-300">Use este resultado como ponto de partida para explorar novas situações e conhecimentos digitais.</p>
        <UButton class="shrink-0 justify-center" size="lg" leading-icon="i-lucide-rotate-ccw" @click="restartDiagnostic">
          Refazer diagnóstico
        </UButton>
      </div>
    </div>
  </section>
</template>