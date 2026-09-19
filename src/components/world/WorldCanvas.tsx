import { Canvas } from '@react-three/fiber';
import { CameraRig } from '../../systems/camera/CameraRig';
import { TerraceScene } from '../../scenes/Terrace/TerraceScene';
import { WorkshopScene } from '../../scenes/Workshop/WorkshopScene';
import { useWorldStore } from '../../app/worldStore';

export function WorldCanvas() {
  const railNode = useWorldStore((s) => s.railNode);

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
          near: 0.05,
          far: 60,
        }}
      >
        <CameraRig />
        {railNode === 'terrace' ? <TerraceScene /> : <WorkshopScene />}
      </Canvas>
    </div>
  );
}
