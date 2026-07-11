// A flattened evolution stage (mapped) and the raw PokéAPI chain shapes
export interface EvolutionStage {
  name: string
  id: number
  stage: number
  trigger: string
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
