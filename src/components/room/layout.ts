// World dimensions are in metres. The back wall runs along the x axis.
export const LAMP_POSITION: [number, number, number] = [-2.76, 0.74, -2.03];
export const LAMP_SCALE = 0.38;
export const CHAIR_POSITION: [number, number, number] = [-1.62, 0, 0.12];
export const SOFA_POSITION: [number, number, number] = [-0.22, 0, -1.94];
export const SHELF_X = 2.39;

// Front centers of the two patterned cushions on the sourced sofa.
export const PILLOW_ANCHORS = [
  { key: 'school', x: SOFA_POSITION[0] - 0.49 },
  { key: 'college', x: SOFA_POSITION[0] + 0.49 },
] as const;
export const PILLOW_HEIGHT = 0.81;
export const PILLOW_DEPTH = SOFA_POSITION[2] + 0.055;
