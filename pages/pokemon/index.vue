<script setup lang="ts">
import { Chart, BarController, BarElement, CategoryScale, LinearScale, Tooltip } from 'chart.js'

Chart.register(BarController, BarElement, CategoryScale, LinearScale, Tooltip)

definePageMeta({
  layout: 'base-layout'
})

interface Stat {
  stat: string,
  base: number
}

const getStats = (res: any) => {
  const baseFiveStats =  res.stats.map((stat: any) => {
    return { stat: capitalizeVersion(stat.stat.name), base: stat.base_stat }
  })
  baseFiveStats.push({ stat: 'Total', base: baseFiveStats.reduce((acc: number, cur: Stat) => {
    return acc + cur.base
  }, 0)})

  return baseFiveStats
}

const firstStatsCanvas = ref<HTMLCanvasElement | null>(null)
const secondStatsCanvas = ref<HTMLCanvasElement | null>(null)
const compareCanvas = ref<HTMLCanvasElement | null>(null)
const charts: { first: Chart | null, second: Chart | null, compare: Chart | null } = { first: null, second: null, compare: null }

function buildChart(canvas: HTMLCanvasElement, stats: Stat[]): Chart {
  const filtered = stats.filter(s => s.stat !== 'Total')
  const labels = filtered.map(s => s.stat)
  const data = filtered.map(s => s.base)
  const colors = labels.map(l => STAT_COLORS[l] ?? 'rgba(100, 181, 246, 0.8)')

  return new Chart(canvas, {
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
        tooltip: { callbacks: { label: (ctx) => ` ${ctx.parsed.x}` } }
      },
      scales: {
        x: { min: 0, max: 200, grid: { color: 'rgba(200,200,200,0.5)' }, ticks: { color: '#9ca3af' } },
        y: { grid: { display: false }, ticks: { color: '#495057', font: { size: 13 } } }
      }
    }
  })
}

function buildCompareChart(canvas: HTMLCanvasElement, firstStats: Stat[], secondStats: Stat[], firstName: string, secondName: string): Chart {
  const labels = firstStats.map(s => s.stat)
  const firstData = firstStats.map(s => s.base)
  const secondData = secondStats.map(s => s.base)

  return new Chart(canvas, {
    type: 'bar',
    data: {
      labels,
      datasets: [
        {
          label: firstName,
          data: firstData,
          backgroundColor: 'rgba(96, 165, 250, 0.8)',
          borderColor: 'rgba(96, 165, 250, 1)',
          borderWidth: 1,
          borderRadius: 4,
        },
        {
          label: secondName,
          data: secondData,
          backgroundColor: 'rgba(248, 113, 113, 0.8)',
          borderColor: 'rgba(248, 113, 113, 1)',
          borderWidth: 1,
          borderRadius: 4,
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: true, labels: { color: '#495057' } },
        tooltip: { callbacks: { label: (ctx) => ` ${ctx.dataset.label}: ${ctx.parsed.y}` } }
      },
      scales: {
        x: { grid: { display: false }, ticks: { color: '#495057', font: { size: 11 } } },
        y: { min: 0, max: 700, grid: { color: 'rgba(200,200,200,0.5)' }, ticks: { color: '#9ca3af' } }
      }
    }
  })
}

const firstPokemonInput = ref<string>('')
const firstPokemonBasicInfo = ref<any>({})
const firstPokemonStats = ref<Stat[]>([])
const showFirstPokemon = ref<boolean>(false)

const secondPokemonInput = ref<string>('')
const secondPokemonBasicInfo = ref<any>({})
const secondPokemonStats = ref<Stat[]>([])
const showSecondPokemon = ref<boolean>(false)

const searchPokemon = (pokemon: string, slot: 'first' | 'second') => {
  const basicInfo = slot === 'first' ? firstPokemonBasicInfo : secondPokemonBasicInfo
  const stats = slot === 'first' ? firstPokemonStats : secondPokemonStats
  const show = slot === 'first' ? showFirstPokemon : showSecondPokemon
  const canvas = slot === 'first' ? firstStatsCanvas : secondStatsCanvas

  if (slot === 'second') show.value = false

  $.ajax({
    url: `https://pokeapi.co/api/v2/pokemon/${pokemon.toLowerCase()}`,
    type: 'GET',
    dataType: 'json',
    success: (res) => {
      basicInfo.value = res
      stats.value = getStats(res)
      show.value = true
      nextTick(() => {
        if (canvas.value) {
          charts[slot]?.destroy()
          charts[slot] = buildChart(canvas.value, stats.value)
        }
      })
    },
    error: (error) => {
      if (error instanceof Error) console.error(error.message, error.stack)
      else console.error(error)
    }
  })
}


const pokemonSearchList = ref<string[]>([])

