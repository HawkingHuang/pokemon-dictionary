import { capitalizeLocation, capitalizeLocationVersion, capitalizeVersion } from '@/utils/capitalize'
import type { APIEncounterLocation, APIEvolutionChain, APIEvolutionChainNode, APIMove, APIMoveDetail, APIStat, APISpeciesEvolutionChain, EvolutionStage, Location, Move, Stat } from '@/types/pokemon'

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

function formatTrigger(details: APIEvolutionChainNode['evolution_details']): string {
  if (!details.length) return ''
  const d = details[0]
  if (d.min_level) return `Lv.${d.min_level}`
  if (d.item) return `Use ${capitalizeVersion(d.item.name)}`
  if (d.trigger.name === 'trade') return 'Trade'
  return capitalizeVersion(d.trigger.name)
}

function extractIdFromUrl(url: string): number {
  const parts = url.split('/').filter(Boolean)
  return parseInt(parts[parts.length - 1], 10)
}

function flattenChain(node: APIEvolutionChainNode, stage: number, result: EvolutionStage[]): void {
  result.push({
    name: node.species.name,
    id: extractIdFromUrl(node.species.url),
    stage,
    trigger: formatTrigger(node.evolution_details)
  })
  for (const child of node.evolves_to) {
    flattenChain(child, stage + 1, result)
  }
}

export async function getEvolutionChain(pokemonName: string): Promise<EvolutionStage[]> {
  const species = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${pokemonName}`)
    .then(r => r.json() as Promise<APISpeciesEvolutionChain>)
  const chain = await fetch(species.evolution_chain.url)
    .then(r => r.json() as Promise<APIEvolutionChain>)
  const result: EvolutionStage[] = []
  flattenChain(chain.chain, 0, result)
  return result
}