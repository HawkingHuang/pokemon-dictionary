// Version-detail model shown in the version modal
export interface VersionInfo {
  version: string
  generation: string
  pokedexes: string
  regions: string
}

// Carousel item: a game version's cover image
export interface Version {
  id: number
  image: string
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
