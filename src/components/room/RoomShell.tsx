import type { RoomView } from '../../systems/camera/CameraRig';
import { useLayoutEffect, useMemo, type MutableRefObject } from 'react';
import { extend, type ReactThreeFiber } from '@react-three/fiber';
import { MeshStandardMaterial, Vector2 } from 'three';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';
import { useSurfaceMap, useSurfaceMaps } from '../../systems/lighting/useSurfaceMap';
import { CHAIR_POSITION, LAMP_POSITION, SHELF_X, SOFA_POSITION } from './layout';
import { Seating } from './Seating';
import { SHOWCASE_FACING, SHOWCASE_POSITION, SHOWCASE_RISER, SHOWCASE_TOP } from './showcaseLayout';

extend({ RoundedBoxGeometry });
declare module '@react-three/fiber' {
  interface ThreeElements {
    roundedBoxGeometry: ReactThreeFiber.BufferGeometryNode<RoundedBoxGeometry, typeof RoundedBoxGeometry>;
  }
}

type XYZ = [number, number, number];
type BoardProps = { at: XYZ; size: XYZ; material: MeshStandardMaterial; casts?: boolean; bevel?: number };

function Board({ at, size, material, casts = true, bevel = 0 }: BoardProps) {
  return <mesh position={at} material={material} castShadow={casts} receiveShadow>
    {bevel ? <roundedBoxGeometry args={[...size, 2, bevel]} /> : <boxGeometry args={size} />}
  </mesh>;
}

function FloorContact({ x, z, width, depth, strength }: {
  x: number; z: number; width: number; depth: number; strength: number;
}) {
  const uniforms = useMemo(() => ({ strength: { value: strength } }), [strength]);
  return <mesh position={[x, 0.012, z]} rotation-x={-Math.PI / 2}>
    <planeGeometry args={[width, depth]} />
    <shaderMaterial transparent depthWrite={false} uniforms={uniforms}
      vertexShader={`varying vec2 surfaceUv;
        void main() {
          surfaceUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }`}
      fragmentShader={`varying vec2 surfaceUv;
        uniform float strength;
        void main() {
          vec2 d = abs(2.0 * surfaceUv - 1.0);
          float opacity = (1.0 - smoothstep(0.2, 1.0, d.x)) * (1.0 - smoothstep(0.12, 1.0, d.y));
          gl_FragColor = vec4(0.015, 0.011, 0.008, opacity * strength);
        }`} />
  </mesh>;
}

function WindowWall({ paint, trim }: { paint: MeshStandardMaterial; trim: MeshStandardMaterial }) {
  // The sill and reveals have depth so the daylight source can graze the opening.
  return <group position={[3.88, 0, -0.48]} rotation-y={-Math.PI / 2}>
    <Board at={[4.35, 0.45, 0]} size={[12.92, 0.9, 0.16]} material={paint} casts={false} />
    <Board at={[4.35, 2.95, 0]} size={[12.92, 0.5, 0.16]} material={paint} casts={false} />
    <Board at={[-1.61, 1.8, 0]} size={[1.22, 1.8, 0.16]} material={paint} casts={false} />
    <Board at={[5.85, 1.8, 0]} size={[9.7, 1.8, 0.16]} material={paint} casts={false} />
    <mesh position={[0, 1.8, -0.13]}>
      <planeGeometry args={[2.42, 2.12]} />
      <shaderMaterial
        vertexShader={`varying vec2 paneUv;
          void main() {
            paneUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }`}
        fragmentShader={`varying vec2 paneUv;
          void main() {
            vec3 glass = mix(vec3(0.46, 0.41, 0.34), vec3(1.55, 1.66, 1.75), smoothstep(0.03, 0.95, paneUv.y));
            gl_FragColor = vec4(glass, 1.0);
            #include <tonemapping_fragment>
            #include <colorspace_fragment>
          }`} />
    </mesh>
    {[-1, 0, 1].map(x => <Board key={x} at={[x, 1.8, -0.025]} size={[0.043, 1.81, 0.11]} material={trim} />)}
    {[0.91, 2.04, 2.69].map(y => <Board key={y} at={[0, y, -0.025]} size={[2.05, 0.04, 0.11]} material={trim} />)}
    <Board at={[0, 0.9, 0.072]} size={[2.16, 0.06, 0.3]} material={trim} />
  </group>;
}

