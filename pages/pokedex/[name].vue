<script setup lang="ts">
import { capitalizeVersion, capitalizeName, capitalizeLocation, capitalizeLocationVersion } from '@/utils/capitalize'
definePageMeta({
  layout: 'base-layout'
})

const { name } = useRoute().params
const { query } = useRoute()
const formattedName = capitalizeName(name as string)

const currentVersion = query.version

const isLoading = ref<boolean>(true)
const showDetails = ref<boolean>(false)
const showWhatSection = ref<string>('stats')
const id = ref<string>('')
const basicInfo = ref<any>({})

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

interface Location {
  location: string,
  version: string
}

const stats = ref<Stat[]>([])
const moves = ref<Move[]>([])
const locations = ref<Location[]>([])

const getStats = (res: any) => {
  const baseFiveStats =  res.stats.map((stat: any) => {
    return { stat: capitalizeVersion(stat.stat.name), base: stat.base_stat }
  })
  baseFiveStats.push({ stat: 'Total', base: baseFiveStats.reduce((acc: number, cur: Stat) => {
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

const getLocations = (res: any): any => {
  return new Promise((resolve, reject) => {
    $.ajax({
      url: `https://pokeapi.co/api/v2/pokemon/${res.id}/encounters`,
      type: 'GET',
      dataType: 'json',
      success: (res) => {
        resolve(res)
      },
      error: (error) => {
        console.log(error)
        reject(error)
      }
    })
  })
}

onMounted(() => {
  isLoading.value = true
  $.ajax({
    url: `https://pokeapi.co/api/v2/pokemon/${name}`,
    type: 'GET',
    dataType: 'json',
    success: async (res) => {
      id.value = res.id
      basicInfo.value = res

      stats.value = getStats(res)
      moves.value = getMoves(res)
      const rawLocations = await getLocations(res)
      locations.value = rawLocations.map((location: any) => {
        const versions = location.version_details.map((version: any) => {
          return version.version.name
        } )
        return { version: capitalizeLocationVersion(versions), location: capitalizeLocation(location.location_area.name) }
      })

      isLoading.value = false
    },
    error: (error) => {
      console.log(error)
    }
  })
})

const displayDetails = () => {
  showDetails.value = true
}

const hideDetails = () => {
  showDetails.value = false
}
</script>

<template>
  <div>
    <div class="flex">
      <UCard v-if="!isLoading" :class="{ 'move-left': showDetails }" class="w-[30%] mx-auto transition-transform duration-500 ease-in-out animate">
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
            <UButton v-if="!showDetails" @click="displayDetails" class="text-lg">More Information</UButton>
            <UButton v-else @click="hideDetails" class="text-lg">Close Details</UButton>
          </div>
        </main>
      </UCard>
      <UCard v-if="showDetails" :class="{ 'move-left': showDetails }" class="w-[40%] mx-auto transition-transform duration-500 ease-in-out">
        <main class="text-lg">
          <nav class="flex gap-2">
            <UButton class="text-lg" @click="showWhatSection = 'stats'"><UIcon name="gridicons:stats" class="w-5 h-5" />Stats</UButton>
            <UButton class="text-lg" @click="showWhatSection = 'moves'"><UIcon name="charm:sword" class="w-5 h-5" />Moves</UButton>
            <UButton v-if="locations.length > 0" class="text-lg" @click="showWhatSection = 'locations'"><UIcon name="material-symbols:location-on-outline-rounded" class="w-5 h-5" />Locations</UButton>
          </nav>
          <UTable v-if="showWhatSection === 'stats'" :rows="stats"/>
          <UTable v-if="showWhatSection === 'moves'" :rows="moves" class="max-h-[80vh] overflow-y-auto custom-scroll"/>
          <UTable v-if="showWhatSection === 'locations'" :rows="locations" class="max-h-[80vh] overflow-y-auto custom-scroll"/>
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

.move-right {
  transform: translateX(15%);
}

.move-left {
  transform: translateX(-15%);
}
</style>
