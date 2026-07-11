<script setup lang="ts">
import { fetchPokemonDescription } from '@/services/pokeapi'
import { TYPE_COLORS } from '@/utils/typeColors'
import type { PokemonBasic } from '@/types'

const props = defineProps<{
  id: string | number
  pokemonName: string
  basicInfo: PokemonBasic
  showDetails: boolean
  cardClass?: string
}>()

const emit = defineEmits<{
  (e: 'toggle-details'): void
}>()

const description = ref<string>('')

watch(() => props.pokemonName, async (newName) => {
  if (!newName) return
  description.value = await fetchPokemonDescription(newName).catch(() => '')
}, { immediate: true })
</script>

<template>
  <div :class="['grid grid-cols-1 md:grid-cols-2 border rounded-2xl shadow-sm overflow-hidden', cardClass]">
    <!-- Left: image + description -->
    <div class="p-6">
      <span class="flex items-center text-xl font-bold bg-gray-200 p-1 rounded max-w-[75px]">
        <UIcon name="i-gg:pokemon" class="w-6 h-6 mr-1" /> {{ id }}
      </span>
      <h4 class="text-2xl font-bold mt-2">{{ capitalizeName(pokemonName) }}</h4>
      <img
        :src="basicInfo?.image"
        width="240" height="240"
        class="mx-auto mt-2"
      >
      <p v-if="description" class="mt-4 text-sm text-gray-500 italic leading-relaxed">{{ description }}</p>
    </div>

    <!-- Right: info sections -->
    <div class="p-6 md:border-l">
      <main class="text-lg flex flex-col gap-5">
        <!-- Type -->
        <div class="border rounded-xl p-3 shadow-sm flex items-center flex-wrap gap-2">
          <span class="inline-flex items-center gap-1 bg-green-400 px-2 py-1 rounded-lg font-semibold text-white">
            <UIcon name="heroicons:tag" class="w-4 h-4" />Type
          </span>
          <span
            v-for="type in basicInfo?.types || []"
            :key="type"
            class="px-2 py-1 rounded-lg text-sm text-white capitalize"
            :style="{ backgroundColor: TYPE_COLORS[type] ?? '#9FA19F' }"
          >{{ capitalizeName(type) }}</span>
        </div>
        <!-- Abilities -->
        <div class="border rounded-xl p-3 shadow-sm flex items-center flex-wrap gap-2">
          <span class="inline-flex items-center gap-1 bg-green-400 px-2 py-1 rounded-lg font-semibold text-white">
            <UIcon name="heroicons:bolt" class="w-4 h-4" />Abilities
          </span>
          <span v-for="ability in basicInfo?.abilities || []" :key="ability" class="bg-gray-200 px-2 py-1 rounded-lg">{{ capitalizeVersion(ability) }}</span>
        </div>
        <!-- Held Items -->
        <div v-if="basicInfo?.heldItems?.length" class="border rounded-xl p-3 shadow-sm flex items-center flex-wrap gap-2">
          <span class="inline-flex items-center gap-1 bg-green-400 px-2 py-1 rounded-lg font-semibold text-white">
            <UIcon name="heroicons:archive-box" class="w-4 h-4" />Held Items
          </span>
          <span v-for="item in basicInfo.heldItems" :key="item" class="bg-gray-200 px-2 py-1 rounded-lg">{{ capitalizeVersion(item) }}</span>
        </div>
        <!-- Height + Weight -->
        <div class="border rounded-xl p-3 shadow-sm flex flex-wrap gap-6">
          <div class="flex items-center gap-2">
            <span class="inline-flex items-center gap-1 bg-green-400 px-2 py-1 rounded-lg font-semibold text-white">
              <UIcon name="heroicons:arrows-up-down" class="w-4 h-4" />Height
            </span>
            <span class="bg-gray-200 px-2 py-1 rounded-lg">{{ basicInfo?.height / 10 }} m</span>
          </div>
          <div class="flex items-center gap-2">
            <span class="inline-flex items-center gap-1 bg-green-400 px-2 py-1 rounded-lg font-semibold text-white">
              <UIcon name="heroicons:scale" class="w-4 h-4" />Weight
            </span>
            <span class="bg-gray-200 px-2 py-1 rounded-lg">{{ basicInfo?.weight / 10 }} kg</span>
          </div>
        </div>
        <div class="flex justify-center mt-2">
          <UButton @click="emit('toggle-details')" class="text-lg">
            <UIcon :name="showDetails ? 'heroicons:x-circle' : 'heroicons:information-circle'" class="w-5 h-5" />
            {{ showDetails ? 'Close Details' : 'More Information' }}
          </UButton>
        </div>
      </main>
    </div>
  </div>
</template>
