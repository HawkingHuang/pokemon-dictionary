<script setup lang="ts">
import { capitalizeVersion, capitalizeName } from '@/utils/capitalize'
definePageMeta({
  layout: 'base-layout'
})

const { name } = useRoute().params
const { query } = useRoute()
console.log(query)
const formattedName = capitalizeName(name as string)
console.log(name)

const currentVersion = query.version
console.log(currentVersion)

const showDetails = ref<boolean>(false)
const showWhatSection = ref<string>('stats')
const id = ref<string>('')
const basicInfo = ref<any>({})
const speciesInfo = ref({})

interface Stat {
  name: string,
  base: number
}

interface APIMove {
  move: any,
  version_group_details: any[]
}

interface Move {
  name: string,
  level: number
}

const stats = ref<Stat[]>([])
const moves = ref<Move[]>([])

const getStats = (res: any) => {
  const baseFiveStats =  res.stats.map((stat: any) => {
    return { name: capitalizeVersion(stat.stat.name), base: stat.base_stat }
  })
  baseFiveStats.push({ name: 'Total', base: baseFiveStats.reduce((acc: number, cur: Stat) => {
    return acc + cur.base
  }, 0)})

  return baseFiveStats
}

const getMoves = (res: any) => {
  return res.moves
    .map((move: APIMove) => {
      const versionDetail = move.version_group_details.find(
        detail =>
          detail.version_group.name === currentVersion &&
          detail.move_learn_method.name === 'level-up'
      )

      if (!versionDetail) return null

      return {
        name: capitalizeVersion(move.move.name),
        level: versionDetail ? versionDetail.level_learned_at : null
      }
    })
    .filter((move: Move) => move !== null)
    .sort((a: Move, b: Move) => a.level - b.level)
}

onMounted(() => {
  $.ajax({
    url: `https://pokeapi.co/api/v2/pokemon/${name}`,
    type: 'GET',
    dataType: 'json',
    success: (res) => {
      console.log(res.moves.length)
      basicInfo.value = res

      stats.value = getStats(res)
      moves.value = getMoves(res)
      console.log(stats.value)
      console.log(moves.value)
    },
    error: (error) => {
      console.log(error)
    }
  })

  $.ajax({
    url: `https://pokeapi.co/api/v2/pokemon-species/${name}`,
    type: 'GET',
    dataType: 'json',
    success: (res) => {
      id.value = res.id
      console.log(id.value)
    },
    error: (error) => {
      console.log(error)
    }
  })
})

const displayDetails = () => {
  showDetails.value = true
}
const detailLists = ref([
  {
    label: 'Moves',
    icon: 'lucide:sword',
    content: []
  },
  {
    label: 'Locations',
    icon: 'lucide:sword',
    content: []
  }
])
</script>

<template>
  <div>
    <div class="flex">
      <UCard :class="{ 'move-right': showDetails }" class="w-[30%] mx-auto transition-transform duration-500 ease-in-out">
        <template #header>
          <span class="flex items-center text-xl font-bold bg-gray-200 p-1 rounded max-w-[75px]"><UIcon name="i-gg:pokemon" class="w-6 h-6 mr-1" /> {{ id }}</span>
          <h4 class="text-xl font-bold mt-2">{{ formattedName }}</h4>
          <img :src="`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`" width="300" height="400" class="mx-auto">
        </template>

        <main class="text-lg">
          <div class="border rounded p-4 mb-2">
            <span class="bg-green-400 p-1 rounded">Type</span>
            <span v-for="type in basicInfo.types" :key="type.type.name" class="bg-gray-200 p-1 rounded ml-1">{{ capitalizeName(type.type.name) }}</span>
          </div>
          <div class="border rounded p-4 mb-2">
            <span class="bg-green-400 p-1 rounded">Abilities</span>
            <span v-for="ability in basicInfo.abilities" :key="ability.ability" class="bg-gray-200 p-1 rounded ml-1">{{ capitalizeVersion(ability.ability.name) }}</span>
          </div>
          <div class="border rounded p-4 mb-2">
            <span class="bg-green-400 p-1 rounded">Held Items</span>
            <span v-for="item in basicInfo.held_items" :key="item.item.name" class="bg-gray-200 p-1 rounded ml-1">{{ capitalizeVersion(item.item.name) }}</span>
          </div>
          <div class="border rounded p-4 mb-2">
            <div class="flex gap-4">
              <div>
                <span class="bg-green-400 p-1 rounded">Height</span>
                <span class="bg-gray-200 p-1 rounded ml-1">{{ basicInfo.height / 10 }} m</span>
              </div>
              <div>
                <span class="bg-green-400 p-1 rounded">Weight</span>
                <span class="bg-gray-200 p-1 rounded ml-1">{{ basicInfo.weight / 10 }} kg</span>
              </div>
            </div>
          </div>
          <div class="flex justify-center mt-4">
            <UButton @click="displayDetails" class="text-lg">More Information</UButton>
          </div>
        </main>
      </UCard>
      <UCard v-if="showDetails" :class="{ 'move-left': showDetails }" class="w-[30%] mx-auto transition-transform duration-500 ease-in-out">
        <main class="text-lg">
          <nav class="flex gap-2">
            <UButton class="text-lg" @click="showWhatSection = 'stats'">Stats</UButton>
            <UButton class="text-lg" @click="showWhatSection = 'moves'">Moves</UButton>
            <UButton class="text-lg" @click="showWhatSection = 'locations'">Locations</UButton>
          </nav>
          <UTable v-if="showWhatSection === 'stats'" :rows="stats"/>
          <UTable v-if="showWhatSection === 'moves'" :rows="moves" class="max-h-[80vh] overflow-y-auto custom-scroll"/>
          <UTable v-if="showWhatSection === 'locations'" />
        </main>
      </UCard>
    </div>
  </div>
</template>

<style scoped>
.custom-scroll::-webkit-scrollbar {
  height: 0.5rem;
}

.custom-scroll::-webkit-scrollbar-thumb {
  background-color: #dee2e6;
  border-radius: 15px;
}

.custom-scroll::-webkit-scrollbar-track {
  background-color: #f1f3f5;
}

.move-right {
  transform: translateX(15%);
}

.move-left {
  transform: translateX(-15%);
}
</style>
