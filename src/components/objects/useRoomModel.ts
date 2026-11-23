import { useEffect } from 'react';
import { useGLTF } from '@react-three/drei';
import { Mesh, type BufferGeometry, type Material } from 'three';
import { retainAsset } from '../../systems/lighting/retainAsset';

export function preloadRoomModel(path: string) {
  useGLTF.preload(path, false, true);
}

export function useRoomModel(path: string) {
  const { scene } = useGLTF(path, false, true);
  useEffect(() => retainAsset(scene, () => {
    useGLTF.clear(path);
    const geometries = new Set<BufferGeometry>();
    const materials = new Set<Material>();
    scene.traverse(object => {
      if (!(object instanceof Mesh)) return;
      geometries.add(object.geometry);
      for (const material of Array.isArray(object.material) ? object.material : [object.material]) materials.add(material);
    });
    geometries.forEach(geometry => geometry.dispose());
    materials.forEach(material => material.dispose());
  }), [scene, path]);
  return scene;
}
