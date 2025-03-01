<script setup>
const search = () => {
  console.log($)
  $.ajax({
    url: 'https://pokeapi.co/api/v2/pokemon/ditto',
    type: 'GET',
    dataType: 'json',
    success: (response) => {
      console.log(response)
    },
    error: (error) => {
      console.log(error)
    }
  })
}
</script>

<template>
  <div>
    <button @click="search">Search</button>
  </div>
</template>