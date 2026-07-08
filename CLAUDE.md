# CLAUDE.md — Coding conventions

A Nuxt 3 + Vue 3 + TypeScript Pokémon dictionary (@nuxt/ui, Tailwind, chart.js,
vue-draggable-plus). These are the rules for all new and refactored code.

- The **Team feature (`/team`)** is the reference implementation — when unsure, copy its patterns.
- Some older modules (pokedex / pokemon / version) predate these rules and are being
  migrated toward them (see [docs/refactor-architecture.md](docs/refactor-architecture.md)).

## Where things live
```
services/   API calls (data fetching + caching)      e.g. services/pokeapi.ts
types/      TypeScript types, one file per domain     e.g. types/team.ts + types/index.ts
utils/      pure helpers + small constants            e.g. utils/typeChart.ts, utils/constants.ts
components/ reusable UI                               e.g. components/TeamMemberCard.vue
pages/      routes (UI + reactive state only)         e.g. pages/team/index.vue
```

## 1. Data fetching → service layer
All API calls live in `services/` and use Nuxt's **`$fetch`**. Return **mapped domain
models**, never raw API JSON. Centralize the base URL and memoize requests.

```ts
// ✅ services/pokeapi.ts — mapped model, memoized, retryable
const cache = new Map<number | string, Promise<PokemonDetail>>()
export function fetchPokemonDetail(id: number | string): Promise<PokemonDetail> {
  let p = cache.get(id)
  if (!p) {
    p = $fetch<any>(`${POKEAPI_BASE_URL}/pokemon/${id}`)
      .then(res => ({ id: res.id, name: res.name, types: res.types.map((t: any) => t.type.name) /* … */ }))
      .catch(err => { cache.delete(id); throw err }) // let a failed load retry
    cache.set(id, p)
  }
  return p
}
```
```ts
// ❌ Don't: jQuery $.ajax, or bare fetch inside a page/component, returning raw JSON
$.ajax({ url: 'https://pokeapi.co/api/v2/pokemon/6', success: (res) => { basicInfo.value = res } })
```

## 2. Types → organize by domain
One file per domain under `types/`, re-exported through the `types/index.ts` barrel.
Keep the raw API type next to its mapped model. Import from **`@/types`**.

```ts
// types/team.ts
export interface TeamMember { uid: number; id: number; name: string; types: string[] /* … */ }
export type PokemonDetail = Omit<TeamMember, 'uid'>
```
```ts
// types/index.ts (barrel)
export type * from './team'
```
```ts
import type { TeamMember } from '@/types'          // ✅
import type { TeamMember } from '@/types/pokemon'  // ❌ catch-all / per-page files
```

## 3. Constants
`utils/constants.ts` holds only small cross-module primitives. Domain data tables stay
in their own domain file.

```ts
// ✅ utils/constants.ts
export const POKEAPI_BASE_URL = 'https://pokeapi.co/api/v2'
export const TEAM_SIZE = 6
// ❌ Don't put TYPE_COLORS here — a color map is domain data → utils/typeColors.ts
```

## 4. Utils / helpers
Domain-named files (not a `helpers.ts` dump). Keep an accessor beside its data. Utils
auto-import — call them without importing.

```ts
// utils/typeColors.ts — data + its accessor together
export const TYPE_COLORS: Record<string, string> = { fire: '#E62829' /* … */ }
export const typeColor = (t: string) => TYPE_COLORS[t] ?? '#9FA19F'
```
```vue
<span :style="{ background: typeColor(type) }" />  <!-- ✅ no import needed (auto-import) -->
```

## 5. Separation of concerns
Service = data + dedup (plain promises, **no Vue reactivity**). Page/component = UI
reactive state only.

```ts
// ✅ page: thin reactive state; the fetch/dedup lives in the service
const details = reactive<Record<number, PokemonDetail>>({})
const loadDetail = (id: number) => {
  if (details[id]) return
  fetchPokemonDetail(id).then(d => { details[id] = d }) // service handles caching
}
```

## 6. Images → CDN, not raw GitHub
Use the jsDelivr helpers in `utils/pokemonSprites.ts`.

```ts
artworkUrl(6)  // ✅ https://cdn.jsdelivr.net/gh/PokeAPI/sprites@master/…/6.png
// ❌ `https://raw.githubusercontent.com/PokeAPI/sprites/master/…/6.png`  (not for production)
```

## 7. Data-driven algorithms
Encode rules as a **sparse table + a default**, and express queries as small transforms.
Keep one source of truth. See `utils/typeChart.ts`.

```ts
export const ALL_TYPES = ['normal', 'fire', 'water' /* … */] as const  // single source of truth
const TYPE_CHART: Record<string, Record<string, number>> = { fire: { grass: 2, water: 0.5 } } // only the exceptions
const multiplier = TYPE_CHART[attack]?.[defend] ?? 1  // missing entry = ×1
```
Build a small core function, then thin composition layers on top
(`getDefensiveMultipliers` → `getMemberWeaknesses` / `analyzeTeamWeaknesses`).

## 8. UI components & styling
Default to **@nuxt/ui** components (`UCard`, `UButton`, `UTable`, `UInputMenu`, `UModal`, …)
for consistency, accessibility, and theming.

```vue
<UButton color="primary" @click="add">Add</UButton>   <!-- ✅ -->
```
Only hand-roll plain Tailwind when @nuxt/ui genuinely can't express the design — and add a
one-line comment saying why. `/team` is currently hand-rolled to match a design mock; it's
the outlier and should migrate back toward @nuxt/ui over time.

## 9. Code style
- One-line comments; no verbose multi-line comment blocks.
- Prefer declarative `map` / `filter` / `reduce`; keep functions small and focused.
- Wrap client-only libraries in `<ClientOnly>` (e.g. chart.js, vue-draggable-plus).
- Errors: a service throws; the caller catches and degrades gracefully (empty/error state) —
  no unhandled rejections.

---

Planned work: [docs/upgrade-nuxt4-ui4.md](docs/upgrade-nuxt4-ui4.md) ·
[docs/refactor-architecture.md](docs/refactor-architecture.md)
