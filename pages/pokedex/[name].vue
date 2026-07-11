<script setup lang="ts">
import { fetchPokemonBasic, fetchPokemonMoves, fetchPokemonLocations, fetchEvolutionChain } from '@/services/pokeapi'
import type { Stat, Move, Location, EvolutionStage, PokemonBasic } from '@/types'

definePageMeta({
  layout: 'base-layout'
})

const { name } = useRoute().params
const { query } = useRoute()

const currentVersion = query.version

const isLoading = ref<boolean>(true)
const showDetails = ref<boolean>(false)
const basic = ref<PokemonBasic | null>(null)

const stats = ref<Stat[]>([])
const moves = ref<Move[]>([])
const movesLoading = ref<boolean>(true)
const locations = ref<Location[]>([])
const evolutionChain = ref<EvolutionStage[]>([])

onMounted(async () => {
  isLoading.value = true
  try {
    const info = await fetchPokemonBasic(String(name))
    basic.value = info
    stats.value = info.stats

    movesLoading.value = true
    const [movesResult, locationsResult, chainResult] = await Promise.all([
      fetchPokemonMoves(String(name), String(currentVersion ?? '')).catch(() => [] as Move[]),
      fetchPokemonLocations(info.id).catch(() => [] as Location[]),
      fetchEvolutionChain(String(name)).catch(() => [] as EvolutionStage[]),
    ])
    moves.value = movesResult
    movesLoading.value = false
    locations.value = locationsResult
    evolutionChain.value = chainResult
  } catch (error) {
    console.error(error)
  } finally {
    isLoading.value = false
  }
})

const switchDetails = () => {
  showDetails.value = !showDetails.value
}
</script>

<template>
  <div>
    <div v-if="!isLoading && basic">
      <Transition name="layout-switch" mode="out-in">
        <div v-if="!showDetails" key="basic-card" class="w-[100%] md:w-[70%] xl:w-[40%] mx-auto">
          <PokemonBasicCard
            :id="basic.id"
            :pokemon-name="String(name)"
            :basic-info="basic"
            :show-details="showDetails"
            card-class="animate"
            @toggle-details="switchDetails"
          />
        </div>

        <div v-else key="details-layout" class="grid grid-cols-1 gap-4 xl:flex xl:items-start xl:justify-center xl:gap-8">
          <div class="w-[100%] md:w-[70%] xl:w-[40%] mx-auto split-left-card">
            <PokemonBasicCard
              :id="basic.id"
              :pokemon-name="String(name)"
              :basic-info="basic"
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