function Cabinet({ wood, brass }: { wood: MeshStandardMaterial; brass: MeshStandardMaterial }) {
  return <group position={[LAMP_POSITION[0], 0, LAMP_POSITION[2]]}>
    <Board at={[0, 0.715, -0.015]} size={[1.25, 0.05, 0.79]} material={wood} bevel={0.005} />
    <Board at={[0, 0.56, -0.04]} size={[1.14, 0.265, 0.67]} material={wood} bevel={0.005} />
    <Board at={[0, 0.562, 0.307]} size={[1.08, 0.212, 0.035]} material={wood} bevel={0.005} />
    <Board at={[0, 0.59, 0.34]} size={[0.19, 0.016, 0.037]} material={brass} />
    {[-0.49, 0.49].flatMap(x => [-0.29, 0.23].map(z =>
      <Board key={x + ',' + z} at={[x, 0.215, z]} size={[0.051, 0.43, 0.051]} material={wood} bevel={0.005} />))}
  </group>;
}

function Shelves({ wood, back }: { wood: MeshStandardMaterial; back: MeshStandardMaterial }) {
  return <group position={[SHELF_X, 0, -2.25]}>
    <Board at={[0, 1.13, -0.19]} size={[2.14, 2.26, 0.05]} material={back} />
    <Board at={[0, 0.077, 0]} size={[2.16, 0.154, 0.42]} material={wood} bevel={0.005} />
    {[-1.06, 0, 1.06].map(x => <Board key={x} at={[x, 1.21, 0]} size={[0.045, 2.13, 0.42]} material={wood} bevel={0.005} />)}
    {[0.56, 1.00, 1.44, 1.88, 2.28].map(y =>
      <Board key={y} at={[0, y, 0]} size={[2.17, 0.043, 0.445]} material={wood} bevel={0.005} />)}
    <Board at={[0, 0.206, 0.219]} size={[2.13, 0.029, 0.026]} material={wood} bevel={0.005} />
    <Board at={[0, 2.262, 0.227]} size={[2.20, 0.026, 0.027]} material={wood} bevel={0.005} />
    <Board at={[0, 2.316, 0]} size={[2.23, 0.04, 0.48]} material={wood} bevel={0.005} />
  </group>;
}

function ShowcaseTable({ wood, back, brass }: { wood: MeshStandardMaterial; back: MeshStandardMaterial; brass: MeshStandardMaterial }) {
  return <group position={SHOWCASE_POSITION} rotation-y={SHOWCASE_FACING}>
    <Board at={[0, SHOWCASE_TOP - 0.024, 0]} size={[1.59, 0.048, 0.68]} material={wood} bevel={0.012} />
    <Board at={[0, 0.80, 0.27]} size={[1.48, 0.12, 0.074]} material={wood} bevel={0.005} />
    <Board at={[0, 0.80, -0.27]} size={[1.48, 0.12, 0.074]} material={back} bevel={0.005} />
    {[-0.715, 0.715].flatMap(x => [-0.27, 0.27].map(z => (
      <Board key={x + ',' + z} at={[x, 0.442, z]} size={[0.065, 0.884, 0.065]} material={wood} bevel={0.008} />
    )))}
    <Board at={[-0.055, SHOWCASE_RISER - 0.022, -0.13]} size={[1.37, 0.044, 0.31]} material={wood} bevel={0.009} />
    {[-0.60, 0.50].map(x => <Board key={x} at={[x, 1.034, -0.197]} size={[0.041, 0.248, 0.078]} material={brass} bevel={0.004} />)}
  </group>;
}

function Rug() {
  const [map, normalMap, roughnessMap] = useSurfaceMaps(['rug', 'rug-normal', 'rug-roughness'], 6, 4);
  const maps = useMemo(() => ({ map, normalMap, roughnessMap, normalScale: new Vector2(0.35, 0.35) }), [map, normalMap, roughnessMap]);
  return <group position={[-0.33, 0.007, -0.41]} rotation-x={-Math.PI / 2}>
    <mesh receiveShadow><planeGeometry args={[3.9, 2.31]} />
      <meshStandardMaterial args={[maps]} color="#9e7967" />
    </mesh>
    <mesh position-z={0.001} receiveShadow><planeGeometry args={[3.83, 2.24]} />
      <meshStandardMaterial args={[maps]} color="#c2a184" />
    </mesh>
    <mesh position-z={0.002} receiveShadow><planeGeometry args={[3.73, 2.14]} />
      <meshStandardMaterial args={[maps]} color="#ac8268" />
    </mesh>
  </group>;
}

