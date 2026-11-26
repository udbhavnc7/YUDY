import { useMemo, useRef, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import { MathUtils, MeshStandardMaterial, PointLight } from 'three';
import { useSurfaceMaps } from '../../systems/lighting/useSurfaceMap';

const joinery = ['joinery'] as const;

export function ReadingCorner() {
  const [wood] = useSurfaceMaps(joinery, 1, 1);
  const [on, setOn] = useState(false);
  const lamp = useRef<PointLight>(null);
  const shade = useRef<MeshStandardMaterial>(null);
  const warmth = useRef(0);
  const motion = useMemo(() => matchMedia('(prefers-reduced-motion: reduce)'), []);
  const invalidate = useThree(state => state.invalidate);

  useFrame((_, delta) => {
    const target = on ? 1 : 0;
    warmth.current = motion.matches || Math.abs(warmth.current - target) < 0.001
      ? target : MathUtils.damp(warmth.current, target, 5.8, Math.min(delta, 0.075));
    if (lamp.current) lamp.current.intensity = warmth.current * 3.8;
    if (shade.current) shade.current.emissiveIntensity = warmth.current * 0.85;
    if (warmth.current !== target) invalidate();
  });

  return <group position={[1.26, 0, -1.72]}>
    {/* A compact walnut table sits beside the sofa arm. */}
    <mesh position={[0, 0.59, 0]} castShadow receiveShadow>
      <boxGeometry args={[0.59, 0.075, 0.54]} />
      <meshStandardMaterial map={wood} color="#8d694c" roughness={0.46} />
    </mesh>
    <mesh position={[0, 0.40, 0]} castShadow>
      <boxGeometry args={[0.48, 0.26, 0.43]} />
      <meshStandardMaterial map={wood} color="#76573e" roughness={0.57} />
    </mesh>
    {[-0.235, 0.235].flatMap(x => [-0.205, 0.205].map(z => <mesh key={`${x}:${z}`}
      position={[x, 0.20, z]} castShadow receiveShadow>
      <cylinderGeometry args={[0.033, 0.048, 0.37, 10]} />
      <meshStandardMaterial map={wood} color="#705137" roughness={0.58} />
    </mesh>))}
    <mesh position={[0, 0.10, 0]}>
      <boxGeometry args={[0.45, 0.045, 0.40]} />
      <meshStandardMaterial map={wood} color="#72543b" roughness={0.65} />
    </mesh>

    {/* Brushed brass stem and a warm linen shade. */}
    <mesh position={[0, 0.64, 0]} castShadow>
      <cylinderGeometry args={[0.105, 0.13, 0.035, 24]} />
      <meshStandardMaterial color="#aa8250" metalness={0.78} roughness={0.32} />
    </mesh>
    <mesh position={[0, 0.84, 0]} castShadow>
      <cylinderGeometry args={[0.025, 0.032, 0.38, 16]} />
      <meshStandardMaterial color="#b08a56" metalness={0.75} roughness={0.29} />
    </mesh>
    <mesh position={[0, 1.08, 0]} castShadow>
      <cylinderGeometry args={[0.09, 0.19, 0.26, 32, 1, true]} />
      <meshStandardMaterial ref={shade} color="#ead9b9" emissive="#ffbd70" emissiveIntensity={0}
        side={2} roughness={0.88} />
    </mesh>
    <pointLight ref={lamp} position={[0, 1.03, 0]} color="#ffd39a" intensity={0} distance={2.1} decay={2} />
    <Html position={[0, 0.57, 0.34]} center zIndexRange={[24, 0]}>
      <button className="coffee-action" type="button" aria-pressed={on}
        onClick={event => { event.stopPropagation(); setOn(value => !value); }}>
        {on ? 'Reading light on' : 'Turn on reading light'}
      </button>
    </Html>
  </group>;
}
