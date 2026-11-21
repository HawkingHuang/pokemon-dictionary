<script setup lang="ts">
import type { GenerationGroup, Version } from '@/types'

const props = defineProps<{ group: GenerationGroup; side: 'left' | 'right' }>()
defineEmits<{ open: [version: Version] }>()

// below sm the timeline is a single column, so alignment only flips on sm and up
const align = computed(() => props.side === 'left' ? 'sm:items-end sm:text-right' : 'sm:items-start sm:text-left')
const justify = computed(() => props.side === 'left' ? 'sm:justify-end' : 'sm:justify-start')
</script>

<template>
  <div
    class="flex flex-col items-start text-left bg-white rounded-2xl p-7 shadow-[0_2px_8px_rgba(26,26,26,0.08)]"
    :class="align"
  >
    <div class="text-[13px] font-semibold tracking-[2px] text-[#024ad8] uppercase">
      Generation {{ group.roman }}
    </div>
    <div class="mt-1.5 text-[32px] font-bold leading-tight text-[#15171c]">{{ group.region }}</div>
    <div class="mt-1.5 text-[13px] text-[#9aa3b0]">
      {{ group.system }} · {{ group.count }} versions · {{ group.yearRange }}
    </div>

    <div v-for="lane in group.yearLanes" :key="lane.year" class="mt-6 w-full">
      <div class="mb-2.5 text-[14px] font-bold text-[#024ad8]">{{ lane.year }}</div>
      <div class="flex flex-wrap gap-4 justify-start" :class="justify">
        <VersionCoverCard
          v-for="game in lane.games"
          :key="game.id"
          :version="game"
          @click="$emit('open', game)"
        />
      </div>
    </div>
  </div>
</template>
