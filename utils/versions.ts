import type { Generation, GenerationGroup, Version } from '@/types'

// Curated version data + the grouping the timeline renders.
// `id` is the PokeAPI version id, so fetchVersionInfo(id) enriches any row with
// its live generation / pokédex / regions. Everything else PokeAPI does not
// expose (year, platform, cover art, cover legendary, blurb) is curated here.

export const generations: Generation[] = [
  { num: 1, roman: 'I', region: 'Kanto', system: 'Game Boy' },
  { num: 2, roman: 'II', region: 'Johto', system: 'Game Boy Color' },
  { num: 3, roman: 'III', region: 'Hoenn', system: 'Game Boy Advance' },
  { num: 4, roman: 'IV', region: 'Sinnoh', system: 'Nintendo DS' },
  { num: 5, roman: 'V', region: 'Unova', system: 'Nintendo DS' },
  { num: 6, roman: 'VI', region: 'Kalos', system: 'Nintendo 3DS' },
  { num: 7, roman: 'VII', region: 'Alola', system: '3DS · Switch' },
  { num: 8, roman: 'VIII', region: 'Galar', system: 'Nintendo Switch' },
  { num: 9, roman: 'IX', region: 'Paldea', system: 'Nintendo Switch' },
]

export const versions: Version[] = [
  { id: 1, title: 'Red', image: '/images/versions/red_version.png', year: '1996', genNum: 1, genRoman: 'I', region: 'Kanto', legendary: 'Charizard', color: '#E23B2E', system: 'Game Boy', intro: 'The original journey. 151 Pokémon, one region, a legend begins in Kanto.' },
  { id: 2, title: 'Blue', image: '/images/versions/blue_version.png', year: '1996', genNum: 1, genRoman: 'I', region: 'Kanto', legendary: 'Blastoise', color: '#3E6DB5', system: 'Game Boy', intro: 'Kanto’s counterpart classic — trade to complete the first-ever Pokédex.' },
  { id: 3, title: 'Yellow', image: '/images/versions/yellow_version.png', year: '1998', genNum: 1, genRoman: 'I', region: 'Kanto', legendary: 'Pikachu', color: '#F2C33D', system: 'Game Boy', intro: 'Pikachu walks beside you in this anime-inspired take on the original.' },
  { id: 4, title: 'Gold', image: '/images/versions/gold_version.png', year: '1999', genNum: 2, genRoman: 'II', region: 'Johto / Kanto', legendary: 'Ho-Oh', color: '#C9A227', system: 'Game Boy Color', intro: 'A new region, day-and-night cycles, and 100 fresh Pokémon arrive.' },
  { id: 5, title: 'Silver', image: '/images/versions/silver_version.png', year: '1999', genNum: 2, genRoman: 'II', region: 'Johto / Kanto', legendary: 'Lugia', color: '#9FA7AE', system: 'Game Boy Color', intro: 'Johto’s second pillar — Lugia soars over a world spanning two regions.' },
  { id: 6, title: 'Crystal', image: '/images/versions/crystal_version.png', year: '2000', genNum: 2, genRoman: 'II', region: 'Johto / Kanto', legendary: 'Suicune', color: '#3FB8CE', system: 'Game Boy Color', intro: 'The definitive Gen II release adds animation and the Suicune saga.' },
  { id: 7, title: 'Ruby', image: '/images/versions/ruby_version.jpg', year: '2002', genNum: 3, genRoman: 'III', region: 'Hoenn', legendary: 'Groudon', color: '#C62B33', system: 'Game Boy Advance', intro: 'Hoenn’s land-shaping legend Groudon anchors the Game Boy Advance era.' },
  { id: 8, title: 'Sapphire', image: '/images/versions/sapphire_version.jpg', year: '2002', genNum: 3, genRoman: 'III', region: 'Hoenn', legendary: 'Kyogre', color: '#2C57A6', system: 'Game Boy Advance', intro: 'Kyogre rules the sea in Hoenn’s water-soaked counterpart adventure.' },
  { id: 9, title: 'Emerald', image: '/images/versions/emerald_version.jpg', year: '2004', genNum: 3, genRoman: 'III', region: 'Hoenn', legendary: 'Rayquaza', color: '#2E9E5B', system: 'Game Boy Advance', intro: 'Rayquaza settles the conflict in the complete Hoenn experience.' },
  { id: 10, title: 'FireRed', image: '/images/versions/fire_red_version.jpg', year: '2004', genNum: 3, genRoman: 'III', region: 'Kanto', legendary: 'Charizard', color: '#EF5A2A', system: 'Game Boy Advance', intro: 'Kanto rebuilt for Game Boy Advance — the original quest, remastered.' },
  { id: 11, title: 'LeafGreen', image: '/images/versions/leaf_green_version.jpg', year: '2004', genNum: 3, genRoman: 'III', region: 'Kanto', legendary: 'Venusaur', color: '#57A544', system: 'Game Boy Advance', intro: 'Return to Kanto with Venusaur and the updated National Pokédex.' },
  { id: 12, title: 'Diamond', image: '/images/versions/diamond_version.png', year: '2006', genNum: 4, genRoman: 'IV', region: 'Sinnoh', legendary: 'Dialga', color: '#7E8FC0', system: 'Nintendo DS', intro: 'Sinnoh’s mythos of time begins with the steel dragon Dialga.' },
  { id: 13, title: 'Pearl', image: '/images/versions/pearl_version.png', year: '2006', genNum: 4, genRoman: 'IV', region: 'Sinnoh', legendary: 'Palkia', color: '#D98BA6', system: 'Nintendo DS', intro: 'Palkia bends space over Sinnoh in Diamond’s paired release.' },
  { id: 14, title: 'Platinum', image: '/images/versions/platinum_version.png', year: '2008', genNum: 4, genRoman: 'IV', region: 'Sinnoh', legendary: 'Giratina', color: '#8B9096', system: 'Nintendo DS', intro: 'Giratina and the Distortion World complete the Sinnoh story.' },
  { id: 15, title: 'HeartGold', image: '/images/versions/heart_gold_version.png', year: '2009', genNum: 4, genRoman: 'IV', region: 'Johto / Kanto', legendary: 'Ho-Oh', color: '#C99A2E', system: 'Nintendo DS', intro: 'Johto reborn on DS — your partner Pokémon follows you everywhere.' },
  { id: 16, title: 'SoulSilver', image: '/images/versions/soul_silver_version.png', year: '2009', genNum: 4, genRoman: 'IV', region: 'Johto / Kanto', legendary: 'Lugia', color: '#93A0AB', system: 'Nintendo DS', intro: 'Relive Silver with Lugia, updated for the Nintendo DS generation.' },
  { id: 17, title: 'Black', image: '/images/versions/black_version.png', year: '2010', genNum: 5, genRoman: 'V', region: 'Unova', legendary: 'Reshiram', color: '#26262B', system: 'Nintendo DS', intro: 'A bold new region, Unova, and the truth-seeking dragon Reshiram.' },
  { id: 18, title: 'White', image: '/images/versions/white_version.png', year: '2010', genNum: 5, genRoman: 'V', region: 'Unova', legendary: 'Zekrom', color: '#E6E7EA', system: 'Nintendo DS', intro: 'Zekrom and the ideal — Unova’s story told from the other side.' },
  { id: 21, title: 'Black 2', image: '/images/versions/black_2_version.png', year: '2012', genNum: 5, genRoman: 'V', region: 'Unova', legendary: 'Kyurem', color: '#33333C', system: 'Nintendo DS', intro: 'Two years later, Unova changes. Black Kyurem takes the stage.' },
  { id: 22, title: 'White 2', image: '/images/versions/white_2_version.png', year: '2012', genNum: 5, genRoman: 'V', region: 'Unova', legendary: 'Kyurem', color: '#D3D8E0', system: 'Nintendo DS', intro: 'A new rival, new gyms, and White Kyurem close the Unova arc.' },
  { id: 23, title: 'X', image: '/images/versions/x_version.png', year: '2013', genNum: 6, genRoman: 'VI', region: 'Kalos', legendary: 'Xerneas', color: '#3F63AC', system: 'Nintendo 3DS', intro: 'Kalos goes 3D. Mega Evolution debuts alongside the deer-god Xerneas.' },
  { id: 24, title: 'Y', image: '/images/versions/y_version.png', year: '2013', genNum: 6, genRoman: 'VI', region: 'Kalos', legendary: 'Yveltal', color: '#C63A34', system: 'Nintendo 3DS', intro: 'Yveltal brings destruction to Kalos in the paired 3DS adventure.' },
  { id: 25, title: 'Omega Ruby', image: '/images/versions/omega_ruby_version.png', year: '2014', genNum: 6, genRoman: 'VI', region: 'Hoenn', legendary: 'Groudon', color: '#C62B33', system: 'Nintendo 3DS', intro: 'Hoenn remade in 3D — Primal Groudon reshapes the ancient world.' },
  { id: 26, title: 'Alpha Sapphire', image: '/images/versions/alpha_sapphire_version.png', year: '2014', genNum: 6, genRoman: 'VI', region: 'Hoenn', legendary: 'Kyogre', color: '#2C57A6', system: 'Nintendo 3DS', intro: 'Primal Kyogre returns as Hoenn is reborn for Nintendo 3DS.' },
  { id: 27, title: 'Sun', image: '/images/versions/sun_version.png', year: '2016', genNum: 7, genRoman: 'VII', region: 'Alola', legendary: 'Solgaleo', color: '#F0862A', system: 'Nintendo 3DS', intro: 'Alola’s islands, trials over gyms, and the radiant Solgaleo.' },
  { id: 28, title: 'Moon', image: '/images/versions/moon_version.png', year: '2016', genNum: 7, genRoman: 'VII', region: 'Alola', legendary: 'Lunala', color: '#38498F', system: 'Nintendo 3DS', intro: 'Lunala lights the night as Alola’s story unfolds after dark.' },
  { id: 29, title: 'Ultra Sun', image: '/images/versions/ultra_sun_version.png', year: '2017', genNum: 7, genRoman: 'VII', region: 'Alola', legendary: 'Necrozma', color: '#E85E1C', system: 'Nintendo 3DS', intro: 'An expanded Alola with Necrozma bending light across the region.' },
  { id: 30, title: 'Ultra Moon', image: '/images/versions/ultra_moon_version.png', year: '2017', genNum: 7, genRoman: 'VII', region: 'Alola', legendary: 'Necrozma', color: '#6C3E9C', system: 'Nintendo 3DS', intro: 'The alternate Ultra tale — Dawn Wings Necrozma leads the way.' },
  { id: 31, title: 'Let’s Go Pikachu', image: '/images/versions/lets_go_pikachu_version.png', year: '2018', genNum: 7, genRoman: 'VII', region: 'Kanto', legendary: 'Pikachu', color: '#F2C33D', system: 'Nintendo Switch', intro: 'Kanto returns on Switch — a gentle reintroduction starring Pikachu.' },
  { id: 32, title: 'Let’s Go Eevee', image: '/images/versions/lets_go_eevee_version.png', year: '2018', genNum: 7, genRoman: 'VII', region: 'Kanto', legendary: 'Eevee', color: '#C39A5F', system: 'Nintendo Switch', intro: 'The same nostalgic journey with Eevee as your loyal partner.' },
  { id: 33, title: 'Sword', image: '/images/versions/sword_version.png', year: '2019', genNum: 8, genRoman: 'VIII', region: 'Galar', legendary: 'Zacian', color: '#1C79C0', system: 'Nintendo Switch', intro: 'Galar’s Dynamax stadiums and the noble wolf Zacian debut on Switch.' },
  { id: 34, title: 'Shield', image: '/images/versions/shield_version.png', year: '2019', genNum: 8, genRoman: 'VIII', region: 'Galar', legendary: 'Zamazenta', color: '#C62B33', system: 'Nintendo Switch', intro: 'Zamazenta guards Galar in Sword’s counterpart adventure.' },
  { id: 37, title: 'Brilliant Diamond', image: '/images/versions/brilliant_diamond_version.png', year: '2021', genNum: 8, genRoman: 'VIII', region: 'Sinnoh', legendary: 'Dialga', color: '#7C97D6', system: 'Nintendo Switch', intro: 'Sinnoh faithfully remade — Dialga returns in Brilliant Diamond.' },
  { id: 38, title: 'Shining Pearl', image: '/images/versions/shining_pearl_version.png', year: '2021', genNum: 8, genRoman: 'VIII', region: 'Sinnoh', legendary: 'Palkia', color: '#D98BA6', system: 'Nintendo Switch', intro: 'Palkia anchors this loving remake of the Pearl adventure.' },
  { id: 39, title: 'Legends: Arceus', image: '/images/versions/legends_arceus_version.png', year: '2022', genNum: 8, genRoman: 'VIII', region: 'Hisui', legendary: 'Arceus', color: '#79A88E', system: 'Nintendo Switch', intro: 'Explore ancient Hisui in the series’ boldest open-world shift yet.' },
  { id: 40, title: 'Scarlet', image: '/images/versions/scarlet_version.png', year: '2022', genNum: 9, genRoman: 'IX', region: 'Paldea', legendary: 'Koraidon', color: '#E13A34', system: 'Nintendo Switch', intro: 'Paldea opens up — the past-faring Koraidon roams a seamless world.' },
  { id: 41, title: 'Violet', image: '/images/versions/violet_version.png', year: '2022', genNum: 9, genRoman: 'IX', region: 'Paldea', legendary: 'Miraidon', color: '#7A4C9E', system: 'Nintendo Switch', intro: 'Miraidon and a vision of the future headline the open-world Paldea.' },
]

// Group versions by generation, then by release year — the timeline's structure
export function buildTimeline(): GenerationGroup[] {
  return generations
    .map((gen) => {
      const games = versions.filter(v => v.genNum === gen.num)
      const years = [...new Set(games.map(g => g.year))].sort()
      const first = years[0] ?? ''
      const last = years[years.length - 1] ?? first
      return {
        num: gen.num,
        roman: gen.roman,
        region: gen.region,
        system: gen.system,
        yearRange: first === last ? first : `${first}–${last}`,
        count: games.length,
        yearLanes: years.map(year => ({ year, games: games.filter(g => g.year === year) })),
      }
    })
    .filter(g => g.count > 0)
}
