// World dimensions are in metres. The back wall runs along the x axis.
export const LAMP_POSITION: [number, number, number] = [-2.76, 0.74, -2.03];
export const LAMP_SCALE = 0.38;
export const CHAIR_POSITION: [number, number, number] = [-1.62, 0, 0.12];
export const SOFA_POSITION: [number, number, number] = [-0.22, 0, -1.94];
export const SHELF_X = 2.39;

// The center pillow sits lower and farther forward than the side pillows.
export const PILLOW_ANCHORS = [
  { key: 'school', x: SOFA_POSITION[0] - 0.49, y: 0.81, z: SOFA_POSITION[2] + 0.055 },
  { key: 'college', x: SOFA_POSITION[0], y: 0.695, z: SOFA_POSITION[2] + 0.15 },
  { key: 'pu', x: SOFA_POSITION[0] + 0.49, y: 0.81, z: SOFA_POSITION[2] + 0.055 },
] as const;
