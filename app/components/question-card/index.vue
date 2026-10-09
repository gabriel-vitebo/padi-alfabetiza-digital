<script setup lang="ts">
import { competencyLabels, type Question } from '~/types/diagnostic'

defineProps<{
  question: Question
  selectedOption?: string
}>()

const emit = defineEmits<{
  select: [optionId: string]
}>()
</script>

<template>
  <article class="space-y-7">
    <div class="space-y-4">
      <p class="inline-flex rounded-full border border-teal-800 bg-teal-950/60 px-3 py-1 text-xs font-semibold text-teal-200">
        {{ competencyLabels[question.competency] }}
      </p>
      <h1 data-question-heading tabindex="-1" class="text-2xl font-semibold leading-tight tracking-tight text-white sm:text-3xl">{{ question.statement }}</h1>
    </div>

    <fieldset class="space-y-3">
      <legend class="sr-only">Escolha uma opção de resposta</legend>
      <QuestionOption
        v-for="option in question.options"
        :key="option.id"
        :id="option.id"
        :name="question.id"
        :label="option.label"
        :selected="selectedOption === option.id"
        @select="emit('select', $event)"
      />
    </fieldset>
  </article>
</template>