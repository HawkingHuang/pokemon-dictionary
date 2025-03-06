<script setup lang="ts">
import { capitalizeName } from '@/utils/capitalize'
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

const firstPokemonInput = ref<string>('')
const firstPokemonBasicInfo = ref<any>({})
const firstPokemonStats = ref<Stat[]>([])
const firstPokemonStatsForCompare = ref<StatCompare[]>([])
const showFirstPokemon = ref<boolean>(false)
const searchFirstPokemon = async (pokemon: string) => {
  $.ajax({
    url: `https://pokeapi.co/api/v2/pokemon/${pokemon.toLowerCase()}`,
    type: 'GET',
    dataType: 'json',
    success: (res) => {
      firstPokemonBasicInfo.value = res
      firstPokemonStats.value = getStats(res)
      firstPokemonStatsForCompare.value = firstPokemonStats.value.map((stat: Stat) => {
        return { base: stat.base }
      })

      showFirstPokemon.value = true
    },
    error: (error) => {
      console.log(error)
    }
  })
}

const secondPokemonInput = ref<string>('')
const secondPokemonBasicInfo = ref<any>({})
const secondPokemonStats = ref<Stat[]>([])
const secondPokemonStatsForCompare = ref<StatCompare[]>([])
const showSecondPokemon = ref<boolean>(false)
const searchSecondPokemon = async (pokemon: string) => {
  showSecondPokemon.value = false
  $.ajax({
    url: `https://pokeapi.co/api/v2/pokemon/${pokemon.toLowerCase()}`,
    type: 'GET',
    dataType: 'json',
    success: (res) => {
      secondPokemonBasicInfo.value = res
      secondPokemonStats.value = getStats(res)
      secondPokemonStatsForCompare.value = secondPokemonStats.value.map((stat: Stat) => {
        return { base: stat.base }
      })

      showSecondPokemon.value = true
    },
    error: (error) => {
      console.log(error)
    }
  })
}


const pokemonSearchList = ref<string[]>([])
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
      console.log(error)
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

</script>

<template>
  <div>
    <div class="grid grid-cols-2 gap-2 mt-4">
      <div class="flex gap-2 max-w-[400px]">
        <UInputMenu v-model="firstPokemonInput" :options="pokemonSearchList" placeholder="Type/select a Pokémon" size="xl" class="w-[250px]"/>
        <UButton @click="searchFirstPokemon(firstPokemonInput)" size="md"><UIcon name="material-symbols:search-rounded" class="w-6 h-6" />Search</UButton>
      </div>
      <div v-if="showFirstPokemon" class="flex gap-2 max-w-[400px]">
        <UInputMenu v-model="secondPokemonInput" :options="pokemonSearchList" placeholder="Type/select a Pokémon" size="xl" class="w-[250px]"/>
        <UButton @click="searchSecondPokemon(secondPokemonInput)" size="md"><UIcon name="material-symbols:search-rounded" class="w-6 h-6" />Search</UButton>
      </div>
    </div>
    <div class="grid grid-cols-2 gap-2 mt-4">
      <UCard v-if="showFirstPokemon" class="animate">
        <template #header>
          <span class="flex items-center text-xl font-bold bg-gray-200 p-1 rounded max-w-[75px]"><UIcon name="i-gg:pokemon" class="w-6 h-6 mr-1" /> {{ firstPokemonBasicInfo.id }}</span>
          <h4 class="text-xl font-bold mt-2">{{ capitalizeName(firstPokemonBasicInfo.name) }}</h4>
          <img :src="`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${firstPokemonBasicInfo.id}.png`" class="max-h-[225px] w-auto mx-auto">
        </template>

        <main class="text-lg">
          <div class="grid grid-cols-2 gap-2">
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
              <UTable :rows="firstPokemonStats"/>
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
          <div class="grid grid-cols-2 gap-2">
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
              <UTable :rows="secondPokemonStats"/>
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