export interface Stat {
  stat: string
  base: number
}

export interface APIStat {
  base_stat: number
  effort: number
  stat: {
    name: string
    url: string
  }
}

export interface APIMove {
  move: {
    name: string
    url: string
  }
  version_group_details: APIMoveVersionDetail[]
}

export interface APIMoveVersionDetail {
  level_learned_at: number
  move_learn_method: {
    name: string
    url: string
  }
  version_group: {
    name: string
    url: string
  }
}

export interface Move {
  name: string
  level: number
  type: string
  power: number | null
  accuracy: number | null
  pp: number
}

export interface APIMoveDetail {
  type: { name: string }
  power: number | null
  accuracy: number | null
  pp: number
}

export interface Location {
  location: string
  version: string
}

export interface APIEncounterLocation {
  location_area: {
    name: string
    url: string
  }
  version_details: APIEncounterVersionDetail[]
}

export interface APIEncounterVersionDetail {
  version: {
    name: string
  }
}

export interface APIEvolutionDetail {
  min_level: number | null
  trigger: { name: string }
  item: { name: string } | null
}

export interface APIEvolutionChainNode {
  species: { name: string; url: string }
  evolution_details: APIEvolutionDetail[]
  evolves_to: APIEvolutionChainNode[]
}

export interface APIEvolutionChain {
  chain: APIEvolutionChainNode
}

export interface APISpeciesEvolutionChain {
  evolution_chain: { url: string }
}

export interface EvolutionStage {
  name: string
  id: number
  stage: number
  trigger: string
}
