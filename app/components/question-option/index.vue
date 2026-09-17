<script setup lang="ts">
defineProps<{
  id: string
  name: string
  label: string
  selected: boolean
}>()

const emit = defineEmits<{
  select: [id: string]
}>()
</script>

<template>
  <label class="group relative flex min-h-16 cursor-pointer items-center gap-4 rounded-2xl border border-slate-700 bg-slate-900/70 px-4 py-3 transition-colors hover:border-slate-500 has-focus-visible:border-teal-300 has-focus-visible:ring-2 has-focus-visible:ring-teal-300/50" :class="selected ? 'border-teal-300 bg-teal-950/50' : ''">
    <input
      :name="name"
      type="radio"
      :value="id"
      :checked="selected"
      class="peer sr-only"
      @change="emit('select', id)"
    >
    <span class="flex size-5 shrink-0 items-center justify-center rounded-full border-2 border-slate-500 peer-checked:border-teal-300" :class="selected ? 'border-teal-300' : ''" aria-hidden="true">
      <span v-if="selected" class="size-2.5 rounded-full bg-teal-300"></span>
    </span>
    <span class="text-sm leading-6 text-slate-200 sm:text-base">{{ label }}</span>
  </label>
</template>