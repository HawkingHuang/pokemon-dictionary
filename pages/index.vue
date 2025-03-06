<script setup lang="ts">
definePageMeta({
  layout: 'base-layout'
})
</script>

<template>
  <div class="relative max-h-[90vh] overflow-y-auto custom-scroll">
    <div class="relative bg-cover bg-center rounded">
      <div class="absolute bg-fixed inset-0 bg-[url('/images/backgrounds/home_background.jpg')] bg-cover bg-center opacity-25 rounded-lg"></div>
      
      <div class="relative z-10 p-1 animate">
        <div class="min-h-[800px] text-center">
          <h1 class="text-5xl md:text-3xl font-bold my-8">Pokémon Dictionary: An Experimental Pokémon Introductory Guide</h1>
          <p class="text-3xl md:text-xl font-bold mt-20">Pokémon Dictionary is a handbook for players who are not familiar with the world of Pokémon.</p>
          <p class="text-3xl md:text-xl font-bold mt-20">In this handbook, you will first learn about all versions of the main Pokémon game series.</p>
          <div class="max-w-[1200px] mx-auto mt-10 overflow-hidden rounded">
            <video autoplay loop muted>
              <source src="/videos/home_video1.mp4" />
            </video>
          </div>
          <p class="text-3xl md:text-xl font-bold mt-20">Also, check the Pokédex page to discover all the Pokémon in different versions.</p>
          <div class="max-w-[1200px] mx-auto mt-10 overflow-hidden rounded">
            <video autoplay loop muted>
              <source src="/videos/home_video2.mp4" />
            </video>
          </div>
          <p class="text-3xl md:text-xl font-bold mt-20">In addition, you can compare the stats of two Pokémon on the Pokémon page to see which one has the edge in certain stats.</p>
          <div class="max-w-[1200px] mx-auto my-10 overflow-hidden rounded">
            <video autoplay loop muted>
              <source src="/videos/home_video3.mp4" />
            </video>
          </div>
          <p class="text-3xl md:text-xl font-bold mt-20">In time, there will be exciting new features for you to explore, so stay tuned.</p>
          <p class="text-3xl md:text-xl font-bold mt-20">Good luck, Pokémon trainers! May your journey be full of discoveries!</p>
          <div class="max-w-[1200px] mx-auto my-10 overflow-hidden rounded">
            <img src="/images/home/home_image1.jpg" alt="">
          </div>
        </div>
      </div>
    </div>
  </div>
</template>



<style scoped>
.custom-scroll::-webkit-scrollbar {
  height: 0.5rem;
}

.custom-scroll::-webkit-scrollbar-thumb {
  background-color: #dee2e6;
  border-radius: 15px;
}

.custom-scroll::-webkit-scrollbar-track {
  background-color: #f1f3f5;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.animate {
  animation: fadeIn 1.2s ease-in;
}
</style>