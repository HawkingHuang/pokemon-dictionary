// One Pokédex list entry — sprite, name, national-dex id
export interface PokedexEntry {
  id: number
  name: string
  image: string
}

// Raw /pokedex/{id}
export interface APIPokedex {
  pokemon_entries: { pokemon_species: { name: string } }[]
}

// Raw /pokemon-species/{name} — only the id is needed to build the list sprite
export interface APIPokedexSpecies {
  id: number
}
