import { useLayoutEffect } from 'react';
import { useThree } from '@react-three/fiber';
import { PerspectiveCamera } from 'three';

export function CameraRig() {
  const { camera, size, invalidate } = useThree();
  useLayoutEffect(() => {
    const lens = camera as PerspectiveCamera;
    const aspect = size.width / size.height;
    const portrait = aspect < 0.95;
    const targetX = portrait ? 0 : -Math.min(0.95, 0.55 * aspect);
    const targetY = portrait ? 0.72 : 1.01;
    const distance = portrait ? Math.max(5.1, 2.9 / aspect) : 4.6;
    lens.fov = 33;
    lens.position.set(targetX, targetY + distance * 0.115, distance);
    lens.lookAt(targetX, targetY, 0);
    lens.updateProjectionMatrix();
    invalidate();
  }, [camera, size, invalidate]);
  return null;
}
