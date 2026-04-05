<script setup lang="ts">
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
      if (!carousel) return

      if (carousel.page === carousel.pages) {
        carousel.select(0)
        return
      }

      carousel.next()
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
    await getVersionInfo(item.id)
    isOpen.value = true
  } catch (error) {
    if (error instanceof Error) console.error(error.message, error.stack)
    else console.error(error)
  }
}
const getVersionInfo = async (id: number) => {
  return new Promise((resolve, reject) => {
    $.ajax({
      url: `https://pokeapi.co/api/v2/version/${id}`,
      type: 'GET',
      dataType: 'json',
      success: (res) => {
        version.value = capitalizeVersion(res.name)

        $.ajax({
          url: res.version_group.url,
          type: 'GET',
          dataType: 'json',
          success: (details) => {
            generation.value = capitalizeGeneration(details.generation.name)
            pokedexes.value = capitalizePokedexes(details.pokedexes)
            regions.value = capitalizeRegions(details.regions)

            resolve(res)
          },
          error: (error) => {
            if (error instanceof Error) console.error(error.message, error.stack)
            else console.error(error)
          }
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
</script>

<template>
  <div>
    <UCarousel
      v-for="(carousel, index) in carouselConfigs"
      :key="index"
      :ref="el => carouselRefs[index] = el"
      v-slot="{ item }"
      :items="carousel.items"
      class="mb-4"
    >
        <UButton @click="openModal(item)" color="gray" class="mx-2">
          <img
            @load="markImageLoaded"
            :src="item.image"
            :class="[carousel.imageClass, 'lazy-img']"
            draggable="false"
          >
        </UButton>
    </UCarousel>
    <UModal v-model="isOpen" :ui="{background: 'bg-gradient-to-tr from-gray-100 to-gray-300'}">
      <div class="mx-auto my-4">
        <img :src="image" class="rounded-3xl max-h-[300px] w-auto">
      </div>
      <div class="text-xl font-bold p-4">Version: {{ version }}</div>
      <div class="text-xl font-bold p-4">Generation: {{ generation }}</div>
      <div class="text-xl font-bold p-4">Pokédex: {{ pokedexes }}</div>
      <div class="text-xl font-bold p-4">Regions: {{ regions }}</div>
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
