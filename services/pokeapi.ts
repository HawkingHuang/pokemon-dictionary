import { POKEAPI_BASE_URL } from '@/utils/constants'
import { artworkUrl } from '@/utils/pokemonSprites'
import type { PokemonIndexEntry, PokemonDetail } from '@/types'

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

// One Pokémon's detail, fetched once per id and memoized (retryable on failure)
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
