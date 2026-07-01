<script setup lang="ts">
import type { TeamMember } from '@/types'

const props = defineProps<{
  member: TeamMember
  slotNumber: number
}>()

const emit = defineEmits<{
  (e: 'remove'): void
}>()

// this Pokémon's own super-effective weaknesses (2× / 4×), strongest first
const weaknesses = computed(() => getMemberWeaknesses(props.member.types))
</script>

<template>
  <div class="relative flex items-center gap-3.5 bg-white rounded-[14px] py-3 pr-[14px] pl-[22px] shadow-[0_2px_8px_rgba(26,26,26,0.08)] overflow-hidden">
    <!-- accent bar in the primary type's color -->
    <div class="absolute left-0 top-0 bottom-0 w-[6px]" :style="{ background: typeColor(member.types[0]) }" />

    <!-- drag handle -->
    <span class="drag-handle cursor-grab select-none flex-none text-[18px] tracking-[-2px] text-[#c2c8d0] px-0.5" title="Drag to reorder">⠿</span>
    <div class="flex-none w-[26px] text-center font-bold text-[#9aa3b0] text-[15px]">{{ slotNumber }}</div>

    <img :src="member.image" :alt="member.name" class="w-[58px] h-[58px] object-contain flex-none" >

    <div class="flex-1 min-w-0">
      <div class="flex gap-2 items-baseline">
        <span class="font-bold text-[16px] text-[#15171c] capitalize truncate">{{ capitalizeName(member.name) }}</span>
        <span class="text-[12px] text-[#9aa3b0] flex-none">#{{ String(member.id).padStart(4, '0') }}</span>
      </div>
      <div class="flex gap-1.5 mt-1.5 flex-wrap items-center">
        <span
          v-for="t in member.types"
          :key="t"
          class="text-white font-semibold text-[12px] px-2.5 py-[3px] rounded-full whitespace-nowrap capitalize"
          :style="{ background: typeColor(t) }"
        >{{ capitalizeName(t) }}</span>
        <span v-if="member.ability" class="text-[12px] text-[#6b7280]">{{ capitalizeVersion(member.ability) }}</span>
      </div>
      <div v-if="weaknesses.length" class="flex gap-1 mt-1.5 flex-wrap items-center">
        <span class="text-[11px] text-[#9aa3b0] flex-none">Weak to</span>
        <span
          v-for="w in weaknesses"
          :key="w.type"
          class="text-white font-semibold text-[11px] px-2 py-0.5 rounded-full whitespace-nowrap capitalize"
          :style="{ background: typeColor(w.type) }"
        >{{ capitalizeName(w.type) }} ×{{ w.multiplier }}</span>
      </div>
    </div>

    <div class="text-right flex-none pr-1">
      <div class="text-[11px] text-[#9aa3b0] font-semibold">Base Stats</div>
      <div class="text-[20px] font-bold text-[#15171c] leading-none">{{ member.baseStats }}</div>
    </div>

    <button
      class="flex-none w-7 h-7 border-0 rounded-lg bg-[#f1f3f7] text-[#9aa3b0] text-[16px] leading-none cursor-pointer hover:bg-[#e6e9ef] hover:text-[#d23b3b]"
      title="Remove"
      @click="emit('remove')"
    >×</button>
  </div>
</template>
