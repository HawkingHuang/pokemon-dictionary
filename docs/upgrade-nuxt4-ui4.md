# Upgrade Plan — Nuxt 4 + Tailwind 4 + @nuxt/ui v4

> Status: **planned, not started.** Do on a dedicated branch (`chore/upgrade-nuxt4-ui4`).
> Conventions to follow: [CLAUDE.md](../CLAUDE.md). Related: [refactor-architecture.md](./refactor-architecture.md).

## Why
Current stack: Nuxt 3.15, @nuxt/ui **v2.21**, Tailwind 3. We want @nuxt/ui **v4**
(Nuxt UI + Pro unified into one free library, 125+ components — incl. former Pro
ones like `UTimeline`).

Constraint chain (per official docs): **@nuxt/ui v4 requires Nuxt 4**, and from v2
the code must absorb the **v2→v3 rewrite** (Reka UI + Tailwind v4 + new theming).
So this is a **stacked triple-major upgrade**: Nuxt 3→4, Tailwind 3→4, @nuxt/ui 2→4.

## Sequencing (do not reorder)
1. **This upgrade** — foundation first (framework + CSS engine + component library).
2. **Architecture refactor** — see [refactor-architecture.md](./refactor-architecture.md).
3. **Style consistency** — converge modules (bring `/team` back to @nuxt/ui) on the new stack.

Rationale: the upgrade replaces the foundation, so refactoring/restyling beforehand
gets redone — styling especially must wait for Tailwind 4. Keep the upgrade separate
from the refactor so each step is independently reviewable/revertible.

## Prereqs
- Branch `chore/upgrade-nuxt4-ui4`; confirm Node satisfies Nuxt 4 / Tailwind 4 minimums.
- Baseline app runs. Routes to verify each stage: `/`, `/version`, `/pokedex`,
  `/pokedex/[name]`, `/pokemon`, `/team`. Commit per stage.

## Stage 1 — Nuxt 3 → 4
- Run codemod: `npx codemod@latest nuxt/4/migration-recipe`.
- Keep current directory layout (Nuxt 4 is backwards-compatible; don't move to `app/`).
- Low impact from data-fetching default changes — app uses `$.ajax`/`$fetch`, not
  `useAsyncData`/`useFetch`; `useState` is fine. Verify anyway.
- **Verify:** dev server boots; every route renders.

## Stage 2 — Tailwind 3 → 4
- Run `npx @tailwindcss/upgrade`; switch to CSS-first config (`@import "tailwindcss"`
  in `assets/css/main.css`).
- Port custom breakpoints (`xxl/xl/lg/md/sm`) from `tailwind.config.js` into `@theme` CSS.
- **Verify:** styling intact — especially `/team` arbitrary values (`bg-[#eef1f6]`,
  `grid-cols-[360px_1fr]`) and custom breakpoints.

## Stage 3 — @nuxt/ui 2 → 4 (install v4, apply v3 API changes)
Install `@nuxt/ui@4` (needs Stages 1–2). Migrate per file, verify each page:

| File | Change |
|---|---|
| `components/navbar.vue` | `UHorizontalNavigation` → **`UNavigationMenu`** (`links`→`items`, add `orientation`, `click`→`onClick`) |
| `components/PokemonDetailCard.vue` (**heaviest**) | `UTable` `rows`→`data`, columns `label/key`→`header/accessorKey`, slot `#type-data`→`#type-cell` (+ power/accuracy), keep `loading` |
| `pages/pokemon/index.vue` | `UInputMenu` (`options`→`items`, model change); `UModal` (`v-model`→`v-model:open`, content→`#content`); `UButton` `color="yellow"`→`warning` |
| `pages/version/index.vue` | `UCarousel` (`indicators`→`dots`); `UModal`; `UButton` `color="gray"`→`neutral` |
| `pages/pokedex/index.vue` | `USlideover` (`v-model:open`, `#content`); `UButton` `color="gray"`→`neutral`; `UCard` |
| `components/PokemonBasicCard.vue` | `UButton`/`UIcon` re-verify |
| `pages/team/*`, `components/TeamMemberCard.vue` | no @nuxt/ui components → re-verify only |

Global: `UButton` color remap (gray→neutral, yellow→warning); redo `:ui` overrides +
theme config (app.config) for v4; confirm `@nuxt/icon` collections.

## Stage 4 — Verify & cleanup
- Full manual pass on every route: nav, tables, modals, slideover, carousel, images, `/team`.
- `npm run build` succeeds; console clean.

## Verification
- Per stage: dev server + affected routes render, no console errors.
- Final: `npm run build` passes; all routes work; `package.json` shows Nuxt 4, Tailwind 4, @nuxt/ui 4.

## Risks / notes
- Triple major — stage-by-stage, commit per stage, verify before advancing.
- Lib sanity on Nuxt 4: chart.js (fine), vue-draggable-plus (fine), jQuery plugin
  (works; removed in the architecture refactor).
- @nuxt/ui v4 theming differs from v2 — expect to redo `:ui` overrides / color config.
