<script setup lang="ts">
const links = [
  {
    label: 'Home',
    icon: 'i-mingcute:home-5-line',
    to: '/'
  },
  {
    label: 'Version',
    icon: 'i-mingcute:version-line',
    to: '/version'
  },
  {
    label: 'Pokédex',
    icon: 'i-mingcute:book-2-line',
    to: '/pokedex'
  },
  {
    label: 'Pokémon',
    icon: 'i-gg:pokemon',
    to: '/pokemon'
  },
  {
    label: 'Team',
    icon: 'i-mingcute:group-3-line',
    to: '/team'
  },
]
</script>

<template>
  <UNavigationMenu :items="links" orientation="horizontal" class="border-b border-gray-200 dark:border-gray-800" />
</template>
