import { SOLO_PROJECTS } from '../../data/projects';
import { SHELF_X } from './layout';

export const SOLO_SHELF_X = SHELF_X - 0.53;
export const SOLO_SHELF_Y = 1.39;
export const BOOK_FRONT = -2.055;
export const BOOK_PULL = 0.072;

const slots = [
  { x: -0.30, floor: 1.462, thickness: 0.064, height: 0.341, depth: 0.218, faceOut: true, cloth: '#444f64' },
  { x: -0.035, floor: 1.462, thickness: 0.112, height: 0.312, depth: 0.212, faceOut: false, cloth: '#81503e' },
  { x: 0.16, floor: 1.462, thickness: 0.122, height: 0.337, depth: 0.226, faceOut: false, cloth: '#47625b' },
  { x: -0.285, floor: 1.022, thickness: 0.125, height: 0.306, depth: 0.190, faceOut: false, cloth: '#947343' },
  { x: 0.045, floor: 1.022, thickness: 0.072, height: 0.332, depth: 0.217, faceOut: true, cloth: '#73504f' },
];

export const SOLO_BOOKS = SOLO_PROJECTS.map((project, index) => ({
  project,
  ...slots[index],
  x: SOLO_SHELF_X + slots[index].x,
}));
