import { POKEAPI_BASE_URL } from '@/utils/constants'
import { artworkUrl } from '@/utils/pokemonSprites'
import { capitalizeLocation, capitalizeLocationVersion, capitalizeVersion } from '@/utils/capitalize'
import type {
  PokemonIndexEntry, PokemonDetail, PokemonBasic, APIPokemon, APISpecies,
  Stat, APIStat, Move, APIMoveDetail, Location, APIEncounterLocation,
  EvolutionStage, APIEvolutionChain, APIEvolutionChainNode,
} from '@/types'

// PokéAPI calls via Nuxt's $fetch; transport centralized here

// Full name+id list, fetched once and memoized app-wide (retryable on failure)
let indexPromise: Promise<PokemonIndexEntry[]> | null = null
export function fetchPokemonIndex(): Promise<PokemonIndexEntry[]> {
  if (!indexPromise) {
    indexPromise = $fetch<{ results: { name: string; url: string }[] }>(`${POKEAPI_BASE_URL}/pokemon`, {
      query: { limit: 1025 },
    })
      .then(res => res.results.map(p => ({
        name: p.name,
        id: Number(p.url.split('/').filter(Boolean).pop()),
      })))
      .catch((err) => { indexPromise = null; throw err })
  }
  return indexPromise
}

// One Pokémon's slim detail (team roster), fetched once per id and memoized (retryable)
const detailCache = new Map<number | string, Promise<PokemonDetail>>()
export function fetchPokemonDetail(idOrName: number | string): Promise<PokemonDetail> {
  let cached = detailCache.get(idOrName)
  if (!cached) {
    cached = $fetch<any>(`${POKEAPI_BASE_URL}/pokemon/${idOrName}`)
      .then(res => ({
        id: res.id,
        name: res.name,
        types: res.types.map((t: any) => t.type.name),
        baseStats: res.stats.reduce((acc: number, s: any) => acc + s.base_stat, 0),
        ability: res.abilities?.[0]?.ability?.name ?? '',
        image: artworkUrl(res.id),
      }))
      .catch((err) => { detailCache.delete(idOrName); throw err })
    detailCache.set(idOrName, cached)
  }
  return cached
}

// Shared raw responses, memoized so /pokemon and /pokemon-species are each fetched once per Pokémon
const pokemonCache = new Map<number | string, Promise<APIPokemon>>()
function rawPokemon(idOrName: number | string): Promise<APIPokemon> {
  let p = pokemonCache.get(idOrName)
  if (!p) {
    p = $fetch<APIPokemon>(`${POKEAPI_BASE_URL}/pokemon/${idOrName}`)
      .catch((err) => { pokemonCache.delete(idOrName); throw err })
    pokemonCache.set(idOrName, p)
  }
  return p
}

const speciesCache = new Map<number | string, Promise<APISpecies>>()
function rawSpecies(idOrName: number | string): Promise<APISpecies> {
  let p = speciesCache.get(idOrName)
  if (!p) {
    p = $fetch<APISpecies>(`${POKEAPI_BASE_URL}/pokemon-species/${idOrName}`)
      .catch((err) => { speciesCache.delete(idOrName); throw err })
    speciesCache.set(idOrName, p)
  }
  return p
}

function mapStats(stats: APIStat[]): Stat[] {
  const mapped = stats.map(s => ({ stat: capitalizeVersion(s.stat.name), base: s.base_stat }))
  mapped.push({ stat: 'Total', base: mapped.reduce((acc, s) => acc + s.base, 0) })
  return mapped
}

// Basic info + stats for the detail page
export async function fetchPokemonBasic(idOrName: number | string): Promise<PokemonBasic> {
  const res = await rawPokemon(idOrName)
  return {
    id: res.id,
    name: res.name,
    types: res.types.map(t => t.type.name),
    abilities: res.abilities.map(a => a.ability.name),
    heldItems: res.held_items.map(h => h.item.name),
    height: res.height,
    weight: res.weight,
    image: artworkUrl(res.id),
    stats: mapStats(res.stats),
  }
}

// Level-up moves for a version group. The bulk per-move detail fetch tolerates
// individual failures — a move whose detail fails is dropped, not the whole list.
export async function fetchPokemonMoves(idOrName: number | string, version: string): Promise<Move[]> {
  const res = await rawPokemon(idOrName)
  const filtered = res.moves
    .map((move) => {
      const detail = move.version_group_details.find(
        d => d.version_group.name === version && d.move_learn_method.name === 'level-up',
      )
      return detail
        ? { name: capitalizeVersion(move.move.name), level: detail.level_learned_at, url: move.move.url }
        : null
    })
    .filter((m): m is { name: string; level: number; url: string } => m !== null)
    .sort((a, b) => a.level - b.level)

  const settled = await Promise.allSettled(filtered.map(m => $fetch<APIMoveDetail>(m.url)))
  return filtered.flatMap((m, i) => {
    const r = settled[i]
    if (!r || r.status !== 'fulfilled') return []
    return [{ name: m.name, level: m.level, type: r.value.type.name, power: r.value.power, accuracy: r.value.accuracy, pp: r.value.pp }]
  })
}

// Encounter locations for a Pokémon
export async function fetchPokemonLocations(idOrName: number | string): Promise<Location[]> {
  const res = await $fetch<APIEncounterLocation[]>(`${POKEAPI_BASE_URL}/pokemon/${idOrName}/encounters`)
  return res.map(loc => ({
    version: capitalizeLocationVersion(loc.version_details.map(v => v.version.name)),
    location: capitalizeLocation(loc.location_area.name),
  }))
}

// Flattened evolution chain
function formatTrigger(details: APIEvolutionChainNode['evolution_details']): string {
  const d = details[0]
  if (!d) return ''
  if (d.min_level) return `Lv.${d.min_level}`
  if (d.item) return `Use ${capitalizeVersion(d.item.name)}`
  if (d.trigger.name === 'trade') return 'Trade'
  return capitalizeVersion(d.trigger.name)
}
function idFromUrl(url: string): number {
  return Number(url.split('/').filter(Boolean).pop())
}
function flattenChain(node: APIEvolutionChainNode, stage: number, out: EvolutionStage[]): void {
  out.push({ name: node.species.name, id: idFromUrl(node.species.url), stage, trigger: formatTrigger(node.evolution_details) })
  for (const child of node.evolves_to) flattenChain(child, stage + 1, out)
}
export async function fetchEvolutionChain(idOrName: number | string): Promise<EvolutionStage[]> {
  const species = await rawSpecies(idOrName)
  const chain = await $fetch<APIEvolutionChain>(species.evolution_chain.url)
  const out: EvolutionStage[] = []
  flattenChain(chain.chain, 0, out)
  return out
}

// English flavor-text description
export async function fetchPokemonDescription(idOrName: number | string): Promise<string> {
  const species = await rawSpecies(idOrName)
  const entry = species.flavor_text_entries.filter(e => e.language.name === 'en').at(-1)
  return entry?.flavor_text.replace(/\f/g, ' ') ?? ''
}