const filterPokemon = (query: string) => {
  const q = query?.trim()
  if (!q || q.length < 2) return []
  return pokemonSearchList.value.filter(name =>
    name.toLowerCase().startsWith(q.toLowerCase())
  )
}

const firstPokemonQuery = ref<string>('')
const filteredFirstPokemonList = computed(() => filterPokemon(firstPokemonQuery.value))

const secondPokemonQuery = ref<string>('')
const filteredSecondPokemonList = computed(() => filterPokemon(secondPokemonQuery.value))

onMounted(() => {
  $.ajax({
    url: 'https://pokeapi.co/api/v2/pokemon?limit=1025',
    type: 'GET',
    dataType: 'json',
    success: (res) => {
      pokemonSearchList.value = res.results.map((pokemon: any) => {
        return capitalizeName(pokemon.name)
      })
    },
    error: (error) => {
      if (error instanceof Error) console.error(error.message, error.stack)
      else console.error(error)
    }
  })
})

const isOpen = ref<boolean>(false)
const comparePokemons = () => { isOpen.value = true }

watch(isOpen, (val) => {
  if (val) {
    nextTick(() => {
      if (compareCanvas.value) {
        charts.compare?.destroy()
        charts.compare = buildCompareChart(
          compareCanvas.value,
          firstPokemonStats.value,
          secondPokemonStats.value,
          capitalizeName(firstPokemonBasicInfo.value.name),
          capitalizeName(secondPokemonBasicInfo.value.name)
        )
      }
    })
  } else {
    charts.compare?.destroy()
    charts.compare = null
  }
}, { flush: 'post' })

onUnmounted(() => {
  charts.first?.destroy()
  charts.second?.destroy()
  charts.compare?.destroy()
})

</script>

