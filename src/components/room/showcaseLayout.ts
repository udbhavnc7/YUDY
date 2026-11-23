import { HOBBIES } from '../../data/hobbies';

type XYZ = [number, number, number];
type DisplaySlot = { position: XYZ; rotation: XYZ; scale: XYZ; hit: [number, number, number, number, number] };

export const SHOWCASE_POSITION: XYZ = [3.29, 0, -0.33];
export const SHOWCASE_FACING = -Math.PI / 2;
export const SHOWCASE_TOP = 0.91;
export const SHOWCASE_RISER = 1.20;
export const FLOOR_PLANT: XYZ = [3.24, 0, -1.61];
export const HANGING_PLANT: XYZ = [3.42, 1.94, -0.94];

// Coordinates are relative to the table. The foreground row sits closer to the window-facing camera.
const slots: DisplaySlot[] = [
  { position: [-0.48, SHOWCASE_RISER, -0.13], rotation: [0, -0.24, 0], scale: [1.42, 1.42, 1.42], hit: [-0.48, 1.27, -0.04, 0.24, 0.17] },
  { position: [0.29, SHOWCASE_RISER, -0.14], rotation: [0, 0.16, 0], scale: [1.17, 1.17, 1.17], hit: [0.29, 1.275, -0.085, 0.20, 0.19] },
  { position: [-0.41, SHOWCASE_TOP, 0.15], rotation: [0, 0.14, Math.PI / 2], scale: [0.049, 0.254, 0.175], hit: [-0.41, 0.98, 0.24, 0.31, 0.14] },
  { position: [0.28, SHOWCASE_TOP, 0.15], rotation: [0, 0.26, 0], scale: [0.96, 0.96, 0.96], hit: [0.28, 0.986, 0.24, 0.49, 0.14] },
];

export const SHOWCASE_ITEMS = HOBBIES.flatMap((hobby, index) => {
  const slot = slots[index];
  if (!slot) return [];
  const [x, y, z, width, height] = slot.hit;
  return [{ hobby, ...slot, anchor: [SHOWCASE_POSITION[0] - z, y, SHOWCASE_POSITION[2] + x, width, height] as const }];
});
