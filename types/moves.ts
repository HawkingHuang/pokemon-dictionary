// A move row (mapped) and the raw PokéAPI shapes it comes from
export interface Move {
  name: string
  level: number
  type: string
  power: number | null
  accuracy: number | null
  pp: number
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

export interface APIMoveDetail {
  type: { name: string }
  power: number | null
  accuracy: number | null
  pp: number
}
