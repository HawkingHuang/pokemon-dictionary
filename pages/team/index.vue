<script setup lang="ts">
import { VueDraggable } from 'vue-draggable-plus'
import { TEAM_SIZE } from '@/utils/constants'
import { fetchPokemonIndex, fetchPokemonDetail } from '@/services/pokeapi'
import type { TeamMember, PokemonDetail } from '@/types'

definePageMeta({ layout: 'base-layout' })

// ---- search source: the full name/id list, fetched once (memoized in the service) ----
const pokemonList = ref<{ name: string; id: number }[]>([])
const query = ref('')

onMounted(async () => {
  try { pokemonList.value = await fetchPokemonIndex() }
  catch (e) { console.error(e) }
})

// ---- resolved details per id, to enrich suggestions (the fetch is memoized in the service) ----
const details = reactive<Record<number, PokemonDetail>>({})

const loadDetail = (id: number) => {
  if (details[id]) return
  fetchPokemonDetail(id).then(d => { details[id] = d }).catch(e => console.error(e))
}

// ---- live suggestions (top 10), each enriched with cached detail when available ----
const dropdownResults = computed(() => {
  const q = query.value.trim().toLowerCase()
  if (!q) return []
  return pokemonList.value
    .filter(p => p.name.toLowerCase().includes(q) || String(p.id).includes(q))
    .slice(0, 10)
    .map(p => ({ ...p, no: formatDexNumber(p.id), sprite: spriteUrl(p.id), detail: details[p.id] }))
})

// prefetch type/BST info for whatever is currently shown (idempotent + cached)
watch(dropdownResults, list => list.forEach(r => loadDetail(r.id)))

// ---- team ----
const team = ref<TeamMember[]>([])
let uid = 0
const teamLabel = computed(() => `${team.value.length} / ${TEAM_SIZE}`)
const emptyCount = computed(() => Math.max(0, TEAM_SIZE - team.value.length))

const pushMember = (d: PokemonDetail) => {
  team.value.push({ uid: uid++, ...d })
}

const addToTeam = async (id: number) => {
  if (team.value.length >= TEAM_SIZE) return // duplicates are allowed; only cap the size

  try {
    const d = await fetchPokemonDetail(id) // memoized — instant if already prefetched
    if (team.value.length < TEAM_SIZE) pushMember(d)
  } catch (e) { console.error(e) }
}

const removeMember = (memberUid: number) => {
  team.value = team.value.filter(m => m.uid !== memberUid)
}

// ---- defensive weakness analysis ----
const warnings = computed(() => analyzeTeamWeaknesses(team.value))
</script>

