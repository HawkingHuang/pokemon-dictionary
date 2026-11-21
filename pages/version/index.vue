<script setup lang="ts">
import type { Version } from '@/types'

definePageMeta({ layout: 'base-layout' })

const timeline = buildTimeline()
const totalGames = versions.length

const selected = ref<Version | null>(null)
const panelOpen = ref<boolean>(false)
const openVersion = (version: Version) => {
  selected.value = version
  panelOpen.value = true
}

// scroll-spy: highlight the generation currently nearest the top
const activeGen = ref<number>(timeline[0]?.num ?? 1)
const sections = new Map<number, HTMLElement>()
const bindSection = (num: number, el: unknown) => {
  if (el instanceof HTMLElement) sections.set(num, el)
}

let observer: IntersectionObserver | null = null
onMounted(() => {
  observer = new IntersectionObserver((entries) => {
    entries.filter(e => e.isIntersecting).forEach((entry) => {
      const num = Number((entry.target as HTMLElement).dataset.gen)
      if (num) activeGen.value = num
    })
  }, { rootMargin: '-12% 0px -78% 0px' })
  sections.forEach(el => observer?.observe(el))
})
onBeforeUnmount(() => observer?.disconnect())

const scrollToGen = (num: number) => {
  const el = sections.get(num)
  if (!el) return
  window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 80, behavior: 'smooth' })
}
</script>

<template>
  <div class="bg-[#eef1f6] rounded-2xl px-6 pt-7 pb-16 min-h-[calc(100vh-120px)]">
    <div class="max-w-[1560px] mx-auto">

      <!-- header -->
      <div>
        <div class="text-[13px] font-semibold tracking-[2px] text-[#024ad8] uppercase">Pokémon Version Timeline</div>
        <h1 class="mt-1.5 text-[38px] font-bold text-[#15171c]">Version Timeline</h1>
      </div>
      <p class="mt-3 mb-7 text-[#5b6471] text-[15px] max-w-[760px] leading-relaxed">
        Every mainline release from 1996 to 2022 — {{ totalGames }} versions across {{ timeline.length }} generations,
        laid out in order. Pick any cover to see its generation, Pokédex and regions.
      </p>

      <!-- generation index: jump + scroll-spy highlight -->
      <div class="sticky top-0 z-20 -mx-1 mb-2 bg-[#eef1f6]/90 backdrop-blur py-2">
        <div class="flex items-center gap-1 overflow-x-auto custom-scroll px-1">
          <span class="mr-2 shrink-0 text-[12px] font-bold uppercase tracking-[2px] text-[#9aa3b0]">Timeline</span>
          <button
            v-for="group in timeline"
            :key="group.num"
            class="shrink-0 rounded-full px-4 py-2 text-[15px] font-bold transition-colors cursor-pointer"
            :class="group.num === activeGen
              ? 'bg-[#024ad8] text-white'
              : 'text-[#5b6471] hover:bg-white'"
            @click="scrollToGen(group.num)"
          >{{ group.roman }}</button>
        </div>
      </div>

      <!-- timeline: hand-rolled because @nuxt/ui has no timeline/spine primitive -->
      <div class="relative">
        <div class="pointer-events-none absolute inset-y-0 left-1/2 hidden w-[3px] -translate-x-1/2 bg-gradient-to-b from-[#024ad8] to-[#024ad8]/15 sm:block" />

        <section
          v-for="(group, i) in timeline"
          :key="group.num"
          :ref="el => bindSection(group.num, el)"
          :data-gen="group.num"
          class="relative py-7"
        >
          <!-- generation node on the spine -->
          <div class="absolute left-1/2 top-10 z-10 hidden -translate-x-1/2 sm:block">
            <div
              class="flex h-14 w-14 items-center justify-center rounded-full border-4 border-[#eef1f6] bg-[#024ad8] text-[17px] font-bold text-white transition-transform duration-300"
              :class="group.num === activeGen ? 'scale-110' : ''"
            >{{ group.roman }}</div>
          </div>

          <div class="sm:grid sm:grid-cols-2">
            <div class="sm:pr-16">
              <VersionGenBlock v-if="i % 2 === 0" :group="group" side="left" @open="openVersion" />
            </div>
            <div class="sm:pl-16">
              <VersionGenBlock v-if="i % 2 === 1" :group="group" side="right" @open="openVersion" />
            </div>
          </div>
        </section>

        <!-- end cap: the spine stops at this ring, so the caption below stays clear of it -->
        <div class="relative z-10 flex justify-center pt-2">
          <div class="h-3 w-3 rounded-full border-2 border-[#024ad8]/40 bg-[#eef1f6]" />
        </div>
      </div>

      <p class="mt-4 text-center text-[13px] text-[#9aa3b0]">The story continues…</p>

      <VersionReadingPanel v-model:open="panelOpen" :version="selected" />
    </div>
  </div>
</template>
