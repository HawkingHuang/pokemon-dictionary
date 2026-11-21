<script setup lang="ts">
import { fetchVersionInfo } from '@/services/pokeapi'
import type { Version, VersionInfo } from '@/types'

const props = defineProps<{ version: Version | null }>()
const open = defineModel<boolean>('open', { default: false })

const info = ref<VersionInfo | null>(null)

// generation / pokédex / regions come live from PokeAPI; the rest is curated
watch(() => props.version, async (version) => {
  info.value = null
  if (!version) return
  info.value = await fetchVersionInfo(version.id).catch(() => null)
}, { immediate: true })

// curated values stand in until the live ones land, so nothing flashes blank
const rows = computed(() => {
  const v = props.version
  if (!v) return []
  return [
    { label: 'Version', value: v.title },
    { label: 'Generation', value: info.value?.generation ?? `Generation ${v.genRoman}` },
    { label: 'Pokédex', value: info.value?.pokedexes ?? '—' },
    { label: 'Regions', value: info.value?.regions ?? v.region },
    { label: 'Release Year', value: v.year },
    { label: 'Platform', value: v.system },
    { label: 'Cover Legendary', value: v.legendary },
  ]
})
</script>

<template>
  <USlideover v-model:open="open" :ui="{ content: 'sm:max-w-[462px]' }">
    <template #content>
      <div v-if="version" class="flex h-full flex-col bg-white">
        <!-- cover hero -->
        <div class="relative shrink-0 bg-[#eef1f6] px-6 py-6">
          <img
            :src="version.image"
            :alt="`${version.title} cover`"
            class="mx-auto max-h-[240px] w-auto rounded-xl"
          >
          <div class="absolute inset-x-0 bottom-0 h-1" :style="{ background: version.color }" />
          <UButton
            icon="i-heroicons-x-mark"
            color="neutral"
            variant="ghost"
            aria-label="Close"
            class="absolute right-3 top-3"
            @click="open = false"
          />
        </div>

        <div class="flex-1 overflow-y-auto custom-scroll p-6">
          <div class="text-[12px] font-semibold tracking-[2px] text-[#024ad8] uppercase">
            {{ version.system }} · {{ version.year }}
          </div>
          <h2 class="mt-1 text-[26px] font-bold text-[#15171c] leading-tight">{{ version.title }}</h2>

          <div class="mt-3 flex flex-wrap gap-2">
            <UBadge color="primary" variant="solid" class="rounded-full">Generation {{ version.genRoman }}</UBadge>
            <UBadge color="neutral" variant="outline" class="rounded-full">{{ version.region }}</UBadge>
          </div>

          <p class="mt-4 text-[14px] leading-relaxed text-[#5b6471]">{{ version.intro }}</p>

          <dl class="mt-6 border-t border-[#e2e6ec]">
            <div
              v-for="row in rows"
              :key="row.label"
              class="flex justify-between gap-4 border-b border-[#e2e6ec] py-3"
            >
              <dt class="text-[13px] text-[#9aa3b0]">{{ row.label }}</dt>
              <dd class="text-right text-[13px] font-semibold text-[#15171c]">{{ row.value }}</dd>
            </div>
          </dl>
        </div>
      </div>
    </template>
  </USlideover>
</template>
