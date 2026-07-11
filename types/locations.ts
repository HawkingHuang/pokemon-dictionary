// An encounter location (mapped) and its raw PokéAPI shape
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
