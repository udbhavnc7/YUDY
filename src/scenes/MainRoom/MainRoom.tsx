import { Suspense, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { EffectComposer, Selection, SelectiveBloom, ToneMapping } from '@react-three/postprocessing';
import { ToneMappingMode } from 'postprocessing';
import { ACESFilmicToneMapping, PCFSoftShadowMap, SRGBColorSpace, PointLight } from 'three';
import { CameraRig } from '../../systems/camera/CameraRig';
import { Studio } from '../../systems/lighting/Studio';
import { TableLamp } from '../../components/objects/TableLamp';

type Props = { proof: boolean; on: boolean; onToggle: () => void; onReady: () => void };

function Exposure({ proof, on, onToggle, onReady }: Props) {
  const fill = useMemo(() => new PointLight(0xffe6cc, 0.45), []);
  const bloomLights = useMemo(() => [fill], [fill]);
  return <Selection>
    <Studio />
    <primitive object={fill} position={[1.3, 2.2, 1.5]} />
    {proof ? <mesh position-y={0.45} rotation-y={0.38} castShadow receiveShadow>
      <boxGeometry args={[0.9, 0.9, 0.9]} /><meshStandardMaterial color="#888888" roughness={0.67} />
    </mesh> : <TableLamp on={on} onToggle={onToggle} onReady={onReady} />}
    <EffectComposer multisampling={2}>
      <SelectiveBloom lights={bloomLights} luminanceThreshold={0.60} luminanceSmoothing={0.4}
        intensity={0.17} mipmapBlur radius={0.54} />
      <ToneMapping mode={ToneMappingMode.ACES_FILMIC} />
    </EffectComposer>
  </Selection>;
}

export function MainRoom(props: Props) {
  return <Canvas frameloop="demand" dpr={[1, window.matchMedia('(pointer: coarse)').matches ? 1.25 : 1.5]}
    shadows={{ type: PCFSoftShadowMap }} aria-label={props.proof ? 'Grey box lighting proof' : 'A pleated linen table lamp on a turned wooden base'}
    gl={{ antialias: true, alpha: false, outputColorSpace: SRGBColorSpace, toneMapping: ACESFilmicToneMapping }}
    onCreated={({ gl }) => { gl.toneMappingExposure = 1; }}>
    <CameraRig />
    <Suspense fallback={null}><Exposure {...props} /></Suspense>
  </Canvas>;
}
