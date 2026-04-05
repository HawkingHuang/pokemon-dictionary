<script setup lang="ts">
import { Chart, BarController, BarElement, CategoryScale, LinearScale, Tooltip } from 'chart.js'
import type { Stat, Move, Location } from '@/types/pokemon'

Chart.register(BarController, BarElement, CategoryScale, LinearScale, Tooltip)

const props = defineProps<{
  stats: Stat[]
  moves: Move[]
  locations: Location[]
}>()

const showWhatSection = ref<string>('stats')
const statsCanvas = ref<HTMLCanvasElement | null>(null)
let chart: Chart | null = null

const statsWithoutTotal = computed(() => props.stats.filter(s => s.stat !== 'Total'))
const totalStat = computed(() => props.stats.find(s => s.stat === 'Total'))

function buildChart() {
  if (!statsCanvas.value) return
  chart?.destroy()

  const labels = statsWithoutTotal.value.map(s => s.stat)
  const data   = statsWithoutTotal.value.map(s => s.base)
  const colors = labels.map(l => STAT_COLORS[l] ?? 'rgba(100, 181, 246, 0.8)')

  chart = new Chart(statsCanvas.value, {
    type: 'bar',
    data: {
      labels,
      datasets: [{
        data,
        backgroundColor: colors,
        borderColor: colors.map(c => c.replace('0.8', '1')),
        borderWidth: 1,
        borderRadius: 4,
      }]
    },
    options: {
      indexAxis: 'y',
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: (ctx) => ` ${ctx.parsed.x}`
          }
        }
      },
      scales: {
        x: {
          min: 0,
          max: 200,
          grid: { color: 'rgba(200,200,200,0.5)' },
          ticks: { color: '#9ca3af' }
        },
        y: {
          grid: { display: false },
          ticks: { color: '#495057', font: { size: 13 } }
        }
      }
    }
  })
}

watch(showWhatSection, (val) => {
  if (val === 'stats') {
    nextTick(buildChart)
  } else {
    chart?.destroy()
    chart = null
  }
})

onMounted(() => {
  nextTick(buildChart)
})

onUnmounted(() => {
  chart?.destroy()
})
</script>

<template>
  <UCard class="w-[100%] md:w-[70%] xl:w-[40%] mx-auto split-right-card">
    <main class="text-lg">
      <nav class="flex gap-2">
        <UButton class="text-lg" @click="showWhatSection = 'stats'">
          <UIcon name="gridicons:stats" class="w-5 h-5" />Stats
        </UButton>
        <UButton class="text-lg" @click="showWhatSection = 'moves'">
          <UIcon name="charm:sword" class="w-5 h-5" />Moves
        </UButton>
        <UButton v-if="locations.length > 0" class="text-lg" @click="showWhatSection = 'locations'">
          <UIcon name="material-symbols:location-on-outline-rounded" class="w-5 h-5" />Locations
        </UButton>
      </nav>

      <div v-if="showWhatSection === 'stats'" class="mt-4">
        <ClientOnly>
          <div class="relative" style="height: 260px;">
            <canvas ref="statsCanvas" />
          </div>
          <p v-if="totalStat" class="text-right text-sm text-gray-400 mt-2">
            Total: <span class="font-semibold text-gray-500">{{ totalStat.base }}</span>
          </p>
        </ClientOnly>
      </div>

      <UTable v-if="showWhatSection === 'moves'" :rows="moves" class="max-h-[80vh] overflow-y-auto custom-scroll"/>
      <UTable v-if="showWhatSection === 'locations'" :rows="locations" class="max-h-[80vh] overflow-y-auto custom-scroll"/>
    </main>
  </UCard>
</template>
