<script setup lang="ts">
import { fetchVersionInfo } from '@/services/pokeapi'
import type { Version } from '@/types'

definePageMeta({
  layout: 'base-layout'
})

const carouselRefs = ref<any[]>([])
const carouselIntervals: number[] = []

onMounted(() => {
  markImagesIfComplete()

  carouselConfigs.forEach((_, index) => {
    const intervalId = window.setInterval(() => {
      const carousel = carouselRefs.value[index]
      const embla = carousel?.emblaApi?.value ?? carousel?.emblaApi
      if (!embla || typeof embla.canScrollNext !== 'function') return

      if (embla.canScrollNext()) embla.scrollNext()
      else embla.scrollTo(0)
    }, 5000)

    carouselIntervals.push(intervalId)
  })
})

onUnmounted(() => {
  carouselIntervals.forEach(intervalId => clearInterval(intervalId))
})

const image = ref<string>('')
const version = ref<string>('')
const generation = ref<string>('')
const pokedexes = ref<string>('')
const regions = ref<string>('')


const isOpen = ref(false)
const openModal = async (item: Version) => {
  image.value = item.image
  try {
    const info = await fetchVersionInfo(item.id)
    version.value = info.version
    generation.value = info.generation
    pokedexes.value = info.pokedexes
    regions.value = info.regions
    isOpen.value = true
  } catch (error) {
    if (error instanceof Error) console.error(error.message, error.stack)
    else console.error(error)
  }
}
</script>

<template>
  <div>
    <UCarousel
      v-for="(carousel, index) in carouselConfigs"
      :key="index"
      :ref="el => carouselRefs[index] = el"
      v-slot="{ item }"
      :items="carousel.items"
      :ui="{ item: 'basis-auto' }"
      class="mb-4"
    >
        <UButton @click="openModal(item)" color="neutral" variant="subtle" class="mx-2">
          <img
            @load="markImageLoaded"
            :src="item.image"
            :class="[carousel.imageClass, 'lazy-img']"
            draggable="false"
          >
        </UButton>
    </UCarousel>
    <UModal v-model:open="isOpen" title="Version Details" :ui="{ content: 'bg-gradient-to-tr from-gray-100 to-gray-300' }">
      <template #body>
        <div class="mx-auto my-4">
          <img :src="image" class="rounded-3xl max-h-[300px] w-auto">
        </div>
        <div class="text-xl font-bold p-4">Version: {{ version }}</div>
        <div class="text-xl font-bold p-4">Generation: {{ generation }}</div>
        <div class="text-xl font-bold p-4">Pokédex: {{ pokedexes }}</div>
        <div class="text-xl font-bold p-4">Regions: {{ regions }}</div>
      </template>
    </UModal>
  </div>
</template>

<style scoped>
.lazy-img {
  opacity: 0;
  transform: translateY(20px);
  transition: all 0.5s ease-in;
}

.lazy-img.loaded {
  opacity: 1;
  transform: translateY(0px);
}
</style>
