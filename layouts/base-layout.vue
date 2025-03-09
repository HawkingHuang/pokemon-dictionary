<script setup lang="ts">
onMounted(() => {
  document.documentElement.classList.add('light')
  document.documentElement.classList.remove('dark')
})
</script>

<template>
  <div>
    <navbar />
    <div class="w-[98%] p-1 mx-auto mt-4">
      <slot></slot>
    </div>
  </div>
</template>
