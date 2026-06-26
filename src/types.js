export const SESSION_TYPES = {
  easy:      { label: 'Easy',      color: '#6a9420', bg: '#e4edcc' },
  tempo:     { label: 'Tempo',     color: '#e55c1a', bg: '#fbe8dc' },
  intervals: { label: 'Intervals', color: '#c43010', bg: '#f5dbd6' },
  long:      { label: 'Long',      color: '#1e4888', bg: '#d4dfee' },
  strength:  { label: 'Strength',  color: '#8a7818', bg: '#ede8c4' },
  gym:       { label: 'Gym',       color: '#64589e', bg: '#e0dced' },
  rest:      { label: 'Rest',      color: '#7a7468', bg: '#e8e4dc' },
}

export const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

export const PALETTES = {
  frost: {
    name: 'Frost',
    types: {
      rest:      { bold: '#F7F7F7', text: '#aaaaaa' },
      easy:      { bold: '#D5E8EC', text: '#1a2c32' },
      gym:       { bold: '#BDD0D8', text: '#1a2c32' },
      long:      { bold: '#A8BFCA', text: '#1a2c32' },
      strength:  { bold: '#2A3840', text: '#ffffff' },
      tempo:     { bold: '#E83018', text: '#ffffff' },
      intervals: { bold: '#C01408', text: '#ffffff' },
    },
  },
  ocean: {
    name: 'Ocean',
    types: {
      rest:      { bold: '#E8E8CC', text: '#3a3820' },
      gym:       { bold: '#9ABCD8', text: '#0a1828' },
      easy:      { bold: '#6A9AC8', text: '#0a1828' },
      strength:  { bold: '#3A5EA8', text: '#ffffff' },
      long:      { bold: '#1A3A7A', text: '#ffffff' },
      tempo:     { bold: '#0E1E48', text: '#ffffff' },
      intervals: { bold: '#080E28', text: '#ffffff' },
    },
  },
}

export const DEFAULT_PALETTE = 'frost'

// Pick white or near-black text based on background luminance
export function contrastText(hex) {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255 > 0.5 ? '#1a1a1a' : '#ffffff'
}

// Default custom colors initialised from Frost so users have a sensible starting point
export const CUSTOM_DEFAULTS = Object.fromEntries(
  Object.entries(PALETTES.frost.types).map(([k, v]) => [k, v.bold])
)

export function getPaletteColors(paletteId, type, customPalette = {}) {
  if (paletteId === 'custom') {
    const bold = customPalette[type] ?? CUSTOM_DEFAULTS[type] ?? '#888888'
    return { bold, text: contrastText(bold) }
  }
  const palette = PALETTES[paletteId] ?? PALETTES[DEFAULT_PALETTE]
  return palette.types[type] ?? palette.types.rest
}
