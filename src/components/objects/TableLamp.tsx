import { useEffect, useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Select } from '@react-three/postprocessing';
import { CatmullRomCurve3, DoubleSide, MathUtils, MeshStandardMaterial, Object3D, PointLight, SpotLight, Vector2, Vector3 } from 'three';
import { useSurfaceMap } from '../../systems/lighting/useSurfaceMap';
import { linenTransmission, pleatedShade } from './pleatedShade';

// A turned shoulder, narrow neck and recessed foot, sampled along the wood lathe.
const silhouette = [
  [0, 0.001], [0.212, 0.001], [0.218, 0.008], [0.218, 0.024], [0.207, 0.032],
  [0.212, 0.046], [0.254, 0.074], [0.293, 0.127], [0.316, 0.196],
  [0.319, 0.255], [0.305, 0.318], [0.28, 0.373], [0.233, 0.439],
  [0.18, 0.511], [0.143, 0.589], [0.128, 0.653], [0.126, 0.702],
  [0.129, 0.731], [0.142, 0.747], [0.141, 0.766], [0.125, 0.781],
  [0.108, 0.795], [0.104, 0.806], [0, 0.806],
];
const outline = new CatmullRomCurve3(silhouette.map(([r, y]) => new Vector3(r, y, 0)));
const baseProfile = outline.getPoints(160).map(p => new Vector2(Math.max(0, p.x), Math.max(0.001, p.y)));

const cord = new CatmullRomCurve3([
  new Vector3(0.11, 0.058, -0.17), new Vector3(0.25, 0.019, -0.32),
  new Vector3(0.72, 0.015, -0.41), new Vector3(1.13, 0.015, -0.66),
  new Vector3(1.79, 0.016, -0.75), new Vector3(3.0, 0.015, -0.72),
]);

type Props = { on: boolean; onToggle: () => void; onReady: () => void };

export function TableLamp({ on, onToggle, onReady }: Props) {
  const wood = useSurfaceMap('wood', 1.5, 1);
  const linen = useSurfaceMap('weave', 8, 2);
  const shade = useMemo(pleatedShade, []);
  const fabric = useRef<MeshStandardMaterial>(null!);
  const bulb = useRef<PointLight>(null!);
  const spill = useRef<PointLight>(null!);
  const downlight = useRef<SpotLight>(null!);
  const uplight = useRef<SpotLight>(null!);
  const upTarget = useMemo(() => {
    const target = new Object3D();
    target.position.set(0, 3.8, -1.15);
    return target;
  }, []);
  const level = useRef(0);
  const reducedMotion = useMemo(() => window.matchMedia('(prefers-reduced-motion: reduce)'), []);
  const invalidate = useThree(s => s.invalidate);
  useEffect(() => { onReady(); return () => shade.dispose(); }, [onReady, shade]);
  useEffect(() => { invalidate(); }, [on, invalidate]);
  useFrame((_state, delta) => {
    const target = Number(on);
    const remaining = Math.abs(level.current - target);
    level.current = remaining < 0.002 || reducedMotion.matches
      ? target : MathUtils.damp(level.current, target, 5.5, Math.min(delta, 0.08));
    fabric.current.emissiveIntensity = level.current * 2.8;
    bulb.current.intensity = level.current * 2.1;
    spill.current.intensity = level.current * 2.1;
    downlight.current.intensity = level.current * 2.5;
    uplight.current.intensity = level.current * 7.5;
    if (level.current !== target) invalidate();
  });

  return <>
    <group onClick={e => { e.stopPropagation(); onToggle(); }}
      onPointerOver={() => { document.body.classList.add('over-lamp'); }}
      onPointerOut={() => { document.body.classList.remove('over-lamp'); }}>
      <mesh castShadow receiveShadow>
        <latheGeometry args={[baseProfile, 128]} />
        <meshPhysicalMaterial map={wood} color="#bdad98" roughness={0.58} clearcoat={0.08} clearcoatRoughness={0.51} />
      </mesh>
      <mesh position-y={0.822} castShadow>
        <cylinderGeometry args={[0.095, 0.117, 0.043, 64]} />
        <meshStandardMaterial color="#a18a5c" metalness={0.82} roughness={0.31} />
      </mesh>
      <mesh position-y={1.042} castShadow>
        <cylinderGeometry args={[0.041, 0.046, 0.424, 48]} />
        <meshStandardMaterial color="#b9995e" metalness={0.78} roughness={0.30} />
      </mesh>
      <mesh position={[0, 1.842, 0]}>
        <sphereGeometry args={[0.044, 32, 16]} />
        <meshStandardMaterial color="#b49562" metalness={0.76} roughness={0.32} />
      </mesh>
      <mesh position={[0.185, 0.992, 0.085]}>
        <cylinderGeometry args={[0.004, 0.004, 0.46, 8]} />
        <meshStandardMaterial color="#b59660" metalness={0.8} roughness={0.4} />
      </mesh>
      <mesh position={[0.185, 0.75, 0.085]} scale={[1, 1.6, 1]}>
        <sphereGeometry args={[0.018, 16, 12]} />
        <meshStandardMaterial color="#b59660" metalness={0.76} roughness={0.32} />
      </mesh>
      <Select enabled>
        <mesh geometry={shade}>
          <meshStandardMaterial ref={fabric} side={DoubleSide} map={linen} emissiveMap={linen}
            emissive="#ffd198" emissiveIntensity={0} roughness={1} flatShading onBeforeCompile={linenTransmission} />
        </mesh>
      </Select>
    </group>
    <mesh castShadow><tubeGeometry args={[cord, 64, 0.009, 8, false]} />
      <meshStandardMaterial color="#312923" roughness={0.88} />
    </mesh>
    <mesh position={[0.021, 0.002, -0.036]} rotation-x={-Math.PI / 2} renderOrder={1}>
      <planeGeometry args={[1.45, 1.25]} />
      <shaderMaterial transparent depthWrite={false}
        vertexShader={`varying vec2 vUv;
          void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`}
        fragmentShader={`varying vec2 vUv;
          void main() {
            float r = length((vUv - 0.5) * 2.0);
            float ao = 0.58 * exp(-6.5 * r*r) + 0.29 * (1.0-smoothstep(0.24,0.5,r));
            gl_FragColor = vec4(0.012, 0.008, 0.006, ao * (1.0-smoothstep(0.8,1.0,r)));
          }`} />
    </mesh>
    <primitive object={upTarget} />
    <spotLight ref={uplight} position={[0, 1.56, -0.1]} target={upTarget}
      angle={0.72} penumbra={0.95} color="#ffce8c" intensity={0} />
    <spotLight ref={downlight} position={[-0.18, 1.04, -0.15]} angle={1.14} penumbra={0.88}
      color="#ffcf91" intensity={0} />
    <pointLight ref={bulb} position={[0, 1.16, 0]} intensity={0} color="#ffd19a" />
    <pointLight ref={spill} position={[0, 1.5, -0.32]} intensity={0} color="#ffca91" />
  </>;
}
