import type { Stat, APIStat } from './stats'
import type { APIMove } from './moves'

// A Pokémon's basic info, mapped for the detail page
export interface PokemonBasic {
  id: number
  name: string
  types: string[]
  abilities: string[]
  heldItems: string[]
  height: number
  weight: number
  image: string
  stats: Stat[]
}

// Raw PokéAPI /pokemon response — only the fields we map
export interface APIPokemon {
  id: number
  name: string
  types: { type: { name: string } }[]
  abilities: { ability: { name: string } }[]
  held_items: { item: { name: string } }[]
  height: number
  weight: number
  stats: APIStat[]
  moves: APIMove[]
}

// Raw PokéAPI /pokemon-species response — fields for description + evolution
export interface APISpecies {
  evolution_chain: { url: string }
  flavor_text_entries: {
    flavor_text: string
    language: { name: string }
  }[]
}
