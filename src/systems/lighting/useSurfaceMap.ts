import { useLoader, useThree } from '@react-three/fiber';
import { useMemo } from 'react';
import { LinearFilter, LinearMipmapLinearFilter, RepeatWrapping } from 'three';
import { KTX2Loader } from 'three/examples/jsm/loaders/KTX2Loader.js';

// Each KTX2 records its transfer function: sRGB for colour, linear for normals.
export function useSurfaceMaps(names: string[], repeatX: number, repeatY: number) {
  const gl = useThree(s => s.gl);
  const textures = useLoader(KTX2Loader, names.map(name => '/textures/' + name + '.ktx2'), loader => loader.detectSupport(gl));
  return useMemo(() => textures.map(texture => {
    texture.wrapS = texture.wrapT = RepeatWrapping;
    texture.repeat.set(repeatX, repeatY);
    texture.mipmaps = [];
    texture.generateMipmaps = true;
    texture.minFilter = LinearMipmapLinearFilter;
    texture.magFilter = LinearFilter;
    texture.anisotropy = Math.min(4, gl.capabilities.getMaxAnisotropy());
    texture.needsUpdate = true;
    return texture;
  }), [textures, repeatX, repeatY, gl]);
}

export function useSurfaceMap(name: string, repeatX: number, repeatY: number) {
  return useSurfaceMaps([name], repeatX, repeatY)[0];
}
