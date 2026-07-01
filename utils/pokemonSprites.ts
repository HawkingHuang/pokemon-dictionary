import { SPRITE_CDN_BASE } from '@/utils/constants'

// Pixel sprite (small, retro) for a Pokémon
export const spriteUrl = (id: number) => `${SPRITE_CDN_BASE}/${id}.png`

// Official artwork (high-res) for a Pokémon
export const artworkUrl = (id: number) => `${SPRITE_CDN_BASE}/other/official-artwork/${id}.png`
