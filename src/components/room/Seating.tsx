import { useLayoutEffect } from 'react';
import { useGLTF } from '@react-three/drei';
import { DoubleSide, Mesh, MeshStandardMaterial } from 'three';
import { useSurfaceMaps } from '../../systems/lighting/useSurfaceMap';
import { CHAIR_POSITION, SOFA_POSITION } from './layout';

export function Seating({ kind }: { kind: 'chair' | 'sofa' }) {
  const { scene } = useGLTF('/models/' + kind + '.glb', false, true);
  const [map, normal, roughness] = useSurfaceMaps([kind, kind + '-normal', kind + '-roughness'], 1, 1);
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
  return <primitive object={scene} position={chair ? CHAIR_POSITION : SOFA_POSITION}
    rotation-y={chair ? 0.57 : 0} scale={chair ? 0.74 : 1} />;
}
