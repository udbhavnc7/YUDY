import { GROUP_PROJECTS, SOLO_PROJECTS, type Project, type ProjectType } from '../../data/projects';
import { SHELF_X } from './layout';

export const SOLO_SHELF_X = SHELF_X - 0.53;
export const GROUP_SHELF_X = SHELF_X + 0.53;
export const BOOK_FRONT = -2.055;
export const BOOK_PULL = 0.072;

type Slot = {
  x: number;
  floor: number;
  thickness: number;
  height: number;
  depth: number;
  faceOut: boolean;
  cloth: string;
};

export type ShelfBook = Slot & { project: Project };

const soloSlots: Slot[] = [
  { x: -0.26, floor: 1.462, thickness: 0.112, height: 0.312, depth: 0.212, faceOut: true, cloth: '#81503e' },
  { x: 0.092, floor: 1.462, thickness: 0.122, height: 0.337, depth: 0.226, faceOut: false, cloth: '#47625b' },
  { x: -0.285, floor: 1.022, thickness: 0.125, height: 0.306, depth: 0.190, faceOut: false, cloth: '#947343' },
  { x: 0.045, floor: 1.022, thickness: 0.072, height: 0.332, depth: 0.217, faceOut: true, cloth: '#73504f' },
];

const groupSlots: Slot[] = [
  { x: -0.235, floor: 1.462, thickness: 0.085, height: 0.391, depth: 0.294, faceOut: true, cloth: '#24374c' },
  { x: 0.233, floor: 1.462, thickness: 0.078, height: 0.382, depth: 0.282, faceOut: true, cloth: '#633b35' },
  { x: -0.239, floor: 1.022, thickness: 0.076, height: 0.374, depth: 0.273, faceOut: true, cloth: '#36504a' },
  { x: 0.222, floor: 1.022, thickness: 0.086, height: 0.390, depth: 0.291, faceOut: true, cloth: '#544158' },
];

function placeBooks(projects: Project[], slots: Slot[], center: number): ShelfBook[] {
  return slots.flatMap((slot, i) => projects[i] ? [{ project: projects[i], ...slot, x: center + slot.x }] : []);
}

export const PROJECT_SHELVES: Record<ProjectType, ShelfBook[]> = {
  solo: placeBooks(SOLO_PROJECTS, soloSlots, SOLO_SHELF_X),
  group: placeBooks(GROUP_PROJECTS, groupSlots, GROUP_SHELF_X),
};