<template>
  <div>
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-2 mt-4">
      <div class="flex gap-2 max-w-[400px]">
        <UInputMenu v-model="firstPokemonInput" v-model:query="firstPokemonQuery" :options="filteredFirstPokemonList" placeholder="Type at least 2 letters..." size="xl" class="w-[300px]"/>
        <UButton @click="searchPokemon(firstPokemonInput, 'first')" size="md"><UIcon name="material-symbols:search-rounded" class="w-6 h-6" />Search</UButton>
      </div>
      <div v-if="showFirstPokemon" class="flex gap-2 max-w-[400px]">
        <UInputMenu v-model="secondPokemonInput" v-model:query="secondPokemonQuery" :options="filteredSecondPokemonList" placeholder="Type at least 2 letters..." size="xl" class="w-[300px]"/>
        <UButton @click="searchPokemon(secondPokemonInput, 'second')" size="md"><UIcon name="material-symbols:search-rounded" class="w-6 h-6" />Search</UButton>
      </div>
    </div>
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-2 mt-4">
      <UCard v-if="showFirstPokemon" class="animate">
        <template #header>
          <span class="flex items-center text-xl font-bold bg-gray-200 p-1 rounded max-w-[75px]"><UIcon name="i-gg:pokemon" class="w-6 h-6 mr-1" /> {{ firstPokemonBasicInfo.id }}</span>
          <h4 class="text-xl font-bold mt-2">{{ capitalizeName(firstPokemonBasicInfo.name) }}</h4>
          <img :src="`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${firstPokemonBasicInfo.id}.png`" class="max-h-[225px] w-auto mx-auto">
        </template>

        <main class="text-lg">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-2">
            <div>
              <div class="border rounded p-4 mb-2">
                <span class="bg-green-400 p-1 rounded inline-block">Type</span>
                <span v-for="type in firstPokemonBasicInfo.types" :key="type.type.name" class="bg-gray-200 p-1 rounded ml-1 mt-1 inline-block">{{ capitalizeName(type.type.name) }}</span>
              </div>
              <div class="border rounded p-4 mb-2">
                <span class="bg-green-400 p-1 rounded inline-block">Abilities</span>
                <span v-for="ability in firstPokemonBasicInfo.abilities" :key="ability.ability" class="bg-gray-200 p-1 rounded ml-1 mt-1 inline-block">{{ capitalizeVersion(ability.ability.name) }}</span>
              </div>
              <div class="border rounded p-4 mb-2">
                <span class="bg-green-400 p-1 rounded inline-block">Held Items</span>
                <span v-for="item in firstPokemonBasicInfo.held_items" :key="item.item.name" class="bg-gray-200 p-1 rounded ml-1 mt-1 inline-block">{{ capitalizeVersion(item.item.name) }}</span>
              </div>
              <div class="border rounded p-4 mb-2">
                <div class="flex gap-4">
                  <div>
                    <span class="bg-green-400 p-1 rounded inline-block">Height</span>
                    <span class="bg-gray-200 p-1 rounded ml-1 inline-block">{{ firstPokemonBasicInfo.height / 10 }} m</span>
                  </div>
                  <div>
                    <span class="bg-green-400 p-1 rounded inline-block">Weight</span>
                    <span class="bg-gray-200 p-1 rounded ml-1 inline-block">{{ firstPokemonBasicInfo.weight / 10 }} kg</span>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <ClientOnly>
                <div class="relative" style="height: 220px;">
                  <canvas ref="firstStatsCanvas" />
                </div>
                <p class="text-right text-sm text-gray-400 mt-1">
                  Total: <span class="font-semibold text-gray-500">{{ firstPokemonStats.find(s => s.stat === 'Total')?.base }}</span>
                </p>
              </ClientOnly>
            </div>
          </div>
        </main>
      </UCard>
      <UCard v-if="showSecondPokemon" class="animate relative">
        <UButton @click="comparePokemons" class="absolute top-4 right-4" color="yellow" size="md"><UIcon name="material-symbols:compare-arrows" class="w-6 h-6 mr-1" />Compare</UButton>
        <template #header>
          <span class="flex items-center text-xl font-bold bg-gray-200 p-1 rounded max-w-[75px]"><UIcon name="i-gg:pokemon" class="w-6 h-6 mr-1" /> {{ secondPokemonBasicInfo.id }}</span>
          <h4 class="text-xl font-bold mt-2">{{ capitalizeName(secondPokemonBasicInfo.name) }}</h4>
          <img :src="`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${secondPokemonBasicInfo.id}.png`" class="max-h-[225px] w-auto mx-auto">
        </template>

        <main class="text-lg">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-2">
            <div>
              <div class="border rounded p-4 mb-2">
                <span class="bg-green-400 p-1 rounded inline-block">Type</span>
                <span v-for="type in secondPokemonBasicInfo.types" :key="type.type.name" class="bg-gray-200 p-1 rounded ml-1 mt-1 inline-block">{{ capitalizeName(type.type.name) }}</span>
              </div>
              <div class="border rounded p-4 mb-2">
                <span class="bg-green-400 p-1 rounded inline-block">Abilities</span>
                <span v-for="ability in secondPokemonBasicInfo.abilities" :key="ability.ability" class="bg-gray-200 p-1 rounded ml-1 mt-1 inline-block">{{ capitalizeVersion(ability.ability.name) }}</span>
              </div>
              <div class="border rounded p-4 mb-2">
                <span class="bg-green-400 p-1 rounded inline-block">Held Items</span>
                <span v-for="item in secondPokemonBasicInfo.held_items" :key="item.item.name" class="bg-gray-200 p-1 rounded ml-1 mt-1 inline-block">{{ capitalizeVersion(item.item.name) }}</span>
              </div>
              <div class="border rounded p-4 mb-2">
                <div class="flex gap-4">
                  <div>
                    <span class="bg-green-400 p-1 rounded inline-block">Height</span>
                    <span class="bg-gray-200 p-1 rounded ml-1 inline-block">{{ secondPokemonBasicInfo.height / 10 }} m</span>
                  </div>
                  <div>
                    <span class="bg-green-400 p-1 rounded inline-block">Weight</span>
                    <span class="bg-gray-200 p-1 rounded ml-1 inline-block">{{ secondPokemonBasicInfo.weight / 10 }} kg</span>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <ClientOnly>
                <div class="relative" style="height: 220px;">
                  <canvas ref="secondStatsCanvas" />
                </div>
                <p class="text-right text-sm text-gray-400 mt-1">
                  Total: <span class="font-semibold text-gray-500">{{ secondPokemonStats.find(s => s.stat === 'Total')?.base }}</span>
                </p>
              </ClientOnly>
            </div>
          </div>
        </main>
      </UCard>
      <UModal v-model="isOpen" :ui="{ width: 'max-w-[95vw] sm:max-w-[70vw] lg:max-w-[50vw]' }" class="p-2">
        <div class="flex justify-around p-4">
          <div class="bg-blue-400/80 rounded-full p-2">
            <img :src="`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${firstPokemonBasicInfo.id}.png`" alt="" class="w-24 h-24 object-contain">
          </div>
          <div class="bg-red-400/80 rounded-full p-2">
            <img :src="`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${secondPokemonBasicInfo.id}.png`" alt="" class="w-24 h-24 object-contain">
          </div>
        </div>
        <ClientOnly>
          <div class="relative px-4 pb-4" style="height: 400px;">
            <canvas ref="compareCanvas" />
          </div>
        </ClientOnly>
      </UModal>
    </div>
  </div>
</template>


<style scoped>
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.animate {
  animation: fadeIn 1.2s ease-in;
}

@keyframes slide {
  0% {
    transform: translateX(-10px);
  }
  50% {
    transform: translateX(10px);
  }
  100% {
    transform: translateX(-10px);
  }
}

.animate-slide {
  animation: slide 1.5s ease-in-out infinite;
}
</style>