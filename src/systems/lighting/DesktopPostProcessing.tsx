import { useMemo } from 'react';
import { EffectComposer, SelectiveBloom, ToneMapping } from '@react-three/postprocessing';
import { ToneMappingMode } from 'postprocessing';
import type { PointLight } from 'three';

export default function DesktopPostProcessing({ light }: { light: PointLight }) {
  const lights = useMemo(() => [light], [light]);
  return <EffectComposer multisampling={2}>
    <SelectiveBloom lights={lights} luminanceThreshold={0.60} luminanceSmoothing={0.4}
      intensity={0.17} mipmapBlur radius={0.54} />
    <ToneMapping mode={ToneMappingMode.ACES_FILMIC} />
  </EffectComposer>;
}
