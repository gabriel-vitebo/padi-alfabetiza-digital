<script setup lang="ts">
import { diagnosticQuestions } from '~/data/diagnostic-questions'
import { useDiagnostic } from '~/composables/use-diagnostic'

const {
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
  selectAnswer
} = useDiagnostic(diagnosticQuestions)

const finishDiagnostic = async () => {
  if (!finish()) return

  await navigateTo('/resultado')
}
</script>

<template>
  <section class="mx-auto w-full max-w-3xl px-5 py-8 sm:px-8 sm:py-14">
    <div v-if="currentQuestion" class="space-y-8">
      <div class="space-y-3">
        <p class="text-sm font-semibold uppercase tracking-[0.18em] text-teal-300">Diagnóstico de competências digitais</p>
        <p class="max-w-xl text-sm leading-6 text-slate-400">Perguntas mockadas para validar a experiência do questionário.</p>
      </div>

      <QuestionProgress
        :current="currentIndex + 1"
        :total="diagnosticQuestions.length"
        :percentage="progress"
      />

      <QuestionCard
        :question="currentQuestion"
        :selected-option="currentAnswer"
        @select="selectAnswer"
      />

      <div class="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-between">
        <UButton
          color="neutral"
          variant="outline"
          size="lg"
          :disabled="isFirstQuestion"
          leading-icon="i-lucide-arrow-left"
          class="justify-center sm:min-w-32"
          @click="previous"
        >
          Voltar
        </UButton>
        <UButton
          color="primary"
          size="lg"
          :disabled="!hasCurrentAnswer"
          trailing-icon="i-lucide-arrow-right"
          class="justify-center sm:min-w-48"
          @click="isLastQuestion ? finishDiagnostic() : next()"
        >
          {{ isLastQuestion ? 'Finalizar diagnóstico' : 'Continuar' }}
        </UButton>
      </div>
    </div>
  </section>
</template>