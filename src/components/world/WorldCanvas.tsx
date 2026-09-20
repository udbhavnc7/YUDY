import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment, ContactShadows } from '@react-three/drei';
import { CameraRig } from '../../systems/camera/CameraRig';
import { RoomScene } from '../../scenes/Room/RoomScene';
import { useWorldStore } from '../../app/worldStore';
import * as THREE from 'three';

export function WorldCanvas() {
  return (
    <div className="absolute inset-0 w-full h-full">
      <Canvas
        dpr={[1, 1.25]}
        gl={{
          antialias: true,
          powerPreference: 'high-performance',
          alpha: false,
          preserveDrawingBuffer: false,
          stencil: false,
          depth: true,
        }}
        camera={{
          position: [0, 1.2, 2.8],
          fov: 35,
          near: 0.05,
          far: 50,
        }}
        shadows={{
          type: THREE.PCFSoftShadowMap,
          autoUpdate: true,
          needsUpdate: true,
        }}
        onCreated={({ gl }) => {
          gl.outputColorSpace = THREE.SRGBColorSpace;
          gl.toneMapping = THREE.ACESFilmicToneMapping;
          gl.toneMappingExposure = 1.15;
          gl.shadowMap.type = THREE.PCFSoftShadowMap;
          gl.shadowMap.autoUpdate = true;
        }}
        onPointerMissed={() => useWorldStore.getState().setSelected(null)}
      >
        <color attach="background" args={['#050505']} />
        <fog attach="fog" args={['#050505', 2, 20]} />

        <Suspense fallback={null}>
          <CameraRig />
          <Environment files="/hdr/venice_sunset_1k.hdr" />
          <RoomScene />
          <ContactShadows position={[0, 0.02, 0]} scale={12} far={3.2} resolution={512} blur={2.2} opacity={0.55} color="#000000" />
        </Suspense>
      </Canvas>
    </div>
  );
}
