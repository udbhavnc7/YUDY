import type { RoomView } from '../../systems/camera/CameraRig';
import { useLayoutEffect, useRef, type MutableRefObject } from 'react';
import { useFrame } from '@react-three/fiber';
import { DoubleSide, Group, Mesh, MeshStandardMaterial } from 'three';
import { useSurfaceMaps } from '../../systems/lighting/useSurfaceMap';
import { CHAIR_POSITION, SOFA_POSITION } from './layout';
import { preloadRoomModel, useRoomModel } from '../objects/useRoomModel';

const finishes = {
  chair: ['chair', 'chair-normal', 'chair-roughness'],
  sofa: ['sofa', 'sofa-normal', 'sofa-roughness'],
};

export function Seating({ kind, view }: {
  kind: 'chair' | 'sofa';
  view?: MutableRefObject<RoomView>;
}) {
  const pivot = useRef<Group>(null);
  const path = '/models/' + kind + '.glb';
  preloadRoomModel(path);
  const [map, normal, roughness] = useSurfaceMaps(finishes[kind], 1, 1);
  const scene = useRoomModel(path);
  useLayoutEffect(() => {
    scene.traverse(object => {
      if (!(object instanceof Mesh)) return;
      object.castShadow = object.receiveShadow = true;
      const material = object.material as MeshStandardMaterial;
      material.map = map;
      material.normalMap = normal;
      material.roughnessMap = roughness;
      material.normalScale.setScalar(0.7);
      material.roughness = 1;
      material.metalness = 0;
      material.side = DoubleSide;
      material.needsUpdate = true;
    });
  }, [scene, map, normal, roughness]);
  const chair = kind === 'chair';
  useFrame(() => {
    if (chair && pivot.current && view) pivot.current.rotation.y = view.current.chairYaw;
  });
  return <group ref={pivot} position={chair ? CHAIR_POSITION : SOFA_POSITION} scale={chair ? 0.74 : 1}>
    <primitive object={scene} />
  </group>;
}
