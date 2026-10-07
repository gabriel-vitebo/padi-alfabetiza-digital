<script setup lang="ts">
import { diagnosticQuestions } from '~/data/diagnostic-questions'
import { useDiagnostic } from '~/composables/use-diagnostic'
import { resolveQuestionConfig } from '~/utils/question-config'
import { selectQuestions } from '~/utils/select-questions'
import type { Question } from '~/types/diagnostic'

const route = useRoute()
const sessionQuestions = useState<Question[]>('question-session-questions', () => [])
const sessionConfig = useState<ReturnType<typeof resolveQuestionConfig> | null>('question-session-config', () => null)

if (!sessionQuestions.value.length || !sessionConfig.value) {
  const config = resolveQuestionConfig(route.query, diagnosticQuestions)
  sessionConfig.value = config
  sessionQuestions.value = selectQuestions({
    questions: diagnosticQuestions,
    total: config.total,
    context: config.context
  })
}

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
} = useDiagnostic(sessionQuestions.value)

const isFairContext = computed(() => sessionConfig.value?.context === 'feira')

const finishQuestionnaire = async () => {
  if (!finish()) return
  await navigateTo('/resultado')
}
</script>

<template>
  <section class="mx-auto w-full max-w-3xl px-5 py-8 sm:px-8 sm:py-14">
    <div v-if="currentQuestion" class="space-y-8">
      <div class="space-y-3">
        <p class="text-sm font-semibold uppercase tracking-[0.18em] text-teal-300">
          {{ isFairContext ? 'Desafio Digital' : 'Diagnóstico de Competências Digitais' }}
        </p>
        <p class="max-w-xl text-sm leading-6 text-slate-400">
          {{ isFairContext ? 'Uma experiência rápida com situações do cotidiano digital.' : 'Um retrato das suas respostas às situações digitais apresentadas.' }}
        </p>
      </div>

      <QuestionProgress
        :current="currentIndex + 1"
        :total="sessionQuestions.length"
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
          @click="isLastQuestion ? finishQuestionnaire() : next()"
        >
          {{ isLastQuestion ? (isFairContext ? 'Ver resultado' : 'Finalizar diagnóstico') : 'Continuar' }}
        </UButton>
      </div>
    </div>
  </section>
</template>