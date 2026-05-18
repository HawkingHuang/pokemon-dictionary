<script setup lang="ts">
import type { Stat, Move, Location, EvolutionStage } from '@/types/pokemon'
definePageMeta({
  layout: 'base-layout'
})

const { name } = useRoute().params
const { query } = useRoute()

const currentVersion = query.version

const isLoading = ref<boolean>(true)
const showDetails = ref<boolean>(false)
const id = ref<string>('')
const basicInfo = ref<any>({})

const stats = ref<Stat[]>([])
const moves = ref<Move[]>([])
const movesLoading = ref<boolean>(true)
const locations = ref<Location[]>([])
const evolutionChain = ref<EvolutionStage[]>([])

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
      movesLoading.value = true
      const [movesResult, locationsResult, chainResult] = await Promise.all([
        getMoves(res.moves, String(currentVersion ?? '')),
        getLocations(res.id),
        getEvolutionChain(String(name)).catch(() => [] as EvolutionStage[])
      ])
      moves.value = movesResult
      movesLoading.value = false
      locations.value = locationsResult
      evolutionChain.value = chainResult

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

          <PokemonDetailCard
            :stats="stats"
            :moves="moves"
            :moves-loading="movesLoading"
            :locations="locations"
            :evolution-chain="evolutionChain"
            :current-version="String(currentVersion ?? '')"
            :pokemon-name="String(name)"
          />
        </div>
      </Transition>
    </div>
  </div>
</template>

<style scoped src="./pokemon-detail.css"></style>