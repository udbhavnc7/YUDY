import { useLayoutEffect, useMemo } from 'react';
import { useThree } from '@react-three/fiber';
import { PerspectiveCamera, Vector3 } from 'three';

export function LampCamera() {
  const { camera: activeCamera, size, gl } = useThree();
  const camera = activeCamera as PerspectiveCamera;
  const anchor = useMemo(() => new Vector3(), []);
  useLayoutEffect(() => {
    const aspect = size.width / Math.max(size.height, 1);
    const portrait = aspect < 1.14;
    const lookY = portrait ? 0.57 : 1.01;
    const distance = portrait ? Math.max(5.45, 3.35 / aspect) : 4.6;
    camera.position.set(0, lookY + distance * 0.115, distance);
    camera.fov = 33;
    camera.lookAt(0, lookY, 0);
    camera.updateProjectionMatrix();
    anchor.set(portrait ? -0.82 : -1.3, portrait ? 0 : 1.02, portrait ? 0.2 : 0).project(camera);
    const host = gl.domElement.closest<HTMLElement>('.exhibit');
    host?.style.setProperty('--label-x', (1 + anchor.x) * 50 + '%');
    host?.style.setProperty('--label-y', (1 - anchor.y) * 50 + '%');
  }, [camera, size.width, size.height, gl, anchor]);
  return null;
}