<template>
  <div class="bg-[#eef1f6] rounded-2xl px-6 pt-7 pb-16 min-h-[calc(100vh-120px)]">
    <div class="max-w-[1120px] mx-auto">

      <!-- header -->
      <div>
        <div class="text-[12px] font-semibold tracking-[2px] text-[#024ad8] uppercase">Pokémon Team Builder</div>
        <h1 class="mt-1.5 text-[30px] font-bold text-[#15171c]">Team Builder</h1>
      </div>
      <p class="mt-3 mb-6 text-[#5b6471] text-[14px] max-w-[680px] leading-relaxed">
        Search for Pokémon and add them to your party (up to 6). Drag any row to reorder your battle lineup.
        The analysis below flags the attacking types your whole team is most vulnerable to.
      </p>


      <div class="grid grid-cols-1 lg:grid-cols-[360px_1fr] gap-6 items-start">

        <!-- left: search -->
        <div class="bg-white rounded-2xl p-5 shadow-[0_2px_8px_rgba(26,26,26,0.08)] lg:sticky lg:top-5">
          <div class="text-[14px] font-bold text-[#15171c]">Search Pokémon</div>
          <input
            v-model="query"
            placeholder="Name or number…"
            class="w-full mt-2.5 px-3.5 py-[11px] border border-[#e2e6ec] rounded-[10px] text-[14px] outline-none focus:border-[#024ad8]"
          >
          <div class="mt-3.5 flex flex-col gap-2 max-h-[540px] overflow-auto custom-scroll">
            <button
              v-for="r in dropdownResults"
              :key="r.id"
              class="flex items-center gap-3 w-full text-left bg-[#f7f9fc] border border-[#eef1f6] rounded-xl px-3 py-2 cursor-pointer hover:bg-[#eef3fb]"
              @click="addToTeam(r.id)"
            >
              <img :src="r.sprite" :alt="r.name" class="w-[46px] h-[46px] object-contain flex-none [image-rendering:pixelated]" >
              <div class="flex-1 min-w-0">
                <div class="flex gap-1.5 items-baseline">
                  <span class="font-bold text-[15px] text-[#15171c] capitalize truncate">{{ capitalizeName(r.name) }}</span>
                  <span class="text-[11px] text-[#9aa3b0] flex-none">{{ r.no }}</span>
                </div>
                <div v-if="r.detail" class="flex gap-1.5 mt-1 flex-wrap">
                  <span
                    v-for="t in r.detail.types"
                    :key="t"
                    class="text-white font-semibold text-[11px] px-2 py-0.5 rounded-full capitalize"
                    :style="{ background: typeColor(t) }"
                  >{{ capitalizeName(t) }}</span>
                </div>
              </div>
              <span class="flex-none text-[#024ad8] font-bold text-[13px] whitespace-nowrap">＋ Add</span>
            </button>

            <div v-if="query.trim() && !dropdownResults.length" class="text-center text-[#aab2bf] text-[13px] py-7">No matches</div>
          </div>
        </div>

        <!-- right: team + analysis -->
        <div>
          <div class="flex items-center justify-between mb-3.5">
            <h2 class="m-0 text-[18px] font-bold text-[#15171c]">My Team <span class="text-[#9aa3b0] font-semibold text-[14px]">· drag to reorder</span></h2>
            <span class="font-bold text-[#024ad8] text-[15px]">{{ teamLabel }}</span>
          </div>

          <div class="flex flex-col gap-2.5">
            <ClientOnly>
              <VueDraggable v-if="team.length" v-model="team" :animation="150" handle=".drag-handle" class="flex flex-col gap-2.5">
                <TeamMemberCard
                  v-for="(m, i) in team"
                  :key="m.uid"
                  :member="m"
                  :slot-number="i + 1"
                  @remove="removeMember(m.uid)"
                />
              </VueDraggable>
            </ClientOnly>

            <div
              v-for="n in emptyCount"
              :key="'empty-' + n"
              class="flex items-center gap-3.5 border-2 border-dashed border-[#d4dae3] rounded-[14px] px-[22px] py-[18px] text-[#aab2bf]"
            >
              <div class="w-[26px] text-center font-bold text-[15px]">{{ team.length + n }}</div>
              <div class="text-[14px]">Empty — search on the left to add</div>
            </div>
          </div>

          <!-- weakness analysis -->
          <div class="mt-7">
            <h2 class="m-0 mb-3.5 text-[18px] font-bold text-[#15171c]">Weakness Analysis <span class="text-[#9aa3b0] font-semibold text-[14px]">· defensive type matchups</span></h2>

            <div
              v-if="team.length < 2"
              class="bg-white rounded-2xl p-6 shadow-[0_2px_8px_rgba(26,26,26,0.08)] text-center text-[#9aa3b0] text-[14px] leading-relaxed"
            >Add at least 2 Pokémon to analyze your team's shared weaknesses.</div>

            <div
              v-else-if="!warnings.length"
              class="bg-white rounded-2xl p-6 shadow-[0_2px_8px_rgba(26,26,26,0.08)] flex items-center gap-3"
            >
              <div class="w-9 h-9 rounded-full bg-[#e7f6ec] text-[#2f9e58] flex items-center justify-center text-[18px] font-bold flex-none">✓</div>
              <div>
                <div class="font-bold text-[#15171c] text-[15px]">Well-balanced team</div>
                <div class="text-[#5b6471] text-[13px]">No attacking type threatens a majority of your team. Nice coverage!</div>
              </div>
            </div>

            <div v-else class="flex flex-col gap-2.5">
              <div
                v-for="w in warnings"
                :key="w.type"
                class="relative flex items-center gap-3.5 bg-white rounded-[14px] pl-5 pr-[14px] py-3 shadow-[0_2px_8px_rgba(26,26,26,0.08)] overflow-hidden"
              >
                <div class="absolute left-0 top-0 bottom-0 w-[6px]" :style="{ background: typeColor(w.type) }" />
                <span class="text-white font-semibold text-[13px] px-3 py-1 rounded-full capitalize flex-none" :style="{ background: typeColor(w.type) }">{{ capitalizeName(w.type) }}</span>
                <div class="flex-1 min-w-0">
                  <div class="text-[14px] text-[#15171c] font-semibold">
                    {{ w.weakCount }} / {{ team.length }} take extra damage
                    <span class="text-[#9aa3b0] font-normal">· {{ w.resistCount }} resist</span>
                  </div>
                  <div class="flex gap-1 mt-1.5 flex-wrap items-center">
                    <img
                      v-for="(m, mi) in w.weakMembers"
                      :key="mi"
                      :src="m.image"
                      :alt="m.name"
                      :title="capitalizeName(m.name)"
                      class="w-7 h-7 object-contain"
                    >
                  </div>
                </div>
                <span
                  class="flex-none text-[11px] font-bold px-2.5 py-1 rounded-full"
                  :class="w.tier === 'danger' ? 'bg-[#fdecec] text-[#d23b3b]' : 'bg-[#fef6e6] text-[#c98a16]'"
                >{{ w.tier === 'danger' ? 'HIGH RISK' : 'WATCH' }}</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  </div>
</template>
