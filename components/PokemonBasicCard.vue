<script setup lang="ts">

defineProps<{
  id: string | number
  pokemonName: string
  basicInfo: any
  showDetails: boolean
  cardClass?: string
}>()

const emit = defineEmits<{
  (e: 'toggle-details'): void
}>()
</script>

<template>
  <UCard :class="cardClass">
    <template #header>
      <span class="flex items-center text-xl font-bold bg-gray-200 p-1 rounded max-w-[75px]"><UIcon name="i-gg:pokemon" class="w-6 h-6 mr-1" /> {{ id }}</span>
      <h4 class="text-xl font-bold mt-2">{{ capitalizeName(pokemonName) }}</h4>
      <img :src="`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`" width="300" height="400" class="mx-auto">
    </template>

    <main class="text-lg">
      <div class="border rounded p-4 mb-2">
        <span class="bg-green-400 p-1 rounded inline-block">Type</span>
        <span v-for="type in basicInfo?.types || []" :key="type.type.name" class="bg-gray-200 p-1 rounded ml-1 mt-1 inline-block">{{ capitalizeName(type.type.name) }}</span>
      </div>
      <div class="border rounded p-4 mb-2">
        <span class="bg-green-400 p-1 rounded inline-block">Abilities</span>
        <span v-for="ability in basicInfo?.abilities || []" :key="ability.ability" class="bg-gray-200 p-1 rounded ml-1 mt-1 inline-block">{{ capitalizeVersion(ability.ability.name) }}</span>
      </div>
      <div class="border rounded p-4 mb-2">
        <span class="bg-green-400 p-1 rounded inline-block">Held Items</span>
        <span v-for="item in basicInfo?.held_items || []" :key="item.item.name" class="bg-gray-200 p-1 rounded ml-1 mt-1 inline-block">{{ capitalizeVersion(item.item.name) }}</span>
      </div>
      <div class="border rounded p-4 mb-2">
        <div class="flex gap-4">
          <div>
            <span class="bg-green-400 p-1 rounded inline-block">Height</span>
            <span class="bg-gray-200 p-1 rounded ml-1 inline-block">{{ basicInfo?.height / 10 }} m</span>
          </div>
          <div>
            <span class="bg-green-400 p-1 rounded inline-block">Weight</span>
            <span class="bg-gray-200 p-1 rounded ml-1 inline-block">{{ basicInfo?.weight / 10 }} kg</span>
          </div>
        </div>
      </div>
      <div class="flex justify-center mt-4">
        <UButton @click="emit('toggle-details')" class="text-lg">{{ showDetails ? 'Close Details' : 'More Information' }}</UButton>
      </div>
    </main>
  </UCard>
</template>