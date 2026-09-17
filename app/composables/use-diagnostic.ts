import { computed, ref } from 'vue'
import type { Question } from '~/types/diagnostic'

export const useDiagnostic = (questions: Question[]) => {
  const currentIndex = ref(0)
  const answers = ref<Record<string, string>>({})
  const isCompleted = ref(false)

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
      isCompleted.value = true
      return
    }

    currentIndex.value += 1
  }

  const previous = () => {
    if (!isFirstQuestion.value) currentIndex.value -= 1
  }

  return {
    currentAnswer,
    currentIndex,
    currentQuestion,
    hasCurrentAnswer,
    isCompleted,
    isFirstQuestion,
    isLastQuestion,
    next,
    previous,
    progress,
    selectAnswer
  }
}