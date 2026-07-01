import type { TeamMember, WeaknessWarning } from '@/types'

// The 18 standard battle types (excludes `stellar`, a Terastal-only mechanic that
// does not participate in defensive type matchups). Keys match PokéAPI's lowercase
// type names and the keys in TYPE_COLORS.
export const ALL_TYPES = [
  'normal', 'fire', 'water', 'electric', 'grass', 'ice', 'fighting', 'poison',
  'ground', 'flying', 'psychic', 'bug', 'rock', 'ghost', 'dragon', 'dark', 'steel', 'fairy',
] as const

// Canonical Gen-6+ type-effectiveness chart. TYPE_CHART[attacker][defender] is the
// damage multiplier when only it is non-1; a missing entry means ×1 (neutral).
// Values are 2 (super effective), 0.5 (not very effective), or 0 (immune).
const TYPE_CHART: Record<string, Record<string, number>> = {
  normal:   { rock: 0.5, ghost: 0, steel: 0.5 },
  fire:     { fire: 0.5, water: 0.5, grass: 2, ice: 2, bug: 2, rock: 0.5, dragon: 0.5, steel: 2 },
  water:    { fire: 2, water: 0.5, grass: 0.5, ground: 2, rock: 2, dragon: 0.5 },
  electric: { water: 2, electric: 0.5, grass: 0.5, ground: 0, flying: 2, dragon: 0.5 },
  grass:    { fire: 0.5, water: 2, grass: 0.5, poison: 0.5, ground: 2, flying: 0.5, bug: 0.5, rock: 2, dragon: 0.5, steel: 0.5 },
  ice:      { fire: 0.5, water: 0.5, grass: 2, ice: 0.5, ground: 2, flying: 2, dragon: 2, steel: 0.5 },
  fighting: { normal: 2, ice: 2, poison: 0.5, flying: 0.5, psychic: 0.5, bug: 0.5, rock: 2, ghost: 0, dark: 2, steel: 2, fairy: 0.5 },
  poison:   { grass: 2, poison: 0.5, ground: 0.5, rock: 0.5, ghost: 0.5, steel: 0, fairy: 2 },
  ground:   { fire: 2, electric: 2, grass: 0.5, poison: 2, flying: 0, bug: 0.5, rock: 2, steel: 2 },
  flying:   { electric: 0.5, grass: 2, fighting: 2, bug: 2, rock: 0.5, steel: 0.5 },
  psychic:  { fighting: 2, poison: 2, psychic: 0.5, dark: 0, steel: 0.5 },
  bug:      { fire: 0.5, grass: 2, fighting: 0.5, poison: 0.5, flying: 0.5, psychic: 2, ghost: 0.5, dark: 2, steel: 0.5, fairy: 0.5 },
  rock:     { fire: 2, ice: 2, fighting: 0.5, ground: 0.5, flying: 2, bug: 2, steel: 0.5 },
  ghost:    { normal: 0, psychic: 2, ghost: 2, dark: 0.5 },
  dragon:   { dragon: 2, steel: 0.5, fairy: 0 },
  dark:     { fighting: 0.5, psychic: 2, ghost: 2, dark: 0.5, fairy: 0.5 },
  steel:    { fire: 0.5, water: 0.5, electric: 0.5, ice: 2, rock: 2, steel: 0.5, fairy: 2 },
  fairy:    { fire: 0.5, fighting: 2, poison: 0.5, dragon: 2, dark: 2, steel: 0.5 },
}

// For a Pokémon's type(s), the incoming damage multiplier from each attacking type.
// Dual types multiply, so values land in {0, 0.25, 0.5, 1, 2, 4}.
export function getDefensiveMultipliers(types: string[]): Record<string, number> {
  const result: Record<string, number> = {}
  for (const attack of ALL_TYPES) {
    let mult = 1
    for (const def of types) mult *= TYPE_CHART[attack]?.[def] ?? 1
    result[attack] = mult
  }
  return result
}

// The attacking types this Pokémon takes >1× from, strongest first.
export function getMemberWeaknesses(types: string[]): { type: string; multiplier: number }[] {
  const mults = getDefensiveMultipliers(types)
  return ALL_TYPES
    .filter(t => mults[t] > 1)
    .map(t => ({ type: t, multiplier: mults[t] }))
    .sort((a, b) => b.multiplier - a.multiplier)
}

// Team-level analysis: for each attacking type, find how much of the team is weak to
// it versus able to resist it. A type is flagged when ≥2 members are weak AND more
// members are weak than can resist — i.e. an opponent could pressure the whole team
// with that one type. Tiered `danger` (≥3 weak, nobody resists) vs `caution`.
export function analyzeTeamWeaknesses(team: TeamMember[]): WeaknessWarning[] {
  if (team.length < 2) return []

  const profiles = team.map(m => ({ name: m.name, image: m.image, mults: getDefensiveMultipliers(m.types) }))
  const warnings: WeaknessWarning[] = []

  for (const attack of ALL_TYPES) {
    const weakMembers: { name: string; image: string }[] = []
    let resistCount = 0

    for (const p of profiles) {
      const mult = p.mults[attack]
      if (mult > 1) weakMembers.push({ name: p.name, image: p.image })
      else if (mult < 1) resistCount++ // includes immunity (mult === 0)
    }

    const weakCount = weakMembers.length
    if (weakCount >= 2 && weakCount > resistCount) {
      warnings.push({
        type: attack,
        tier: weakCount >= 3 && resistCount === 0 ? 'danger' : 'caution',
        weakMembers,
        weakCount,
        resistCount,
      })
    }
  }

  // most members weak first; if tied, fewer resists ranks as more dangerous
  return warnings.sort((a, b) => b.weakCount - a.weakCount || a.resistCount - b.resistCount)
}
