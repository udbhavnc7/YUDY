import { Canvas } from '@react-three/fiber';
import { CameraRig } from '../../systems/camera/CameraRig';
import { TerraceScene } from '../../scenes/Terrace/TerraceScene';

export function WorldCanvas() {
  return (
    <div className="absolute inset-0 w-full h-full">
      <Canvas
        dpr={[1, 1.8]}
        gl={{
          antialias: true,
          powerPreference: 'high-performance',
          alpha: false,
        }}
        camera={{
          position: [0, 2.2, 3.8],
          fov: 42,
          near: 0.1,
          far: 60,
        }}
      >
        <CameraRig />
        <TerraceScene />
      </Canvas>
    </div>
  );
}
