// Version-detail model shown in the reading panel (live from PokeAPI)
export interface VersionInfo {
  version: string
  generation: string
  pokedexes: string
  regions: string
}

// A game version on the timeline. Curated locally — PokeAPI has no year,
// platform, cover art, cover legendary or blurb for a version.
export interface Version {
  id: number // PokeAPI version id — the key fetchVersionInfo() takes
  title: string
  image: string
  year: string
  genNum: number
  genRoman: string
  region: string
  legendary: string
  color: string // representative hex, used for the cover accent strip
  system: string
  intro: string
}

// A generation's header row on the timeline
export interface Generation {
  num: number
  roman: string
  region: string
  system: string
}

// Versions of one generation released in the same year
export interface YearLane {
  year: string
  games: Version[]
}

// One generation block on the timeline, its versions split into year lanes
export interface GenerationGroup {
  num: number
  roman: string
  region: string
  system: string
  yearRange: string
  count: number
  yearLanes: YearLane[]
}

// Raw /version/{id}
export interface APIVersion {
  name: string
  version_group: { url: string }
}

// Raw /version-group (fetched from version.version_group.url)
export interface APIVersionGroup {
  generation: { name: string }
  pokedexes: { name: string; url: string }[]
  regions: { name: string; url: string }[]
}
