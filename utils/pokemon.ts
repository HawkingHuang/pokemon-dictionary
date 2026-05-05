import { capitalizeLocation, capitalizeLocationVersion, capitalizeVersion } from '@/utils/capitalize'
import type { APIEncounterLocation, APIMove, APIMoveDetail, APIStat, Location, Move, Stat } from '@/types/pokemon'

export function getStats(stats: APIStat[]): Stat[] {
  const formattedStats = stats.map((stat) => {
    return { stat: capitalizeVersion(stat.stat.name), base: stat.base_stat }
  })

  formattedStats.push({
    stat: 'Total',
    base: formattedStats.reduce((acc: number, cur: Stat) => {
      return acc + cur.base
    }, 0)
  })

  return formattedStats
}

export async function getMoves(moves: APIMove[], currentVersion: string): Promise<Move[]> {
  const filtered = moves
    .map((move) => {
      const versionDetail = move.version_group_details.find(
        detail =>
          detail.version_group.name === currentVersion &&
          detail.move_learn_method.name === 'level-up'
      )

      if (!versionDetail) return null

      return {
        name: capitalizeVersion(move.move.name),
        level: versionDetail.level_learned_at,
        url: move.move.url
      }
    })
    .filter((move): move is { name: string; level: number; url: string } => move !== null)
    .sort((a, b) => (a.level ?? 0) - (b.level ?? 0))

  const details = await Promise.all(
    filtered.map(move =>
      fetch(move.url).then(res => res.json() as Promise<APIMoveDetail>)
    )
  )

  return filtered.map((move, i) => ({
    name: move.name,
    level: move.level,
    type: details[i].type.name,
    power: details[i].power,
    accuracy: details[i].accuracy,
    pp: details[i].pp
  }))
}

export function getLocations(pokemonId: number): Promise<Location[]> {
  return new Promise((resolve, reject) => {
    $.ajax({
      url: `https://pokeapi.co/api/v2/pokemon/${pokemonId}/encounters`,
      type: 'GET',
      dataType: 'json',
      success: (response: APIEncounterLocation[]) => {
        const locations = response.map((location) => {
          const versions = location.version_details.map((version) => {
            return version.version.name
          })

          return {
            version: capitalizeLocationVersion(versions),
            location: capitalizeLocation(location.location_area.name)
          }
        })

        resolve(locations)
      },
      error: (error) => {
        if (error instanceof Error) console.error(error.message, error.stack)
        else console.error(error)
        reject(error)
      }
    })
  })
}