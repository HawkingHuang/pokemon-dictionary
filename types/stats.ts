// A stat row (mapped) and its raw PokéAPI shape
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
