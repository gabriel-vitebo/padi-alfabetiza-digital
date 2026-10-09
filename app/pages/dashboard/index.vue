<script setup lang="ts">
import { contextualOptions, profileLabels } from '#shared/config'
import { competencyLabels } from '#shared/diagnostic'
import type { DashboardSummary } from '#shared/dashboard'
const filters = ref({course:'',semester:'',device:'',internet:''})
const query = computed(() => Object.fromEntries(Object.entries(filters.value).filter(([,value]) => value)))
const { data, status, error, refresh } = await useFetch<DashboardSummary>('/api/dashboard/summary', { query })
const segment = computed(() => data.value?.segment)
const labelFor = (key: string, value: string) => contextualOptions[key as keyof typeof contextualOptions]?.find(o => o.value === value)?.label ?? value
const overallFor = (id: string) => data.value?.overall?.competencies.find(c => c.competency === id)?.average
useHead({title:'Dashboard da pesquisa · PADI'})
</script>
<template>
  <section class="mx-auto max-w-6xl space-y-8 px-5 py-10 sm:px-8">
    <header class="space-y-3">
      <p class="text-sm font-semibold uppercase tracking-widest text-teal-300">Pesquisa acadêmica</p>
      <h1 class="text-3xl font-semibold text-white sm:text-4xl">Retrato das participações</h1>
      <p class="max-w-3xl leading-7 text-slate-300">Somente pesquisas concluídas. Resultados descritivos, sem inferência causal. O Desafio Digital não compõe esta amostra.</p>
    </header>
    <form class="grid gap-4 rounded-2xl border border-slate-800 bg-slate-900 p-5 sm:grid-cols-2 lg:grid-cols-4" @submit.prevent>
      <div v-for="(_value, key) in filters" :key="key" class="space-y-2">
        <label :for="`filter-${key}`" class="block text-sm font-medium">{{ profileLabels[key] }}</label>
        <select :id="`filter-${key}`" v-model="filters[key]" class="w-full rounded-lg border border-slate-600 bg-slate-950 p-3 text-white">
          <option value="">Todos</option>
          <option v-for="option in contextualOptions[key]" :key="option.value" :value="option.value">{{ option.label }}</option>
        </select>
      </div>
    </form>
    <UButton variant="outline" color="neutral" :loading="status === 'pending'" @click="refresh()">Atualizar resultados</UButton>
    <p v-if="status === 'pending'" role="status">Carregando resultados agregados…</p>
    <div v-else-if="error" role="alert" class="rounded-xl border border-rose-700 p-5">Não foi possível consultar os resultados. O serviço pode estar temporariamente indisponível. Tente atualizar em instantes.</div>
    <p v-else-if="data?.status === 'empty'" role="status" class="rounded-xl border border-slate-700 p-6">A pesquisa ainda não tem participações concluídas.</p>
    <p v-else-if="data?.status === 'insufficient'" role="status" class="rounded-xl border border-amber-700 p-6">Amostra insuficiente para detalhamento. São necessários ao menos {{ data.minimum }} participantes no segmento e proteção dos grupos complementares. Amplie os filtros.</p>
    <template v-else-if="segment">
      <p v-if="segment.syntheticCount" role="status" class="rounded-xl border border-amber-600 p-4 text-amber-200">Amostra de desenvolvimento: contém dados fictícios. Não usar como evidência da pesquisa.</p>
      <div class="grid gap-4 sm:grid-cols-3">
        <article class="rounded-2xl border border-slate-800 bg-slate-900 p-6"><h2 class="text-sm text-slate-300">Participações no segmento</h2><p class="mt-3 text-4xl font-semibold text-teal-200">{{ segment.count }}</p></article>
        <article class="rounded-2xl border border-slate-800 bg-slate-900 p-6"><h2 class="text-sm text-slate-300">Média geral do segmento</h2><p class="mt-3 text-4xl font-semibold text-teal-200">{{ segment.average.toFixed(1) }}%</p></article>
        <article class="rounded-2xl border border-slate-800 bg-slate-900 p-6"><h2 class="text-sm text-slate-300">Amostra geral · {{ data?.overall?.count }} participações</h2><p class="mt-3 text-4xl font-semibold text-teal-200">{{ data?.overall?.average.toFixed(1) }}%</p></article>
      </div>
      <section class="space-y-5 rounded-2xl border border-slate-800 p-6">
        <h2 class="text-2xl font-semibold">Competências: segmento e amostra geral</h2>
        <p class="text-sm text-slate-400">Média dos percentuais individuais, normalizados pelas questões recebidas. n indica participantes no eixo. Faixas são descritivas, sem classificação de pessoas.</p>
        <div class="grid gap-6 md:grid-cols-2">
          <article v-for="c in segment.competencies" :key="c.competency" class="space-y-4 rounded-xl bg-slate-900 p-5">
            <h3 class="font-semibold">{{ competencyLabels[c.competency] }} <span class="text-sm text-slate-400">(n={{ c.count }})</span></h3>
            <DataBars :label="competencyLabels[c.competency]" :items="[{label:'Segmento',value:c.average}, ...(overallFor(c.competency) !== undefined ? [{label:'Amostra geral',value:overallFor(c.competency)!}] : [])]" />
            <div v-if="c.distribution" class="flex flex-wrap gap-3 border-t border-slate-700 pt-3 text-xs text-slate-300"><span v-for="bin in c.distribution" :key="bin.value">{{ bin.value }}: {{ bin.percentage.toFixed(1) }}% ({{ bin.count }})</span></div>
            <p v-else class="text-xs text-slate-400">Distribuição protegida por conter grupos pequenos.</p>
          </article>
        </div>
      </section>
      <section class="space-y-5">
        <h2 class="text-2xl font-semibold">Perfil contextual</h2>
        <div class="grid gap-4 md:grid-cols-2">
          <article v-for="(distribution,key) in segment.demographics" :key="key" class="space-y-5 rounded-2xl border border-slate-800 bg-slate-900 p-5">
            <h3 class="font-semibold">{{ profileLabels[key as keyof typeof profileLabels] }}</h3>
            <DistributionChart v-if="distribution" :label="String(key)" :items="distribution.map(d => ({label:labelFor(String(key),d.value),value:d.percentage,detail:`n=${d.count}`}))" />
            <p v-else class="text-sm text-slate-400">Distribuição protegida por conter grupos com menos de {{ data?.minimum }} participantes.</p>
          </article>
        </div>
      </section>
      <section class="space-y-5">
        <h2 class="text-2xl font-semibold">Questões com maior oportunidade de desenvolvimento</h2>
        <p class="text-sm text-slate-400">Ordenadas do menor ao maior percentual médio. Questões com poucas respostas são omitidas.</p>
        <div class="overflow-x-auto rounded-xl border border-slate-800">
          <table class="w-full text-left text-sm">
            <caption class="sr-only">Desempenho por questão e distribuição dos pontos</caption>
            <thead class="bg-slate-900"><tr><th scope="col" class="p-4">Questão</th><th scope="col" class="p-4">Respostas</th><th scope="col" class="p-4">Média</th><th scope="col" class="p-4">Distribuição</th></tr></thead>
            <tbody><tr v-for="q in segment.questions" :key="q.id" class="border-t border-slate-800"><th scope="row" class="p-4 font-medium">{{ q.id }} — {{ q.title }}</th><td class="p-4">{{ q.count }}</td><td class="p-4 text-teal-200">{{ q.average.toFixed(1) }}%</td><td class="p-4"><div v-if="q.distribution" class="flex flex-wrap gap-3"><span v-for="bin in q.distribution" :key="bin.value">{{ bin.value }} pontos: {{ bin.percentage.toFixed(1) }}%</span></div><span v-else class="text-slate-400">Distribuição protegida</span></td></tr></tbody>
          </table>
        </div>
      </section>
      <p class="text-sm leading-6 text-slate-400">O instrumento não é psicometricamente validado. As perguntas são sorteadas; percentuais de grupos diferentes não demonstram causas. A participação é anônima e o controle neste dispositivo não garante uma resposta por pessoa.</p>
    </template>
  </section>
</template>
