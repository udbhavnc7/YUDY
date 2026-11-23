import { Suspense, useMemo, useRef, type MutableRefObject } from 'react';
import { Canvas } from '@react-three/fiber';
import { EffectComposer, Selection, SelectiveBloom, ToneMapping } from '@react-three/postprocessing';
import { ToneMappingMode } from 'postprocessing';
import { ACESFilmicToneMapping, PCFSoftShadowMap, SRGBColorSpace, PointLight } from 'three';
import { CameraRig, type RoomView } from '../../systems/camera/CameraRig';
import { Studio } from '../../systems/lighting/Studio';
import { AchievementWall } from '../../components/objects/AchievementWall';
import { ProjectBooks } from '../../components/objects/ProjectBooks';
import { HobbyShowcase } from '../../components/objects/HobbyShowcase';
import type { ProjectType } from '../../data/projects';
import { TableLamp } from '../../components/objects/TableLamp';
import { RoomShell } from '../../components/room/RoomShell';
import { LAMP_POSITION, LAMP_SCALE } from '../../components/room/layout';
import { Environment } from '@react-three/drei';

type Props = {
  proof: boolean;
  isolated: boolean;
  onIntroChange: (intro: boolean) => void;
  onEducationChange: (education: boolean) => void;
  onGalleryChange: (gallery: boolean) => void;
  highlight?: string;
  onShelfChange: (shelf: ProjectType | undefined) => void;
  bookHighlight?: string;
  openBook?: string;
  onShowcaseChange: (showcase: boolean) => void;
  hobbyHighlight?: string;
  on: boolean;
  onToggle: () => void;
  onReady: () => void;
};

function Exposure({ proof, isolated, on, onToggle, onReady, view, highlight, bookHighlight, openBook, hobbyHighlight }: Props & { view: MutableRefObject<RoomView> }) {
  const fill = useMemo(() => new PointLight(0xffe6cc, 0.45), []);
  const bloomLights = useMemo(() => [fill], [fill]);
  return <Selection>
    {isolated ? <Studio /> : <>
      <color attach="background" args={['#1a1814']} />
      <Environment files="/environment/venice_sunset_1k.hdr" environmentIntensity={0.59} />
      <directionalLight position={[3.64, 2.45, 0.8]} color="#e6e4da" intensity={0.78} castShadow
        shadow-mapSize={[1024, 1024]} shadow-camera-left={-4.2} shadow-camera-right={4.2}
        shadow-camera-top={3.3} shadow-camera-bottom={-3.3} shadow-camera-far={12}
        shadow-normalBias={0.025} shadow-bias={-0.00022} />
      <pointLight position={[3.44, 1.93, -0.56]} intensity={13} color="#ffedcf" />
      <directionalLight position={[-1.7, 2.7, 5.8]} intensity={0.23} color="#f0dcca" />
      <RoomShell view={view} />
      <AchievementWall highlight={highlight} />
      <ProjectBooks highlight={bookHighlight} open={openBook} />
      <Suspense fallback={null}><HobbyShowcase highlight={hobbyHighlight} /></Suspense>
    </>}
    <primitive object={fill} position={[1.3, 2.2, 1.5]} />
    {proof ? <mesh position-y={0.45} rotation-y={0.38} castShadow receiveShadow>
      <boxGeometry args={[0.9, 0.9, 0.9]} /><meshStandardMaterial color="#888888" roughness={0.67} />
    </mesh> : <group position={isolated ? [0, 0, 0] : LAMP_POSITION} scale={isolated ? 1 : LAMP_SCALE}>
      <TableLamp on={on} onToggle={onToggle} onReady={onReady} inRoom={!isolated} />
    </group>}
    <EffectComposer multisampling={2}>
      <SelectiveBloom lights={bloomLights} luminanceThreshold={0.60} luminanceSmoothing={0.4}
        intensity={0.17} mipmapBlur radius={0.54} />
      <ToneMapping mode={ToneMappingMode.ACES_FILMIC} />
    </EffectComposer>
  </Selection>;
}

export function MainRoom(props: Props) {
  const view = useRef<RoomView>({ chairYaw: 0 });
  return <Canvas frameloop="demand" dpr={[1, window.matchMedia('(pointer: coarse)').matches ? 1.25 : 1.5]}
    shadows={{ type: PCFSoftShadowMap }} aria-label={props.proof ? 'Grey box lighting proof' : props.isolated ? 'A pleated linen table lamp' : 'A room with a lamp, chair, sofa and two shelf bays'}
    gl={{ antialias: true, alpha: false, outputColorSpace: SRGBColorSpace, toneMapping: ACESFilmicToneMapping }}
    onCreated={({ gl }) => { gl.toneMappingExposure = 1; }}>
    <CameraRig isolated={props.isolated} view={view}
      onIntroChange={props.onIntroChange} onEducationChange={props.onEducationChange}
      onGalleryChange={props.onGalleryChange} onShelfChange={props.onShelfChange} onShowcaseChange={props.onShowcaseChange} />
    <Suspense fallback={null}><Exposure {...props} view={view} /></Suspense>
  </Canvas>;
}
