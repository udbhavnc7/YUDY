import { CatmullRomCurve3, MathUtils, Vector3 } from 'three';
import { CHAIR_POSITION, LAMP_POSITION, LAMP_SCALE, SOFA_POSITION } from '../../components/room/layout';
import { chairAngle, chairTurn, CHAIR_START, SOFA_START } from './chairTurn';

type XYZ = [number, number, number];
type Shot = { at: number; eye: XYZ; look: XYZ; fov: number };
export const zones = [
  ['Lamp', 0], ['Chair', CHAIR_START], ['Sofa', SOFA_START], ['Poster wall', 0.32],
  ['Solo shelf', 0.47], ['Group shelf', 0.62], ['Showcase', 0.74], ['Room', 0.87],
] as const;

export function zoneIndex(progress: number) {
  let i = 0;
  while (i + 1 < zones.length && progress >= zones[i + 1][1]) i++;
  return i;
}

export function lampShot(aspect: number, isolated: boolean): Shot {
  const portrait = aspect < 1.14;
  const x = portrait ? 0 : -Math.min(0.95, 0.55 * aspect);
  const y = portrait ? 0.57 : 1.01;
  const d = portrait ? Math.max(5.45, 3.35 / aspect) : 4.6;
  const offset: XYZ = isolated ? [0, 0, 0] : LAMP_POSITION;
  const scale = isolated ? 1 : LAMP_SCALE;
  return { at: 0, look: [offset[0] + x * scale, offset[1] + y * scale, offset[2]],
    eye: [offset[0] + x * scale, offset[1] + (y + d * 0.115) * scale, offset[2] + d * scale], fov: 33 };
}

export function roomPath(aspect: number, isolated: boolean) {
  const opening = lampShot(aspect, isolated);
  const portrait = aspect < 1.14;
  const shots: Shot[] = [
    opening,
    { at: 0.151, eye: [-2.19, 1.34, 2.23], look: [-1.56, 0.88, 0.03], fov: 49 },
    { at: 0.27, eye: [-0.37, 1.15, 0.52], look: [SOFA_POSITION[0], 0.78, SOFA_POSITION[2]], fov: 42 },
    { at: 0.395, eye: [-0.47, 1.57, 0.72], look: [-0.29, 1.64, -2.48], fov: 46 },
    { at: 0.545, eye: [1.08, 1.35, 0.29], look: [1.88, 1.10, -2.24], fov: 46 },
    { at: 0.68, eye: [2.25, 1.45, 0.22], look: [2.92, 1.28, -2.24], fov: 46 },
    { at: 0.805, eye: [1.41, 1.47, 1.18], look: [3.65, 1.50, -0.71], fov: 47 },
    { at: 0.90, eye: [0.93, 1.63, 2.98], look: [0.93, 1.15, -1.42], fov: 49 },
    { at: 1, eye: [-0.77, 1.76, 5.37], look: [0.32, 1.23, -1.42], fov: 40 },
  ];
  // A narrow sensor needs more distance to hold both ends of the room in the closing frame.
  const reveal = shots[shots.length - 1];
  if (portrait) reveal.fov = MathUtils.clamp(MathUtils.radToDeg(2 * Math.atan(4.25 / (9.1 * aspect))), 54, 101);
  const horizontalTangent = aspect * Math.tan(MathUtils.degToRad(reveal.fov) / 2);
  reveal.eye[2] = Math.max(5.37, 4.25 / horizontalTangent + reveal.look[2]);
  if (portrait) {
    for (const shot of shots.slice(1)) shot.fov = Math.max(shot.fov, 54);
    shots[2].eye[2] = Math.max(0.52, 1.36 / (aspect * 0.51) + SOFA_POSITION[2]);
  }
  const eyes = new CatmullRomCurve3(shots.map(s => new Vector3(...s.eye)));
  const targets = new CatmullRomCurve3(shots.map(s => new Vector3(...s.look)));
  const facing = new Vector3();
  return (progress: number, reducedMotion: boolean, eye: Vector3, look: Vector3) => {
    let p = isolated ? 0 : progress;
    if (reducedMotion && !isolated) {
      const index = zoneIndex(p);
      p = index === zones.length - 1 ? 1 : shots[index].at;
    }
    let i = 0;
    while (i < shots.length - 2 && p > shots[i + 1].at) i++;
    const t = MathUtils.clamp((p - shots[i].at) / (shots[i + 1].at - shots[i].at), 0, 1);
    const curveTime = (i + t) / (shots.length - 1);
    eyes.getPoint(curveTime, eye);
    targets.getPoint(curveTime, look);

    // During the turn, the chair leads the camera's gaze toward the sofa.
    const turn = chairTurn(p);
    if (!reducedMotion && turn > 0 && turn < 1) {
      const yaw = chairAngle(p, false);
      const reach = 0.30 + 1.62 * turn;
      facing.set(CHAIR_POSITION[0] + Math.sin(yaw) * reach, 0.86, CHAIR_POSITION[2] + Math.cos(yaw) * reach);
      look.lerp(facing, 0.45 * Math.sin(Math.PI * turn) ** 2);
    }
    const fovBlend = MathUtils.smoothstep(t, 0, 1);
    return MathUtils.lerp(shots[i].fov, shots[i + 1].fov, fovBlend);
  };
}
