export const POSTER_WIDTH = 0.70;
export const POSTER_HEIGHT = 0.63;
export const POSTER_FRONT = -2.438;
export const GALLERY_X = -0.34;
export const GALLERY_Y = 2.02;

export function posterPosition(index: number): [number, number, number] {
  return [GALLERY_X + (index % 4 - 1.5) * 0.805, GALLERY_Y + (0.5 - Math.floor(index / 4)) * 0.735, POSTER_FRONT];
}
