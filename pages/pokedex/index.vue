<script setup lang="ts">
import { capitalizeName } from '@/utils/capitalize'
definePageMeta({
  layout: 'base-layout'
})

const determineParam = (version: string): string => {
  switch (version) {
    case 'Red/Blue/Yellow':
      return 'red-blue'
    case 'Gold/Silver/Crystal':
      return 'gold-silver'
    case 'Ruby/Sapphire/Emerald':
      return 'ruby-sapphire'
    case 'Diamond/Pearl':
      return 'diamond-pearl'
    case 'Platinum':
      return 'platinum'
    case 'HeartGold/SoulSilver':
      return 'heartgold-soulsilver'
    case 'Black/White':
      return 'black-white'
    case 'Black 2/White 2':
      return 'black-2-white-2'
    case 'X/Y (Central)':
    case 'X/Y (Coastal)':
    case 'X/Y (Mountain)':
      return 'x-y'
    case 'Omega Ruby/Alpha Sapphire':
      return  'omega-ruby-alpha-sapphire'
    case 'Sun/Moon (Alola)':
    case 'Sun/Moon (Melemele)':
    case 'Sun/Moon (Akala)':
    case 'Sun/Moon (Ula\'ula)':
    case 'Sun/Moon (Poni)':
      return 'sun-moon'
    case 'Ultra Sun/Ultra Moon (Alola)':
    case 'Ultra Sun/Ultra Moon (Melemele)':
    case 'Ultra Sun/Ultra Moon (Akala)':
    case 'Ultra Sun/Ultra Moon (Ula\'ula)':
    case 'Ultra Sun/Ultra Moon (Poni)':
      return 'ultra-sun-ultra-moon'
    case 'Let\'s Go: Pikachu/Let\'s Go: Eevee/':
      return 'lets-go-pikachu-lets-go-eevee'
    case 'Sword/Shield (Galar)':
    case 'Sword/Shield (Isle of Armor)':
    case 'Sword/Shield (Crown Tundra)':
      return 'sword-shield'
    case 'Legends Arceus':
      return 'red-blue'
    case 'Scarlet/Violet':
      return 'scarlet-violet'
  }
}

const isLoading = ref<boolean>(false)
const isOpen = ref<boolean>(false)
const currentVersion = useState<string>('currentVersion', () => '')
const selectedVersionParam = useState<string>('selectedVersionParam', () => '')
watch(currentVersion, (newValue: string) => {
  console.log(newValue)
  selectedVersionParam.value = determineParam(newValue)
  console.log(selectedVersionParam.value)
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
        console.log(error)
        reject(error)
      }
    })
  })
}

const getPokedexInfo = (id: number, version: string) => {
  currentVersion.value = ''
  pokedexInfo.value = []
  isLoading.value = true
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
        isOpen.value = false
      },
      error: (error) => {
        console.log(error)
        reject(error)
      }
    })
  })
}

