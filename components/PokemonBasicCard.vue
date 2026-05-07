<script setup lang="ts">
import { TYPE_COLORS } from '@/utils/typeColors'

const props = defineProps<{
  id: string | number
  pokemonName: string
  basicInfo: any
  showDetails: boolean
  cardClass?: string
}>()

const emit = defineEmits<{
  (e: 'toggle-details'): void
}>()

const description = ref<string>('')

watch(() => props.id, async (newId) => {
  if (!newId) return
  const species = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${newId}`).then(r => r.json())
  const entry = species.flavor_text_entries
    .filter((e: any) => e.language.name === 'en')
    .at(-1)
  description.value = entry?.flavor_text.replace(/\f/g, ' ') ?? ''
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
        :src="`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`"
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
            :key="type.type.name"
            class="px-2 py-1 rounded-lg text-sm text-white capitalize"
            :style="{ backgroundColor: TYPE_COLORS[type.type.name] ?? '#9FA19F' }"
          >{{ capitalizeName(type.type.name) }}</span>
        </div>
        <!-- Abilities -->
        <div class="border rounded-xl p-3 shadow-sm flex items-center flex-wrap gap-2">
          <span class="inline-flex items-center gap-1 bg-green-400 px-2 py-1 rounded-lg font-semibold text-white">
            <UIcon name="heroicons:bolt" class="w-4 h-4" />Abilities
          </span>
          <span v-for="ability in basicInfo?.abilities || []" :key="ability.ability.name" class="bg-gray-200 px-2 py-1 rounded-lg">{{ capitalizeVersion(ability.ability.name) }}</span>
        </div>
        <!-- Held Items -->
        <div v-if="basicInfo?.held_items?.length" class="border rounded-xl p-3 shadow-sm flex items-center flex-wrap gap-2">
          <span class="inline-flex items-center gap-1 bg-green-400 px-2 py-1 rounded-lg font-semibold text-white">
            <UIcon name="heroicons:archive-box" class="w-4 h-4" />Held Items
          </span>
          <span v-for="item in basicInfo.held_items" :key="item.item.name" class="bg-gray-200 px-2 py-1 rounded-lg">{{ capitalizeVersion(item.item.name) }}</span>
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