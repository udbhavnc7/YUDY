import { useMemo } from 'react';
import { Environment } from '@react-three/drei';
import { Vector2 } from 'three';
import { useSurfaceMap } from './useSurfaceMap';

const relief = new Vector2(0.45, 0.45);
export function Studio() {
  const plaster = useSurfaceMap('plaster', 10, 5);
  const normal = useSurfaceMap('plaster-normal', 10, 5);
  // R3F 8 tags RGBA8 texture props as sRGB. Constructor parameters preserve the
  // KTX2 transfer functions for both the colour map and the linear normal map.
  const surface = useMemo(() => ({
    map: plaster, normalMap: normal, normalScale: relief,
  }), [plaster, normal]);
  return <>
    <color attach="background" args={['#1a1814']} />
    <Environment files="/environment/venice_sunset_1k.hdr" environmentIntensity={0.22} />
    <spotLight position={[-2.5, 3.7, 2.3]} intensity={11} color="#ffe0bc"
      angle={1.04} penumbra={1} castShadow shadow-mapSize={[1024, 1024]}
      shadow-camera-near={0.2} shadow-camera-far={12} shadow-bias={-0.0002} shadow-normalBias={0.008} />
    <mesh rotation-x={-Math.PI / 2} receiveShadow>
      <planeGeometry args={[20, 10]} /><meshStandardMaterial color="#62564a" args={[surface]} roughness={0.87} />
    </mesh>
    <mesh position={[0, 5, -1.1]} receiveShadow>
      <planeGeometry args={[20, 10]} /><meshStandardMaterial color="#504b46" args={[surface]} roughness={0.96} />
    </mesh>
  </>;
}
