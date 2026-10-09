<script setup lang="ts">
defineProps<{ items: { label: string; value: number; detail?: string }[]; label: string }>()
</script>
<template>
  <ul :aria-label="label" class="space-y-4">
    <li v-for="item in items" :key="item.label" class="space-y-2">
      <div class="flex justify-between gap-3 text-sm"><span>{{ item.label }}</span><span class="shrink-0 font-semibold text-teal-200">{{ item.value.toFixed(1) }}%<span v-if="item.detail" class="ml-2 font-normal text-slate-400">{{ item.detail }}</span></span></div>
      <div class="h-2 overflow-hidden rounded-full bg-slate-800" aria-hidden="true"><div class="h-full rounded-full bg-teal-300" :style="{ width: `${Math.min(100, Math.max(0,item.value))}%` }" /></div>
    </li>
  </ul>
</template>
