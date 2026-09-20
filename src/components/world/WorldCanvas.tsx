import { Canvas } from '@react-three/fiber';
import { CameraRig } from '../../systems/camera/CameraRig';
import { RoomScene } from '../../scenes/Room/RoomScene';
import * as THREE from 'three';

export function WorldCanvas() {
  return (
    <div className="absolute inset-0 w-full h-full">
      <Canvas
        dpr={[1, 1.5]}
        gl={{
          antialias: true,
          powerPreference: 'high-performance',
          alpha: false,
          preserveDrawingBuffer: false,
          stencil: false,
          depth: true,
          logarithmicDepthBuffer: true,
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
          gl.toneMappingExposure = 1.0;
          gl.shadowMap.type = THREE.PCFSoftShadowMap;
          gl.shadowMap.autoUpdate = true;
        }}
      >
        <color attach="background" args={['#050505']} />
        <fog attach="fog" args={['#050505', 2, 20]} />

        <CameraRig />
        <RoomScene />
      </Canvas>
    </div>
  );
}