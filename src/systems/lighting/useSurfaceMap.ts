import { useLoader, useThree } from '@react-three/fiber';
import { createContext, useContext, useEffect, useMemo } from 'react';
import { LinearFilter, LinearMipmapLinearFilter, RepeatWrapping } from 'three';
import { KTX2Loader } from 'three/examples/jsm/loaders/KTX2Loader.js';
import { retainAsset } from './retainAsset';

export const MobileTextures = createContext(false);

const mobileVariants = new Set([
  'boards', 'boards-normal', 'chair', 'chair-normal', 'plaster-normal', 'rug', 'rug-normal',
  'showcase-plant', 'showcase-plant-normal', 'showcase-plant-arm', 'sofa', 'sofa-normal',
]);

export function useRoomTextures(names: readonly string[]) {
  const gl = useThree(s => s.gl);
  const mobile = useContext(MobileTextures);
  const paths = names.map(name => '/textures/' + (mobile && mobileVariants.has(name) ? 'mobile/' : '') + name + '.ktx2');
  const textures = useLoader(KTX2Loader, paths, loader => loader.detectSupport(gl));
  useEffect(() => retainAsset(textures, () => {
    useLoader.clear(KTX2Loader, paths);
    textures.forEach(texture => texture.dispose());
  }), [textures]);
  return textures;
}

type Surface = readonly [name: string, repeatX: number, repeatY: number];

// Each KTX2 records its transfer function: sRGB for colour, linear for normals.
export function useTiledSurfaces(surfaces: readonly Surface[]) {
  const gl = useThree(s => s.gl);
  const textures = useRoomTextures(surfaces.map(surface => surface[0]));
  return useMemo(() => textures.map((texture, index) => {
    texture.wrapS = texture.wrapT = RepeatWrapping;
    texture.repeat.set(surfaces[index][1], surfaces[index][2]);
    texture.mipmaps = [];
    texture.generateMipmaps = true;
    texture.minFilter = LinearMipmapLinearFilter;
    texture.magFilter = LinearFilter;
    texture.anisotropy = Math.min(4, gl.capabilities.getMaxAnisotropy());
    texture.needsUpdate = true;
    return texture;
  }), [textures, surfaces, gl]);
}

export function useSurfaceMaps(names: readonly string[], repeatX: number, repeatY: number) {
  const surfaces = useMemo(() => names.map(name => [name, repeatX, repeatY] as const), [names, repeatX, repeatY]);
  return useTiledSurfaces(surfaces);
}
