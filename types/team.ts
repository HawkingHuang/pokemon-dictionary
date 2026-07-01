export interface TeamMember {
  uid: number
  id: number
  name: string
  types: string[]
  baseStats: number
  ability: string
  image: string
}

export interface WeaknessWarning {
  type: string
  tier: 'danger' | 'caution'
  weakMembers: { name: string; image: string }[]
  weakCount: number
  resistCount: number
}

// Pokémon list entry (name + national dex id)
export interface PokemonIndexEntry {
  name: string
  id: number
}

// A Pokémon's display-ready detail — a team member minus the team-only uid
export type PokemonDetail = Omit<TeamMember, 'uid'>
