<script setup lang="ts">
import { capitalizeName } from '@/utils/capitalize'
import { determineParam } from '@/utils/determineParam'
import { pokedexVersions } from '@/utils/pokedexVersions'
definePageMeta({
  layout: 'base-layout'
})

const isLoading = ref<boolean>(false)
const isOpen = ref<boolean>(false)
const currentVersion = useState<string>('currentVersion', () => '')
const selectedVersionParam = useState<string>('selectedVersionParam', () => '')
watch(currentVersion, (newValue: string) => {
  selectedVersionParam.value = determineParam(newValue)
})
const pokedexInfo = useState<any>('pokedexInfo', () => [])

const fetchPokemonSpecies = (name: string) => {
  return new Promise((resolve, reject) => {
    $.ajax({
      url: `https://pokeapi.co/api/v2/pokemon-species/${name}`,
      type: 'GET',
      dataType: 'json',
      success: (res) => {
        resolve({
          id: res.id,
          name: name,
          image: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${res.id}.png`
        })
      },
      error: (error) => {
        if (error instanceof Error) console.error(error.message, error.stack)
        else console.error(error)
        reject(error)
      }
    })
  })
}

const getPokedexInfo = (id: number, version: string) => {
  const lazyImages = document.getElementsByClassName('lazy-img')
  for(let i = 0; i < lazyImages.length; i++) {
    lazyImages[i].classList.remove('loaded')
  }

  currentVersion.value = ''
  pokedexInfo.value = []
  isLoading.value = true
  isOpen.value = false
  return new Promise((resolve, reject) => {
    $.ajax({
      url: `https://pokeapi.co/api/v2/pokedex/${id}`,
      type: 'GET',
      dataType: 'json',
      success: async (res) => {
        const pokemonEntries = [...res.pokemon_entries]

        const unorderedPokemonList = await Promise.all(
          pokemonEntries.map((entry) => {
            return fetchPokemonSpecies(entry.pokemon_species.name)
          })
        )

        pokedexInfo.value = unorderedPokemonList
        resolve(res)
        isLoading.value = false
        currentVersion.value = version
      },
      error: (error) => {
        if (error instanceof Error) console.error(error.message, error.stack)
        else console.error(error)
        reject(error)
      }
    })
  })
}

const imageLoaded = (event: Event) => {
  const target = event.target as HTMLImageElement
  target.classList.add('loaded')
}

</script>
<template>
  <div>
    <div
      v-if="isLoading"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
    >
      <div class="flex flex-col items-center gap-3 rounded-lg bg-white/90 px-6 py-5">
        <div
          class="h-12 w-12 rounded-full border-4 border-gray-200 border-t-gray-700 animate-spin"
          role="status"
          aria-label="Loading"
        />
        <p class="text-lg font-semibold">Loading Pokédex data...</p>
      </div>
    </div>

    <div>
      <UButton label="Pokédex Version" @click="isOpen = true" class="text-xl m-1" />
      <div v-if="currentVersion" class="p-1 mt-4" >
        <span class="text-2xl font-bold bg-gray-200 p-1 rounded">{{ currentVersion }}</span>
      </div>
      <div v-else class="p-1 mt-4 animate">
        <img src="/images/backgrounds/pokedex_background.webp" alt="" class="opacity-50 rounded-lg w-full">
      </div>

      <div v-if="!isLoading" class="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 xl:grid-cols-8  mt-4 p-2 gap-2 max-h-[80vh] overflow-y-auto custom-scroll animate">
        <UCard v-for="pokemon in pokedexInfo" :key="pokemon.id">
          <template #header>
            <span class="flex items-center text-xl font-bold bg-gray-200 p-1 rounded max-w-[75px]"><UIcon name="i-gg:pokemon" class="w-6 h-6 mr-1" /> {{ pokemon.id }}</span>
            <h4 class="text-xl font-bold mt-2">{{ capitalizeName(pokemon.name) }}</h4>
          </template>
          <NuxtLink :to="`/pokedex/${pokemon.name}?version=${selectedVersionParam}`">
            <UButton color="gray" class="mx-2">
              <img @load="imageLoaded" :src="pokemon.image" class="lazy-img" width="300" height="400" loading="lazy">
            </UButton>
          </NuxtLink>
        </UCard>
      </div>

  
      <USlideover v-model="isOpen">
        <UCard
          class="flex flex-col flex-1"
          :ui="{ body: { base: 'flex-1' }, ring: '', divide: 'divide-y divide-gray-100 dark:divide-gray-800' }"
        >
          <template #header>
            <h3 class="text-xl">Pokédex Versions</h3>
          </template>
  
          <div class="flex flex-col gap-4 max-h-[80vh] overflow-y-auto custom-scroll">
            <UButton
              v-for="item in pokedexVersions"
              :key="`${item.id}-${item.version}`"
              class="text-lg mr-1"
              color="white"
              @click="getPokedexInfo(item.id, item.version)"
            >
              <UIcon name="i-hugeicons:pokemon" class="w-5 h-5" />
              <span class="flex flex-wrap items-center gap-1">
                <span
                  v-for="(part, index) in item.textParts"
                  :key="`${item.version}-${index}`"
                  :class="part.colorClass"
                >
                  {{ part.text }}
                </span>
              </span>
            </UButton>
          </div>
        </UCard>
      </USlideover>
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
  animation: fadeIn 1.5s ease-in;
}

.lazy-img {
  opacity: 0;
  transform: translateY(20px);
  transition: all 1s ease-in;
}

.lazy-img.loaded {
  opacity: 1;
  transform: translateY(0px);
}
</style>