</script>
<template>
  <div>
    <div>
      <UButton label="Pokédex Version" @click="isOpen = true" class="text-xl m-1" />
      <div v-if="currentVersion" class="p-1 mt-4" >
        <span class="text-2xl font-bold bg-gray-200 p-1 rounded">{{ currentVersion }}</span>
      </div>
      <div v-else class="p-1 mt-4 animate">
        <img src="/images/backgrounds/pokedex_background.png" alt="" class="opacity-50 rounded-lg">
      </div>

      <UCommandPalette v-if="isLoading" loading :empty-state="{ icon: '', label: '', queryLabel: '' }" />
      <div v-else class="grid grid-cols-8 mt-4 p-2 gap-2 max-h-[80vh] overflow-y-auto custom-scroll animate">
        <UCard v-for="pokemon in pokedexInfo" :key="pokemon.id">
          <template #header>
            <span class="flex items-center text-xl font-bold bg-gray-200 p-1 rounded max-w-[75px]"><UIcon name="i-gg:pokemon" class="w-6 h-6 mr-1" /> {{ pokemon.id }}</span>
            <h4 class="text-xl font-bold mt-2">{{ capitalizeName(pokemon.name) }}</h4>
          </template>
          <NuxtLink :to="`/pokedex/${pokemon.name}?version=${selectedVersionParam}`">
            <UButton color="gray" class="mx-2">
              <img :src="pokemon.image" width="300" height="400">
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
            <UButton class="text-lg mr-1" color="white" @click="getPokedexInfo(2, 'Red/Blue/Yellow')">
              <UIcon name="i-hugeicons:pokemon" class="w-5 h-5" /><span class="text-red-500">Red</span> <span class="text-blue-500">Blue</span> <span class="text-yellow-500">Yellow</span>
            </UButton>
            <UButton class="text-lg mr-1" color="white" @click="getPokedexInfo(3, 'Gold/Silver/Crystal')">
              <UIcon name="i-hugeicons:pokemon" class="w-5 h-5" /><span class="text-yellow-300">Gold</span> <span class="text-gray-300">Silver</span> <span class="text-purple-500">Crystal</span>
            </UButton>
            <UButton class="text-lg mr-1" color="white" @click="getPokedexInfo(4, 'Ruby/Sapphire/Emerald')">
              <UIcon name="i-hugeicons:pokemon" class="w-5 h-5" /><span class="text-red-500">Ruby</span> <span class="text-blue-700">Sapphire</span> <span class="text-emerald-500">Emerald</span>
            </UButton>
            <UButton class="text-lg mr-1" color="white" @click="getPokedexInfo(5, 'Diamond/Pearl')">
              <UIcon name="i-hugeicons:pokemon" class="w-5 h-5" /><span class="text-stone-400">Diamond</span> <span class="text-fuchsia-400">Pearl</span>
            </UButton>
            <UButton class="text-lg mr-1" color="white" @click="getPokedexInfo(6, 'Platinum')">
              <UIcon name="i-hugeicons:pokemon" class="w-5 h-5" /><span class="text-neutral-500">Platinum</span>
            </UButton>
            <UButton class="text-lg mr-1" color="white" @click="getPokedexInfo(7, 'HeartGold/SoulSilver')">
              <UIcon name="i-hugeicons:pokemon" class="w-5 h-5" /><span class="text-yellow-300">HeartGold</span> <span class="text-gray-300">SoulSilver</span>
            </UButton>
            <UButton class="text-lg mr-1" color="white" @click="getPokedexInfo(8, 'Black/White')">
              <UIcon name="i-hugeicons:pokemon" class="w-5 h-5" /><span class="text-black">Black</span> <span class="text-gray-200">White</span>
            </UButton>
            <UButton class="text-lg mr-1" color="white" @click="getPokedexInfo(9, 'Black 2/White 2')">
              <UIcon name="i-hugeicons:pokemon" class="w-5 h-5" /><span class="text-black">Black 2</span> <span class="text-gray-200">White 2</span>
            </UButton>
            <UButton class="text-lg mr-1" color="white" @click="getPokedexInfo(12, 'X/Y (Central)')">
              <UIcon name="i-hugeicons:pokemon" class="w-5 h-5" /><span class="text-slate-600">X</span> <span class="text-red-700">Y</span> (Central)
            </UButton>
            <UButton class="text-lg mr-1" color="white" @click="getPokedexInfo(13, 'X/Y (Coastal)')">
              <UIcon name="i-hugeicons:pokemon" class="w-5 h-5" /><span class="text-slate-600">X</span> <span class="text-red-700">Y</span> (Coastal)
            </UButton>
            <UButton class="text-lg mr-1" color="white" @click="getPokedexInfo(14, 'X/Y (Mountain)')">
              <UIcon name="i-hugeicons:pokemon" class="w-5 h-5" /><span class="text-slate-600">X</span> <span class="text-red-700">Y</span> (Mountain)
            </UButton>
            <UButton class="text-lg mr-1" color="white" @click="getPokedexInfo(15, 'Omega Ruby/Alpha Sapphire')">
              <UIcon name="i-hugeicons:pokemon" class="w-5 h-5" /><span class="text-red-500">Omega Ruby</span> <span class="text-blue-700">Alpha Sapphire</span>
            </UButton>
            <UButton class="text-lg mr-1" color="white" @click="getPokedexInfo(16, 'Sun/Moon (Alola)')">
              <UIcon name="i-hugeicons:pokemon" class="w-5 h-5" /><span class="text-orange-500">Sun</span> <span class="text-gray-300">Moon</span> (Alola)
            </UButton>
            <UButton class="text-lg mr-1" color="white" @click="getPokedexInfo(17, 'Sun/Moon (Melemele)')">
              <UIcon name="i-hugeicons:pokemon" class="w-5 h-5" /><span class="text-orange-500">Sun</span> <span class="text-gray-300">Moon</span> (Melemele)
            </UButton>
            <UButton class="text-lg mr-1" color="white" @click="getPokedexInfo(18, 'Sun/Moon (Akala)')">
              <UIcon name="i-hugeicons:pokemon" class="w-5 h-5" /><span class="text-orange-500">Sun</span> <span class="text-gray-300">Moon</span> (Akala)
            </UButton>
            <UButton class="text-lg mr-1" color="white" @click="getPokedexInfo(19, 'Sun/Moon (Ula\'ula)')">
              <UIcon name="i-hugeicons:pokemon" class="w-5 h-5" /><span class="text-orange-500">Sun</span> <span class="text-gray-300">Moon</span> (Ula'ula)
            </UButton>
            <UButton class="text-lg mr-1" color="white" @click="getPokedexInfo(20, 'Sun/Moon (Poni)')">
              <UIcon name="i-hugeicons:pokemon" class="w-5 h-5" /><span class="text-orange-500">Sun</span> <span class="text-gray-300">Moon</span> (Poni)
            </UButton>
            <UButton class="text-lg mr-1" color="white" @click="getPokedexInfo(21, 'Ultra Sun/Ultra Moon (Alola)')">
              <UIcon name="i-hugeicons:pokemon" class="w-5 h-5" /><span class="text-orange-500">Ultra Sun</span> <span class="text-gray-300">Ultra Moon</span> (Alola)
            </UButton>
            <UButton class="text-lg mr-1" color="white" @click="getPokedexInfo(22, 'Ultra Sun/Ultra Moon (Melemele)')">
              <UIcon name="i-hugeicons:pokemon" class="w-5 h-5" /><span class="text-orange-500">Ultra Sun</span> <span class="text-gray-300">Ultra Moon</span> (Melemele)
            </UButton>
            <UButton class="text-lg mr-1" color="white" @click="getPokedexInfo(23, 'Ultra Sun/Ultra Moon (Akala)')">
              <UIcon name="i-hugeicons:pokemon" class="w-5 h-5" /><span class="text-orange-500">Ultra Sun</span> <span class="text-gray-300">Ultra Moon</span> (Akala)
            </UButton>
            <UButton class="text-lg mr-1" color="white" @click="getPokedexInfo(24, 'Ultra Sun/Ultra Moon (Ula\'ula)')">
              <UIcon name="i-hugeicons:pokemon" class="w-5 h-5" /><span class="text-orange-500">Ultra Sun</span> <span class="text-gray-300">Ultra Moon</span> (Ula'ula)
            </UButton>
            <UButton class="text-lg mr-1" color="white" @click="getPokedexInfo(25, 'Ultra Sun/Ultra Moon (Poni)')">
              <UIcon name="i-hugeicons:pokemon" class="w-5 h-5" /><span class="text-orange-500">Ultra Sun</span> <span class="text-gray-300">Ultra Moon</span> (Poni)
            </UButton>
            <UButton class="text-lg mr-1" color="white" @click="getPokedexInfo(26, 'Let\'s Go: Pikachu/Let\'s Go: Eevee/')">
              <UIcon name="i-hugeicons:pokemon" class="w-5 h-5" /><span class="text-yellow-500">Let's Go: Pikachu</span> <span class="text-amber-800">Let's Go: Eevee</span>
            </UButton>
            <UButton class="text-lg mr-1" color="white" @click="getPokedexInfo(27, 'Sword/Shield (Galar)')">
              <UIcon name="i-hugeicons:pokemon" class="w-5 h-5" /><span class="text-blue-400">Sword</span> <span class="text-pink-400">Shield</span> (Galar)
            </UButton>
            <UButton class="text-lg mr-1" color="white" @click="getPokedexInfo(28, 'Sword/Shield (Isle of Armor)')">
              <UIcon name="i-hugeicons:pokemon" class="w-5 h-5" /><span class="text-blue-400">Sword</span> <span class="text-pink-400">Shield</span> (Isle of Armor)
            </UButton>
            <UButton class="text-lg mr-1" color="white" @click="getPokedexInfo(29, 'Sword/Shield (Crown Tundra)')">
              <UIcon name="i-hugeicons:pokemon" class="w-5 h-5" /><span class="text-blue-400">Sword</span> <span class="text-pink-400">Shield</span> (Crown Tundra)
            </UButton>
            <UButton class="text-lg mr-1" color="white" @click="getPokedexInfo(30, 'Legends Arceus')">
              <UIcon name="i-hugeicons:pokemon" class="w-5 h-5" /><span class="text-cyan-500">Legends Arceus</span>
            </UButton>
            <UButton class="text-lg mr-1" color="white" @click="getPokedexInfo(31, 'Scarlet/Violet')">
              <UIcon name="i-hugeicons:pokemon" class="w-5 h-5" /><span class="text-orange-400">Scarlet</span> <span class="text-purple-400">Violet</span>
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
</style>
