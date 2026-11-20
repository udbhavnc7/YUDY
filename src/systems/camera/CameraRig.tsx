import { useLayoutEffect } from 'react';
import { useThree } from '@react-three/fiber';
import { PerspectiveCamera, Vector3 } from 'three';

export function CameraRig() {
  const { camera, size, gl, invalidate } = useThree();
  useLayoutEffect(() => {
    const lens = camera as PerspectiveCamera;
    const aspect = size.width / size.height;
    const portrait = aspect < 1.14;
    const targetX = portrait ? 0 : -Math.min(0.95, 0.55 * aspect);
    const targetY = portrait ? 0.57 : 1.01;
    const distance = portrait ? Math.max(5.45, 3.35 / aspect) : 4.6;
    lens.fov = 33;
    lens.position.set(targetX, targetY + distance * 0.115, distance);
    lens.lookAt(targetX, targetY, 0);
    lens.updateProjectionMatrix();
    lens.updateMatrixWorld();
    // The label follows a point just beside the shade, or below its foot on a phone.
    const anchor = (portrait ? new Vector3(-0.82, 0, 0.2) : new Vector3(-1.3, 1.02, 0)).project(lens);
    const exhibit = gl.domElement.closest<HTMLElement>('.exhibit');
    exhibit?.style.setProperty('--label-x', ((1 + anchor.x) * 50) + '%');
    exhibit?.style.setProperty('--label-y', ((1 - anchor.y) * 50) + '%');
    invalidate();
  }, [camera, size, gl, invalidate]);
  return null;
}
