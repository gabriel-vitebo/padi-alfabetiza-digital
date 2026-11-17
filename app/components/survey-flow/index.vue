<script setup lang="ts">
import { contextualOptions, profileLabels, surveyRules, type Profile } from '#shared/config'
import type { SurveyMode } from '#shared/diagnostic'
const props = defineProps<{ mode: SurveyMode }>()
const { canStartNewSession,restartUnavailable,session,loading,submitting,error,storageWarning,currentIndex,currentQuestion,currentAnswer,hasCurrentAnswer,isFirstQuestion,isLastQuestion,progress,start,restore,selectAnswer,next,previous,finish } = useDiagnostic(props.mode)
const profile = ref<Profile>({area:''})
const research = props.mode === 'research'
</script>

<template>
  <section class="mx-auto w-full max-w-3xl space-y-7 px-5 py-10 sm:px-8 sm:py-14" :aria-busy="loading || submitting">
    <p class="text-sm font-semibold uppercase tracking-widest text-teal-300">{{ research ? 'Pesquisa PADI' : 'Desafio Digital' }}</p>
    <p v-if="storageWarning" role="status" class="rounded-xl border border-amber-600 p-4 text-amber-200">{{ storageWarning }}</p>
    <div v-if="error" role="alert" class="space-y-3 rounded-xl border border-rose-700 p-4 text-rose-200">
      <p>{{ error }}</p>
      <UButton v-if="canStartNewSession" @click="restartUnavailable">Iniciar nova participação</UButton>
      <UButton v-else-if="!session" variant="outline" color="neutral" @click="restore">Tentar recuperar sessão</UButton>
    </div>
    <p v-if="loading" role="status">Carregando sua participação…</p>
    <div v-else-if="currentQuestion && session" class="space-y-8">
      <QuestionProgress :current="currentIndex + 1" :total="session.questions.length" :percentage="progress" />
      <fieldset :disabled="submitting" class="space-y-8">
        <legend class="sr-only">Questionário</legend>
        <QuestionCard :key="currentQuestion.id" :question="currentQuestion" :selected-option="currentAnswer" @select="selectAnswer" />
        <div class="flex justify-between gap-3">
          <UButton size="lg" color="neutral" variant="outline" :disabled="isFirstQuestion || submitting" @click="previous">Voltar</UButton>
          <UButton size="lg" :disabled="!hasCurrentAnswer || submitting" :loading="submitting" @click="isLastQuestion ? finish() : next()">{{ isLastQuestion ? 'Concluir e ver resultado' : 'Continuar' }}</UButton>
        </div>
      </fieldset>
      <p role="status" class="text-sm text-slate-400">{{ submitting ? 'Salvando sua resposta…' : 'Sua resposta é salva ao selecioná-la. Você pode voltar e alterá-la antes de concluir.' }}</p>
    </div>
    <form v-else-if="!error" class="space-y-7" @submit.prevent="start(research ? profile : undefined)">
      <h1 class="text-3xl font-semibold text-white sm:text-4xl">{{ research ? 'Como você lida com situações digitais?' : 'Experimente suas escolhas digitais' }}</h1>
      <p class="leading-7 text-slate-300">{{ research ? 'Participe de uma pesquisa acadêmica anônima sobre os sete eixos do PADI. Não pedimos nome, e-mail ou documentos.' : 'Uma experiência rápida durante a feira, limitada às competências apresentadas. Não representa um diagnóstico completo.' }}</p>
      <p class="text-slate-300">São {{ surveyRules[mode].questionCount }} situações. Escolha a alternativa que melhor representa o que você faria.</p>
      <div v-if="research" class="space-y-5">
        <div v-for="(options, key) in contextualOptions" :key="key" class="space-y-2">
          <label :for="`profile-${key}`" class="block text-sm font-medium">{{ profileLabels[key] }}</label>
          <select :id="`profile-${key}`" aria-describedby="profile-purpose" v-model="profile[key]" required class="w-full rounded-xl border border-slate-600 bg-slate-900 p-3 text-white">
            <option disabled value="">Selecione</option>
            <option v-for="option in options" :key="option.value" :value="option.value">{{ option.label }}</option>
          </select>
        </div>
      </div>
      <p v-if="research" id="profile-purpose" class="text-sm leading-6 text-slate-400">Escolha a área que mais combina com seus estudos ou trabalho. Usamos essa informação apenas para comparar os resultados entre áreas; ela não altera sua pontuação. Se preferir, selecione “Prefiro não informar”.</p>
      <p class="text-sm leading-6 text-slate-400">Participação voluntária. As respostas são salvas conforme você avança; se sair antes de concluir, elas entram apenas nas contagens agregadas por pergunta, sem gerar resultado individual. O instrumento não é psicometricamente validado. Os dados são usados de forma agregada neste trabalho acadêmico.</p>
      <UButton type="submit" size="xl" :loading="loading">{{ research ? 'Começar pesquisa' : 'Começar desafio' }}</UButton>
    </form>
  </section>
</template>
