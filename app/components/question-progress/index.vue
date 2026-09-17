<script setup lang="ts">
defineProps<{
  current: number
  total: number
  percentage: number
}>()
</script>

<template>
  <div class="space-y-3" aria-label="Progresso do diagnóstico">
    <div class="flex items-center justify-between gap-4 text-sm font-medium">
      <span class="text-slate-200">Pergunta {{ current }} de {{ total }}</span>
      <span class="text-teal-300">{{ percentage }}%</span>
    </div>
    <div
      class="h-2 overflow-hidden rounded-full bg-slate-800"
      role="progressbar"
      aria-label="Progresso do diagnóstico"
      aria-valuemin="0"
      :aria-valuemax="total"
      :aria-valuenow="current"
    >
      <div class="h-full rounded-full bg-teal-300 transition-[width] duration-300" :style="{ width: `${percentage}%` }"></div>
    </div>
  </div>
</template>