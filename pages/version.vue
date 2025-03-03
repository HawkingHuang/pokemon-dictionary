<script setup lang="ts">
definePageMeta({
  layout: 'base-layout'
})

const carouselRef = ref()
const carouselRef2 = ref()
const carouselRef3 = ref()
onMounted(() => {
  setInterval(() => {
    if (!carouselRef.value) return

    if (carouselRef.value.page === carouselRef.value.pages) {
      return carouselRef.value.select(0)
    }

    carouselRef.value.next()
  }, 5000)

  setInterval(() => {
    if (!carouselRef2.value) return

    if (carouselRef2.value.page === carouselRef2.value.pages) {
      return carouselRef2.value.select(0)
    }

    carouselRef2.value.next()
  }, 5000)

  setInterval(() => {
    if (!carouselRef3.value) return

    if (carouselRef3.value.page === carouselRef3.value.pages) {
      return carouselRef3.value.select(0)
    }

    carouselRef3.value.next()
  }, 5000)
})

import { items, itemsSecondRow, itemsThirdRow } from '@/utils/versions'
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
    console.log(error)
  }
}

import { capitalizeVersion, capitalizeGeneration, capitalizePokedexes, capitalizeRegions } from '@/utils/capitalize'
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
            console.log(error)
          }
        })
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
    <UCarousel ref="carouselRef" v-slot="{ item }" :items="items" class="mb-4">
      <UButton @click="openModal(item)" color="gray" class="mx-2">
        <img :src="item.image" width="300" height="400" draggable="false">
      </UButton>
    </UCarousel>
    <UCarousel ref="carouselRef2" v-slot="{ item }" :items="itemsSecondRow" class="mb-4">
      <UButton @click="openModal(item)" color="gray" class="mx-2">
        <img :src="item.image" width="300" height="400" draggable="false">
      </UButton>
    </UCarousel>
    <UCarousel ref="carouselRef3" v-slot="{ item }" :items="itemsThirdRow" class="mb-4">
      <UButton @click="openModal(item)" color="gray" class="mx-2">
        <img :src="item.image" draggable="false" class="w-[225px] h-[400px]">
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
