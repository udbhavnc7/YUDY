import { useMemo, useRef, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import { Group, MathUtils, Mesh } from 'three';
import { useSurfaceMaps } from '../../systems/lighting/useSurfaceMap';
import { useRoomModel } from '../objects/useRoomModel';

const BOOK = '/models/project-book.glb';

export function CoffeeTable() {
  const [wood] = useSurfaceMaps(['joinery'], 1, 1);
  const bookSource = useRoomModel(BOOK);
  const drawer = useRef<Group>(null);
  const motion = useMemo(() => matchMedia('(prefers-reduced-motion: reduce)'), []);
  const invalidate = useThree(state => state.invalidate);
  const [open, setOpen] = useState(false);
  const amount = useRef(0);
  const book = useMemo(() => {
    const clone = bookSource.clone(true);
    clone.traverse(object => {
      if (object instanceof Mesh) object.castShadow = object.receiveShadow = true;
    });
    return clone;
  }, [bookSource]);

  useFrame((_, delta) => {
    if (!drawer.current) return;
    const target = open ? 1 : 0;
    amount.current = motion.matches || Math.abs(amount.current - target) < 0.001
      ? target : MathUtils.damp(amount.current, target, 8, Math.min(delta, 0.075));
    drawer.current.position.z = 0.25 + amount.current * 0.22;
    if (amount.current !== target) invalidate();
  });

  return <group position={[-0.47, 0, -0.73]}>
    {/* Walnut slab with a soft apron and four tapered legs. */}
    <mesh position={[0, 0.45, 0]} castShadow receiveShadow>
      <boxGeometry args={[1.28, 0.08, 0.78]} />
      <meshStandardMaterial map={wood} color="#8c6546" roughness={0.46} />
    </mesh>
    <mesh position={[0, 0.376, 0]} castShadow>
      <boxGeometry args={[1.08, 0.12, 0.62]} />
      <meshStandardMaterial map={wood} color="#74543c" roughness={0.56} />
    </mesh>
    {[-0.53, 0.53].flatMap(x => [-0.29, 0.29].map(z => <mesh key={`${x}:${z}`}
      position={[x, 0.222, z]} rotation={[0, 0, x > 0 ? -0.035 : 0.035]} castShadow receiveShadow>
      <cylinderGeometry args={[0.052, 0.077, 0.35, 10]} />
      <meshStandardMaterial map={wood} color="#755239" roughness={0.56} />
    </mesh>))}
    {/* Open drawer reveals a real project volume; movement stays tied to a physical control. */}
    <group ref={drawer} position={[0, 0, 0.25]}>
      <mesh position={[0, 0.29, 0]}>
        <boxGeometry args={[0.74, 0.035, 0.38]} />
        <meshStandardMaterial color="#4c3528" roughness={0.9} />
      </mesh>
      <mesh position={[0, 0.33, -0.16]}>
        <boxGeometry args={[0.74, 0.12, 0.035]} />
        <meshStandardMaterial color="#73543b" roughness={0.58} />
      </mesh>
      <mesh position={[-0.35, 0.33, 0]}>
        <boxGeometry args={[0.035, 0.12, 0.35]} />
        <meshStandardMaterial color="#73543b" roughness={0.58} />
      </mesh>
      <mesh position={[0.35, 0.33, 0]}>
        <boxGeometry args={[0.035, 0.12, 0.35]} />
        <meshStandardMaterial color="#73543b" roughness={0.58} />
      </mesh>
      <primitive object={book} position={[0, 0.30, -0.035]} rotation-x={-Math.PI / 2} scale={0.12} />
      <mesh position={[0, 0.332, 0.037]} castShadow>
        <boxGeometry args={[0.7, 0.12, 0.035]} />
        <meshStandardMaterial map={wood} color="#815d42" roughness={0.49} />
      </mesh>
      <mesh position={[0, 0.335, 0.06]} castShadow>
        <sphereGeometry args={[0.025, 16, 12]} />
        <meshStandardMaterial color="#c4a06b" metalness={0.72} roughness={0.28} />
      </mesh>
    </group>
    <Html position={[0, 0.35, 0.46]} center zIndexRange={[24, 0]}>
      <button className="coffee-action" type="button" aria-expanded={open}
        onClick={event => { event.stopPropagation(); setOpen(value => !value); }}>
        {open ? 'Close drawer' : 'Explore drawer'}
      </button>
    </Html>
  </group>;
}
