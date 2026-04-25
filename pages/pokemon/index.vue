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

interface StatCompare {
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
const charts: { first: Chart | null, second: Chart | null } = { first: null, second: null }

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

const firstPokemonInput = ref<string>('')
const firstPokemonBasicInfo = ref<any>({})
const firstPokemonStats = ref<Stat[]>([])
const firstPokemonStatsForCompare = ref<StatCompare[]>([])
const showFirstPokemon = ref<boolean>(false)

const secondPokemonInput = ref<string>('')
const secondPokemonBasicInfo = ref<any>({})
const secondPokemonStats = ref<Stat[]>([])
const secondPokemonStatsForCompare = ref<StatCompare[]>([])
const showSecondPokemon = ref<boolean>(false)

const searchPokemon = (pokemon: string, slot: 'first' | 'second') => {
  const basicInfo = slot === 'first' ? firstPokemonBasicInfo : secondPokemonBasicInfo
  const stats = slot === 'first' ? firstPokemonStats : secondPokemonStats
  const statsForCompare = slot === 'first' ? firstPokemonStatsForCompare : secondPokemonStatsForCompare
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
      statsForCompare.value = stats.value.map((stat: Stat) => ({ base: stat.base }))
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
const comparePokemons = () => {
  statDifferences.value = []
  calculateDifferences(firstPokemonStats.value, secondPokemonStats.value)
  isOpen.value = true
}

interface StatDiff {
  stat: string
}

const statDifferences = ref<StatDiff[]>([])
const calculateDifferences = (first: Stat[], second: Stat[]) => {
  for(let i = 0; i < first.length; i++) {
    const diff = second[i].base - first[i].base
    if (diff >= 0) {
      statDifferences.value.push({ stat: first[i].stat + ' ' + '+' + String(diff) }) 
    } else {
      statDifferences.value.push({ stat: first[i].stat + ' ' + String(diff) }) 
    }
  }
}

onUnmounted(() => {
  charts.first?.destroy()
  charts.second?.destroy()
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
      <UModal v-model="isOpen" class="p-2">
        <div class="grid grid-cols-3">
          <img :src="`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${firstPokemonBasicInfo.id}.png`" alt="">
          <div class="flex items-center justify-center">
            <UIcon name="material-symbols:keyboard-double-arrow-right-rounded" class="w-8 h-8 animate-slide" />
          </div>
          <img :src="`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${secondPokemonBasicInfo.id}.png`" alt="">
        </div>
        <div class="grid grid-cols-3">
          <UTable :rows="firstPokemonStatsForCompare" :ui="{ th: { base: 'text-center' }, td: { base: 'text-center' }, base: '!border-0 !divide-none' }"/>
          <UTable :rows="statDifferences" :ui="{ th: { base: 'text-center' }, td: { base: 'text-center' }, base: '!border-0 !divide-none' }"></UTable>
          <UTable :rows="secondPokemonStatsForCompare" :ui="{ th: { base: 'text-center' }, td: { base: 'text-center' }, base: '!border-0 !divide-none' }"/>
        </div>
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