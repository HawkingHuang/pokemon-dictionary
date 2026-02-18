export const determineParam = (version: string): string => {
  switch (version) {
    case 'Red/Blue/Yellow':
      return 'red-blue'
    case 'Gold/Silver/Crystal':
      return 'gold-silver'
    case 'Ruby/Sapphire/Emerald':
      return 'ruby-sapphire'
    case 'Diamond/Pearl':
      return 'diamond-pearl'
    case 'Platinum':
      return 'platinum'
    case 'HeartGold/SoulSilver':
      return 'heartgold-soulsilver'
    case 'Black/White':
      return 'black-white'
    case 'Black 2/White 2':
      return 'black-2-white-2'
    case 'X/Y (Central)':
    case 'X/Y (Coastal)':
    case 'X/Y (Mountain)':
      return 'x-y'
    case 'Omega Ruby/Alpha Sapphire':
      return 'omega-ruby-alpha-sapphire'
    case 'Sun/Moon (Alola)':
    case 'Sun/Moon (Melemele)':
    case 'Sun/Moon (Akala)':
    case 'Sun/Moon (Ula\'ula)':
    case 'Sun/Moon (Poni)':
      return 'sun-moon'
    case 'Ultra Sun/Ultra Moon (Alola)':
    case 'Ultra Sun/Ultra Moon (Melemele)':
    case 'Ultra Sun/Ultra Moon (Akala)':
    case 'Ultra Sun/Ultra Moon (Ula\'ula)':
    case 'Ultra Sun/Ultra Moon (Poni)':
      return 'ultra-sun-ultra-moon'
    case 'Let\'s Go: Pikachu/Let\'s Go: Eevee/':
      return 'lets-go-pikachu-lets-go-eevee'
    case 'Sword/Shield (Galar)':
    case 'Sword/Shield (Isle of Armor)':
    case 'Sword/Shield (Crown Tundra)':
      return 'sword-shield'
    case 'Legends Arceus':
      return 'red-blue'
    case 'Scarlet/Violet':
      return 'scarlet-violet'
    default:
      return ''
  }
}