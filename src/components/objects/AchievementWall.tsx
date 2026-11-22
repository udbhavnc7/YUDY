import { useEffect, useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { MathUtils, MeshStandardMaterial } from 'three';
import { ACHIEVEMENTS, ACHIEVEMENT_STYLES, type Achievement } from '../../data/achievements';
import { POSTER_HEIGHT, POSTER_WIDTH, posterPosition } from '../room/galleryLayout';
import { posterPrint } from './posterPrint';

function Poster({ item, index, active }: { item: Achievement; index: number; active: boolean }) {
  const print = useMemo(() => posterPrint(item, index), [item, index]);
  const rim = useRef<MeshStandardMaterial>(null);
  const invalidate = useThree(state => state.invalidate);
  const motion = useMemo(() => matchMedia('(prefers-reduced-motion: reduce)'), []);
  const { edge } = ACHIEVEMENT_STYLES[item.status];

  useEffect(() => () => print.dispose(), [print]);
  useEffect(() => { invalidate(); }, [active, invalidate]);
  useFrame((_, delta) => {
    if (!rim.current) return;
    const target = active ? 0.58 : 0.16;
    const current = rim.current.emissiveIntensity;
    if (Math.abs(current - target) <= 0.002 || motion.matches) {
      rim.current.emissiveIntensity = target;
    } else {
      rim.current.emissiveIntensity = MathUtils.damp(current, target, 14, Math.min(delta, 0.1));
      invalidate();
    }
  });

  return <group position={posterPosition(index)}>
    <mesh position-z={-0.025} castShadow receiveShadow>
      <boxGeometry args={[POSTER_WIDTH, POSTER_HEIGHT, 0.046]} />
      <meshStandardMaterial color="#342822" roughness={0.68} />
    </mesh>
    <mesh position-z={-0.001}>
      <planeGeometry args={[POSTER_WIDTH - 0.026, POSTER_HEIGHT - 0.026]} />
      <meshStandardMaterial ref={rim} color={edge} emissive={edge} emissiveIntensity={0.16} roughness={0.57} />
    </mesh>
    <mesh>
      <planeGeometry args={[POSTER_WIDTH - 0.056, POSTER_HEIGHT - 0.056]} />
      <meshStandardMaterial map={print} roughness={1} />
    </mesh>
  </group>;
}

export function AchievementWall({ highlight }: { highlight: string | undefined }) {
  return <group>
    {ACHIEVEMENTS.map((item, index) => <Poster key={item.id} item={item} index={index} active={highlight === item.id} />)}
  </group>;
}
