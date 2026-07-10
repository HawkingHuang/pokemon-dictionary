# Upgrade Change Log — Nuxt 4 + Tailwind 4 + @nuxt/ui v4

> File-level record of the changes actually made for the upgrade.
> Branch `chore/upgrade-nuxt4-ui4`, based on `242d5d8`. Companion to the plan
> [upgrade-nuxt4-ui4.md](./upgrade-nuxt4-ui4.md).
> **Status:** applied, verified in dev, and committed as `2bf1196`.

## 1. Dependencies & build config

| File | Change |
|---|---|
| `package.json` | `nuxt` `^3.15.4` → `^4.4.5`; `@nuxt/ui` `^2.21.0` → `^4.9.0` |
| `package-lock.json` | Regenerated — **added** `tailwindcss@4`, `@tailwindcss/vite`, `reka-ui`; **removed** `@nuxtjs/tailwindcss` + Headless UI / Popper (v2 internals, previously bundled by `@nuxt/ui` v2) |
| `tailwind.config.js` | **Deleted** — Tailwind 4 is CSS-first; content is auto-detected and breakpoints move to CSS `@theme` |
| `assets/css/main.css` | Added `@import "tailwindcss";` + `@import "@nuxt/ui";`; ported custom breakpoints (`sm/md/lg/xl/xxl`) into a `@theme` block; existing `.custom-scroll` styles unchanged |

## 2. Component API migrations (@nuxt/ui v2 → v4)

| File | Component | Change (old → new) |
|---|---|---|
| `components/navbar.vue` | Navigation | `UHorizontalNavigation :links` → `UNavigationMenu :items` + `orientation="horizontal"` |
| `components/PokemonDetailCard.vue` | `UTable` (moves) | `:rows` → `:data`; columns `{ key, label }` → `{ accessorKey, header }`; slots `#type-data` / `#power-data` / `#accuracy-data` → `#type-cell` / `#power-cell` / `#accuracy-cell`; cell access `row.x` → `row.original.x` |
| `components/PokemonDetailCard.vue` | `UTable` (locations) | `:rows` → `:data` |
| `pages/version/index.vue` | `UCarousel` (script) | Auto-advance rewritten off the removed ref API `.page` / `.pages` / `.select(0)` / `.next()` → `emblaApi.canScrollNext()` / `scrollNext()` / `scrollTo(0)` |
| `pages/version/index.vue` | `UCarousel` (template) | Added `:ui="{ item: 'basis-auto' }"` — restores the multi-cover row (v4 default `basis-full` renders one full-width slide per view) — *post-review fix* |
| `pages/version/index.vue` | `UButton` | `color="gray"` → `color="neutral" variant="subtle"` |
| `pages/version/index.vue` | `UModal` | `v-model` → `v-model:open`; added `title`; content moved into `#body` slot; `:ui` key `background` → `content` (keeps gradient) |
| `pages/pokemon/index.vue` | `UInputMenu` ×2 | `:options` → `:items`; `v-model:query` → `v-model:search-term`; added `:ignore-filter="true"` (custom filtering is done in-page) |
| `pages/pokemon/index.vue` | `UButton` (Compare) | `color="yellow"` → `color="warning"` |
| `pages/pokemon/index.vue` | `UModal` (compare) | `v-model` → `v-model:open`; added `title`; content moved into `#body`; `:ui` key `width` → `content` |
| `pages/pokedex/index.vue` | `UButton` (sprite wrapper) | `color="gray"` → `color="neutral" variant="subtle"` |
| `pages/pokedex/index.vue` | `USlideover` | `v-model` → `v-model:open`; switched to native `title` + `#body`; **removed the inner `UCard`** (a v2 idiom) and its now-invalid `:ui` (`ring` / `divide`) |
| `pages/pokedex/index.vue` | `UButton` (version list) | `color="white"` → `color="neutral" variant="outline"` |

## 3. Deliberately NOT changed (deferred to later phases)

- Architecture & data fetching — `$.ajax`, bare `fetch`, the `$fetch` services, `@/types/pokemon` imports, `raw.githubusercontent` image URLs, and the jQuery plugin are all untouched (that is the separate architecture-refactor phase, see [refactor-architecture.md](./refactor-architecture.md)).
- `/team` and `TeamMemberCard.vue` — use no @nuxt/ui components, so no API changes; only re-verified under the new stack.

## 4. Verification

- Every route renders on the new stack; production `npm run build` passes.
- Interactive checks: navbar, `/version` modal, `/pokemon` search (`UInputMenu`) + compare chart, `/pokedex` slideover + 151-card jQuery grid, `/pokedex/[name]` moves `UTable` with colored type badges.
- **Carousel layout** regression caught in review → fixed via `basis-auto` (confirmed in review).