export function RoomShell({ view }: { view: MutableRefObject<RoomView> }) {
  const [plaster, plasterNormal] = useSurfaceMaps(['plaster', 'plaster-normal'], 4, 2);
  const timber = useSurfaceMap('joinery', 1, 1);
  const [boards, boardNormal, boardRoughness] = useSurfaceMaps(['boards', 'boards-normal', 'boards-roughness'], 4.4, 5.83);
  const paint = useMemo(() => new MeshStandardMaterial({ color: '#938774', map: plaster, normalMap: plasterNormal,
    normalScale: new Vector2(0.42, 0.42), roughness: 0.92 }), [plaster, plasterNormal]);
  const trim = useMemo(() => new MeshStandardMaterial({ color: '#777263', roughness: 0.66 }), []);
  const wood = useMemo(() => new MeshStandardMaterial({ color: '#baa186', map: timber, roughness: 0.48 }), [timber]);
  const back = useMemo(() => new MeshStandardMaterial({ color: '#8a755e', map: timber, roughness: 0.81 }), [timber]);
  const brass = useMemo(() => new MeshStandardMaterial({ color: '#c69e62', metalness: 0.75, roughness: 0.32 }), []);
  useLayoutEffect(() => () => {
    paint.dispose();
    trim.dispose();
    wood.dispose();
    back.dispose();
    brass.dispose();
  }, [paint, trim, wood, back, brass]);
  const floor = useMemo(() => ({ map: boards, normalMap: boardNormal, roughnessMap: boardRoughness,
    normalScale: new Vector2(0.45, 0.45) }), [boards, boardNormal, boardRoughness]);
  return <>
    <mesh rotation-x={-Math.PI / 2} position={[0, -0.005, 3.8]} receiveShadow>
      <planeGeometry args={[15, 14]} /><meshStandardMaterial args={[floor]} color="#897c66" />
    </mesh>
    <Board at={[0, 1.6, -2.57]} size={[7.84, 3.2, 0.14]} material={paint} casts={false} />
    <Board at={[-3.88, 1.6, 3.8]} size={[0.14, 3.2, 12.74]} material={paint} casts={false} />
    <WindowWall paint={paint} trim={trim} />
    <Board at={[0, 3.23, 3.8]} size={[7.84, 0.08, 12.74]} material={paint} casts={false} />
    <Board at={[0, 0.08, -2.47]} size={[7.78, 0.16, 0.06]} material={trim} />
    <Board at={[-3.79, 0.08, 3.8]} size={[0.065, 0.16, 12.74]} material={trim} />
    <Board at={[3.77, 0.08, 3.8]} size={[0.065, 0.16, 12.74]} material={trim} />
    <Board at={[0, 3.12, -2.46]} size={[7.8, 0.11, 0.09]} material={trim} />
    <Rug />
    <Cabinet wood={wood} brass={brass} />
    <Shelves wood={wood} back={back} />
    <ShowcaseTable wood={wood} back={back} brass={brass} />
    <FloorContact x={SOFA_POSITION[0]} z={SOFA_POSITION[2]} width={3.05} depth={1.1} strength={0.75} />
    <FloorContact x={CHAIR_POSITION[0]} z={CHAIR_POSITION[2]} width={0.83} depth={0.78} strength={0.52} />
    <FloorContact x={LAMP_POSITION[0]} z={LAMP_POSITION[2]} width={1.42} depth={0.96} strength={0.54} />
    <FloorContact x={SHELF_X} z={-2.16} width={2.38} depth={0.79} strength={0.66} />
    <FloorContact x={SHOWCASE_POSITION[0]} z={SHOWCASE_POSITION[2]} width={0.89} depth={1.79} strength={0.48} />
    <Seating kind="sofa" />
    <Seating kind="chair" view={view} />
  </>;
}
