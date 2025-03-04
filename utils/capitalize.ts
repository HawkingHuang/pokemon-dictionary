export const capitalizeVersion = (str: string): string => {
  if(str.includes('hp')) return str.toUpperCase()
    
  if(str.includes('-')) {
    const firstPartStr = str.split('-')[0].charAt(0).toUpperCase() + str.split('-')[0].slice(1)
    const secondPartStr = str.split('-')[1].charAt(0).toUpperCase() + str.split('-')[1].slice(1)
    return `${firstPartStr} ${secondPartStr}`
  }
  return str.charAt(0).toUpperCase() + str.slice(1)
}

export const capitalizeGeneration = (str: string): string => {
  const firstPartStr = str.split('-')[0].charAt(0).toUpperCase() + str.split('-')[0].slice(1)
  const secondPartStr = str.split('-')[1].toUpperCase()
  return `${firstPartStr} ${secondPartStr}`
}

interface Pokedex {
  name: string
  url: string
}
export const capitalizePokedexes = (pokedexes: Pokedex[]): string => {
  const pokedexesList = pokedexes.map(pokedex => pokedex.name.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '))

  return pokedexesList.join('/')
}

interface Region {
  name: string
  url: string
}
export const capitalizeRegions = (regions: Region[]): string => {
  const regionList = regions.map(region => region.name.charAt(0).toUpperCase() + region.name.slice(1))
  return regionList.join('/')
}

export const capitalizeName = (name: string): string => {
  return name.charAt(0).toUpperCase() + name.slice(1)
}