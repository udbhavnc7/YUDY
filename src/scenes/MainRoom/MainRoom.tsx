import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { ACESFilmicToneMapping, PCFSoftShadowMap, SRGBColorSpace } from 'three';
import { CameraRig } from '../../systems/camera/CameraRig';
import { Studio } from '../../systems/lighting/Studio';

export function MainRoom() {
  return <Canvas frameloop="demand" dpr={[1, 1.5]} shadows={{ type: PCFSoftShadowMap }}
    gl={{ antialias: true, alpha: false, outputColorSpace: SRGBColorSpace, toneMapping: ACESFilmicToneMapping }}
    onCreated={({ gl }) => { gl.toneMappingExposure = 1; }}>
    <CameraRig />
    <Suspense fallback={null}>
      <Studio />
      <mesh position-y={0.45} rotation-y={0.38} castShadow receiveShadow>
        <boxGeometry args={[0.9, 0.9, 0.9]} /><meshStandardMaterial color="#888888" roughness={0.67} />
      </mesh>
    </Suspense>
  </Canvas>;
}
