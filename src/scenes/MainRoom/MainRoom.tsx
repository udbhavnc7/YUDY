import { lazy, Suspense, useEffect, useMemo, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { Selection } from '@react-three/postprocessing';
import { ACESFilmicToneMapping, PCFSoftShadowMap, PointLight, SRGBColorSpace } from 'three';
import { TableLamp } from '../../components/objects/TableLamp';
import { LampCamera } from '../../systems/camera/LampCamera';
import { Studio } from '../../systems/lighting/Studio';
import { MobileTextures } from '../../systems/lighting/useSurfaceMap';

const DesktopPostProcessing = lazy(() => import('../../systems/lighting/DesktopPostProcessing'));
const mobileQuery = '(pointer: coarse), (max-width: 600px)';

type Props = { proof: boolean; on: boolean; onToggle: () => void; onReady: () => void };

function ProofScene({ proof, on, onToggle, onReady, mobile }: Props & { mobile: boolean }) {
  const fill = useMemo(() => new PointLight(0xffe6cc, 0.45), []);
  return <>
    <LampCamera />
    <Studio mobile={mobile} />
    <primitive object={fill} position={[1.3, 2.2, 1.5]} />
    <Selection>
      {proof ? <mesh position-y={0.45} rotation-y={0.38} castShadow receiveShadow>
        <boxGeometry args={[0.9, 0.9, 0.9]} />
        <meshStandardMaterial color="#888888" roughness={0.67} />
      </mesh> : <TableLamp on={on} onToggle={onToggle} onReady={onReady} mobile={mobile} />}
      {!mobile && <Suspense fallback={null}><DesktopPostProcessing light={fill} /></Suspense>}
    </Selection>
  </>;
}

export function MainRoom(props: Props) {
  const [mobile, setMobile] = useState(() => matchMedia(mobileQuery).matches);
  useEffect(() => {
    const query = matchMedia(mobileQuery);
    const update = () => setMobile(query.matches);
    query.addEventListener('change', update);
    return () => query.removeEventListener('change', update);
  }, []);
  return <Canvas frameloop="demand" dpr={[1, mobile ? 1.25 : 1.5]}
    shadows={mobile ? false : { type: PCFSoftShadowMap }}
    aria-label={props.proof ? 'Grey box lighting proof' : 'A pleated linen table lamp'}
    gl={{ antialias: true, alpha: false, outputColorSpace: SRGBColorSpace, toneMapping: ACESFilmicToneMapping }}
    onCreated={({ gl }) => { gl.toneMappingExposure = 1; }}>
    <MobileTextures.Provider value={mobile}>
      <Suspense fallback={null}><ProofScene {...props} mobile={mobile} /></Suspense>
    </MobileTextures.Provider>
  </Canvas>;
}
