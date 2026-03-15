<script setup lang="ts">
import { getStats, getMoves, getLocations } from '@/utils/pokemon'
import type { Stat, Move, Location } from '@/types/pokemon'
definePageMeta({
  layout: 'base-layout'
})

const { name } = useRoute().params
const { query } = useRoute()

const currentVersion = query.version

const isLoading = ref<boolean>(true)
const showDetails = ref<boolean>(false)
const showWhatSection = ref<string>('stats')
const id = ref<string>('')
const basicInfo = ref<any>({})

const stats = ref<Stat[]>([])
const moves = ref<Move[]>([])
const locations = ref<Location[]>([])

onMounted(() => {
  isLoading.value = true
  $.ajax({
    url: `https://pokeapi.co/api/v2/pokemon/${name}`,
    type: 'GET',
    dataType: 'json',
    success: async (res) => {
      id.value = res.id
      basicInfo.value = res

      stats.value = getStats(res.stats)
      moves.value = getMoves(res.moves, String(currentVersion ?? ''))
      locations.value = await getLocations(res.id)

      isLoading.value = false
    },
    error: (error) => {
      if (error instanceof Error) console.error(error.message, error.stack)
      else console.error(error)
    }
  })
})

const switchDetails = () => {
  showDetails.value = !showDetails.value
}
</script>

<template>
  <div>
    <div v-if="!isLoading">
      <Transition name="layout-switch" mode="out-in">
        <div v-if="!showDetails" key="basic-card" class="w-[100%] md:w-[70%] xl:w-[40%] mx-auto">
          <PokemonBasicCard
            :id="id"
            :pokemon-name="String(name)"
            :basic-info="basicInfo"
            :show-details="showDetails"
            card-class="animate"
            @toggle-details="switchDetails"
          />
        </div>

        <div v-else key="details-layout" class="grid grid-cols-1 gap-4 xl:flex xl:items-start xl:justify-center xl:gap-8">
          <div class="w-[100%] md:w-[70%] xl:w-[40%] mx-auto split-left-card">
            <PokemonBasicCard
              :id="id"
              :pokemon-name="String(name)"
              :basic-info="basicInfo"
              :show-details="showDetails"
              @toggle-details="switchDetails"
            />
          </div>

          <UCard class="w-[100%] md:w-[70%] xl:w-[40%] mx-auto split-right-card">
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
      </Transition>
    </div>
  </div>
</template>

<style scoped src="./pokemon-detail.css"></style>