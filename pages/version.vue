<script setup lang="ts">
definePageMeta({
  layout: 'base-layout'
})

const carouselRef = ref()
onMounted(() => {
  setInterval(() => {
    if (!carouselRef.value) return

    if (carouselRef.value.page === carouselRef.value.pages) {
      return carouselRef.value.select(0)
    }

    carouselRef.value.next()
  }, 3000)
})

interface Version {
  id: number,
  label: string,
  image: string
}

const items = [
  {
    id: 1,
    label: 'Pokémon Red Version',
    image: '/images/versions/red_version.png'
  },
  {
    id: 2,
    label: 'Pokémon Blue Version',
    image: '/images/versions/blue_version.png'
  },
  {
    id: 3,
    label: 'Pokémon Yellow Version',
    image: '/images/versions/yellow_version.png'
  },
  {
    id: 4,
    label: 'Pokémon Gold Version',
    image: '/images/versions/gold_version.png'
  },
  {
    id: 5,
    label: 'Pokémon Silver Version',
    image: '/images/versions/silver_version.png'
  },
  {
    id: 6,
    label: 'Pokémon Crystal Version',
    image: '/images/versions/crystal_version.png'
  },
  {
    id: 7,
    label: 'Pokémon Ruby Version',
    image: '/images/versions/ruby_version.jpg'
  },
  {
    id: 8,
    label: 'Pokémon Sapphire Version',
    image: '/images/versions/sapphire_version.jpg'
  },
  {
    id: 9,
    label: 'Pokémon Emerald Version',
    image: '/images/versions/emerald_version.jpg'
  },
  {
    id: 10,
    label: 'Pokémon FireRed Version',
    image: '/images/versions/fire_red_version.jpg'
  },
  {
    id: 11,
    label: 'Pokémon LeafGreen Version',
    image: '/images/versions/leaf_green_version.jpg'
  },
]

const test = (item: Version) => {
  console.log(item)
}

const image = ref<string>('')
const version = ref<string>('')
const generation = ref<string>('')
const pokedexes = ref<string[]>([])
const regions = ref<string[]>([])
const moveLearnMethods = ref<string[]>([])


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

const capitalize = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

watch(isOpen, () => {
  if (!isOpen.value) {
    version.value = ''
  }
})

const getVersionInfo = async (id: number) => {
  return new Promise((resolve, reject) => {
    $.ajax({
      url: `https://pokeapi.co/api/v2/version/${id}`,
      type: 'GET',
      dataType: 'json',
      success: (res) => {
        console.log(res)
        version.value = capitalize(res.name)
        resolve(res)
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
    <UCarousel ref="carouselRef" v-slot="{ item }" :items="items">
      <UButton @click="openModal(item)" color="gray">
        <img :src="item.image" width="300" height="400" draggable="false" @click="test(item)">
      </UButton>
    </UCarousel>
    <UModal v-model="isOpen" :ui="{background: 'bg-gradient-to-tr from-gray-100 to-gray-300'}">
      <div class="mx-auto mt-4">
        <img :src="image" width="300" height="300" class="rounded-3xl">
      </div>
      <div class="text-xl font-bold p-4">Version: {{ version }}</div>
      <div class="text-xl font-bold p-4">Generation: {{ generation }}</div>
      <div class="text-xl font-bold p-4">Pokédex: {{ pokedexes }}</div>
      <div class="text-xl font-bold p-4">Regions: {{ regions }}</div>
      <div class="text-xl font-bold p-4">Move Learn Methods: {{ moveLearnMethods }}</div>
    </UModal>
  </div>
</template>
