export interface PokedexTextPart {
  text: string
  colorClass?: string
}

export interface PokedexVersionItem {
  id: number
  version: string
  textParts: PokedexTextPart[]
}

export const pokedexVersions: PokedexVersionItem[] = [
  {
    id: 2,
    version: 'Red/Blue/Yellow',
    textParts: [
      { text: 'Red', colorClass: 'text-red-500' },
      { text: 'Blue', colorClass: 'text-blue-500' },
      { text: 'Yellow', colorClass: 'text-yellow-500' }
    ]
  },
  {
    id: 3,
    version: 'Gold/Silver/Crystal',
    textParts: [
      { text: 'Gold', colorClass: 'text-yellow-300' },
      { text: 'Silver', colorClass: 'text-gray-300' },
      { text: 'Crystal', colorClass: 'text-purple-500' }
    ]
  },
  {
    id: 4,
    version: 'Ruby/Sapphire/Emerald',
    textParts: [
      { text: 'Ruby', colorClass: 'text-red-500' },
      { text: 'Sapphire', colorClass: 'text-blue-700' },
      { text: 'Emerald', colorClass: 'text-emerald-500' }
    ]
  },
  {
    id: 5,
    version: 'Diamond/Pearl',
    textParts: [
      { text: 'Diamond', colorClass: 'text-stone-400' },
      { text: 'Pearl', colorClass: 'text-fuchsia-400' }
    ]
  },
  {
    id: 6,
    version: 'Platinum',
    textParts: [
      { text: 'Platinum', colorClass: 'text-neutral-500' }
    ]
  },
  {
    id: 7,
    version: 'HeartGold/SoulSilver',
    textParts: [
      { text: 'HeartGold', colorClass: 'text-yellow-300' },
      { text: 'SoulSilver', colorClass: 'text-gray-300' }
    ]
  },
  {
    id: 8,
    version: 'Black/White',
    textParts: [
      { text: 'Black', colorClass: 'text-black' },
      { text: 'White', colorClass: 'text-gray-200' }
    ]
  },
  {
    id: 9,
    version: 'Black 2/White 2',
    textParts: [
      { text: 'Black 2', colorClass: 'text-black' },
      { text: 'White 2', colorClass: 'text-gray-200' }
    ]
  },
  {
    id: 12,
    version: 'X/Y (Central)',
    textParts: [
      { text: 'X', colorClass: 'text-slate-600' },
      { text: 'Y', colorClass: 'text-red-700' },
      { text: '(Central)' }
    ]
  },
  {
    id: 13,
    version: 'X/Y (Coastal)',
    textParts: [
      { text: 'X', colorClass: 'text-slate-600' },
      { text: 'Y', colorClass: 'text-red-700' },
      { text: '(Coastal)' }
    ]
  },
  {
    id: 14,
    version: 'X/Y (Mountain)',
    textParts: [
      { text: 'X', colorClass: 'text-slate-600' },
      { text: 'Y', colorClass: 'text-red-700' },
      { text: '(Mountain)' }
    ]
  },
  {
    id: 15,
    version: 'Omega Ruby/Alpha Sapphire',
    textParts: [
      { text: 'Omega Ruby', colorClass: 'text-red-500' },
      { text: 'Alpha Sapphire', colorClass: 'text-blue-700' }
    ]
  },
  {
    id: 16,
    version: 'Sun/Moon (Alola)',
    textParts: [
      { text: 'Sun', colorClass: 'text-orange-500' },
      { text: 'Moon', colorClass: 'text-gray-300' },
      { text: '(Alola)' }
    ]
  },
  {
    id: 17,
    version: 'Sun/Moon (Melemele)',
    textParts: [
      { text: 'Sun', colorClass: 'text-orange-500' },
      { text: 'Moon', colorClass: 'text-gray-300' },
      { text: '(Melemele)' }
    ]
  },
  {
    id: 18,
    version: 'Sun/Moon (Akala)',
    textParts: [
      { text: 'Sun', colorClass: 'text-orange-500' },
      { text: 'Moon', colorClass: 'text-gray-300' },
      { text: '(Akala)' }
    ]
  },
  {
    id: 19,
    version: 'Sun/Moon (Ula\'ula)',
    textParts: [
      { text: 'Sun', colorClass: 'text-orange-500' },
      { text: 'Moon', colorClass: 'text-gray-300' },
      { text: '(Ula\'ula)' }
    ]
  },
  {
    id: 20,
    version: 'Sun/Moon (Poni)',
    textParts: [
      { text: 'Sun', colorClass: 'text-orange-500' },
      { text: 'Moon', colorClass: 'text-gray-300' },
      { text: '(Poni)' }
    ]
  },
  {
    id: 21,
    version: 'Ultra Sun/Ultra Moon (Alola)',
    textParts: [
      { text: 'Ultra Sun', colorClass: 'text-orange-500' },
      { text: 'Ultra Moon', colorClass: 'text-gray-300' },
      { text: '(Alola)' }
    ]
  },
  {
    id: 22,
    version: 'Ultra Sun/Ultra Moon (Melemele)',
    textParts: [
      { text: 'Ultra Sun', colorClass: 'text-orange-500' },
      { text: 'Ultra Moon', colorClass: 'text-gray-300' },
      { text: '(Melemele)' }
    ]
  },
  {
    id: 23,
    version: 'Ultra Sun/Ultra Moon (Akala)',
    textParts: [
      { text: 'Ultra Sun', colorClass: 'text-orange-500' },
      { text: 'Ultra Moon', colorClass: 'text-gray-300' },
      { text: '(Akala)' }
    ]
  },
  {
    id: 24,
    version: 'Ultra Sun/Ultra Moon (Ula\'ula)',
    textParts: [
      { text: 'Ultra Sun', colorClass: 'text-orange-500' },
      { text: 'Ultra Moon', colorClass: 'text-gray-300' },
      { text: '(Ula\'ula)' }
    ]
  },
  {
    id: 25,
    version: 'Ultra Sun/Ultra Moon (Poni)',
    textParts: [
      { text: 'Ultra Sun', colorClass: 'text-orange-500' },
      { text: 'Ultra Moon', colorClass: 'text-gray-300' },
      { text: '(Poni)' }
    ]
  },
  {
    id: 26,
    version: 'Let\'s Go: Pikachu/Let\'s Go: Eevee/',
    textParts: [
      { text: 'Let\'s Go: Pikachu', colorClass: 'text-yellow-500' },
      { text: 'Let\'s Go: Eevee', colorClass: 'text-amber-800' }
    ]
  },
  {
    id: 27,
    version: 'Sword/Shield (Galar)',
    textParts: [
      { text: 'Sword', colorClass: 'text-blue-400' },
      { text: 'Shield', colorClass: 'text-pink-400' },
      { text: '(Galar)' }
    ]
  },
  {
    id: 28,
    version: 'Sword/Shield (Isle of Armor)',
    textParts: [
      { text: 'Sword', colorClass: 'text-blue-400' },
      { text: 'Shield', colorClass: 'text-pink-400' },
      { text: '(Isle of Armor)' }
    ]
  },
  {
    id: 29,
    version: 'Sword/Shield (Crown Tundra)',
    textParts: [
      { text: 'Sword', colorClass: 'text-blue-400' },
      { text: 'Shield', colorClass: 'text-pink-400' },
      { text: '(Crown Tundra)' }
    ]
  },
  {
    id: 30,
    version: 'Legends Arceus',
    textParts: [
      { text: 'Legends Arceus', colorClass: 'text-cyan-500' }
    ]
  },
  {
    id: 31,
    version: 'Scarlet/Violet',
    textParts: [
      { text: 'Scarlet', colorClass: 'text-orange-400' },
      { text: 'Violet', colorClass: 'text-purple-400' }
    ]
  }
]