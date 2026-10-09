<script setup lang="ts">
import { Bar } from 'vue-chartjs'
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip } from 'chart.js'
import type { ChartOptions } from 'chart.js'
ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip)
const props = defineProps<{ items: { label: string; value: number; detail?: string }[]; label: string }>()
const data = computed(() => ({ labels: props.items.map(i => i.label), datasets: [{ label: 'Percentual', data: props.items.map(i => i.value), backgroundColor: '#5eead4', borderRadius: 5 }] }))
const options: ChartOptions<'bar'> = {
  responsive: true, maintainAspectRatio: false, indexAxis: 'y', animation: false,
  scales: { x: { min: 0, max: 100, ticks: { color: '#cbd5e1', callback: value => `${value}%` }, grid: { color: '#334155' } }, y: { ticks: { color: '#e2e8f0' }, grid: { display: false } } },
  plugins: { legend: { display: false } }
}
</script>
<template>
  <div class="space-y-4">
    <ClientOnly><div class="h-56" aria-hidden="true"><Bar :data="data" :options="options" /></div></ClientOnly>
    <ul :aria-label="label" class="space-y-2 text-sm">
      <li v-for="item in items" :key="item.label" class="flex justify-between gap-3"><span>{{ item.label }}</span><span class="text-teal-200">{{ item.value.toFixed(1) }}% <span class="text-slate-400">{{ item.detail }}</span></span></li>
    </ul>
  </div>
</template>
