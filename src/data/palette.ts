// Central palette tokens from ART-BIBLE.md
export const PALETTE = {
  ink: '#0E1726',
  navy: '#16233A',
  slate: '#2C3A51',
  paper: '#F3EAD8',
  ivory: '#FBF6EC',
  gold: '#E3B25C',
  cherry: '#C9424B',
  blush: '#EBA9B4',
  sky: '#8FB8D8',
} as const;

export type PaletteToken = keyof typeof PALETTE;
