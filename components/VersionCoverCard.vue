<script setup lang="ts">
import type { Version } from '@/types'

defineProps<{ version: Version }>()
</script>

<template>
  <button class="group w-[184px] text-left cursor-pointer">
    <div class="relative overflow-hidden rounded-xl bg-white border border-[#e2e6ec] shadow-[0_2px_8px_rgba(26,26,26,0.08)] transition-transform duration-300 group-hover:-translate-y-1">
      <img
        :src="version.image"
        :alt="`${version.title} cover`"
        width="184" height="148"
        class="h-[148px] w-full object-contain p-2"
        loading="lazy"
      >
      <!-- representative colour of the game, as a bottom accent strip -->
      <div class="absolute inset-x-0 bottom-0 h-[4px]" :style="{ background: version.color }" />
    </div>
    <div class="mt-2 text-[15px] font-bold text-[#15171c] leading-tight">{{ version.title }}</div>
    <div class="text-[12px] text-[#9aa3b0]">{{ version.legendary }}</div>
  </button>
</template>
