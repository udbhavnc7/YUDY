import { useLoader, useThree } from '@react-three/fiber';
import { useMemo } from 'react';
import { LinearFilter, LinearMipmapLinearFilter, RepeatWrapping } from 'three';
import { KTX2Loader } from 'three/examples/jsm/loaders/KTX2Loader.js';

// Each KTX2 records its transfer function: sRGB for colour, linear for normals.
export function useSurfaceMap(name: string, repeatX: number, repeatY: number) {
  const gl = useThree(s => s.gl);
  const texture = useLoader(KTX2Loader, '/textures/' + name + '.ktx2', loader => loader.detectSupport(gl));
  return useMemo(() => {
    texture.wrapS = texture.wrapT = RepeatWrapping;
    texture.repeat.set(repeatX, repeatY);
    texture.mipmaps = [];
    texture.generateMipmaps = true;
    texture.minFilter = LinearMipmapLinearFilter;
    texture.magFilter = LinearFilter;
    texture.anisotropy = Math.min(4, gl.capabilities.getMaxAnisotropy());
    texture.needsUpdate = true;
    return texture;
  }, [texture, repeatX, repeatY, gl]);
}
