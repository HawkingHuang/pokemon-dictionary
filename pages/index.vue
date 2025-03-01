<script setup>
const search = () => {
  console.log($)
  $.ajax({
    url: 'https://pokeapi.co/api/v2/version/4/',
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
    <navbar />
    <button @click="search">Search</button>
  </div>
</template>