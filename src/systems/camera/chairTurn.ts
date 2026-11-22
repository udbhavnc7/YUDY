import { MathUtils } from 'three';
import { CHAIR_POSITION, SOFA_POSITION } from '../../components/room/layout';

export const CHAIR_START = 0.10;
export const SOFA_START = 0.22;
const restingAngle = 0.57;
const facingSofa = Math.atan2(
  SOFA_POSITION[0] - CHAIR_POSITION[0], SOFA_POSITION[2] - CHAIR_POSITION[2],
);

export function chairTurn(progress: number) {
  return MathUtils.smootherstep(progress, CHAIR_START, SOFA_START);
}

export function chairAngle(progress: number, reducedMotion: boolean) {
  const turn = reducedMotion ? Number(progress >= SOFA_START) : chairTurn(progress);
  return MathUtils.lerp(restingAngle, facingSofa, turn);
}
