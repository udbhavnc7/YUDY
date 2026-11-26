import { lazy, Suspense, useEffect, useLayoutEffect, useMemo, useRef, useState, type MutableRefObject, type ReactNode } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { Selection } from '@react-three/postprocessing';
import { ACESFilmicToneMapping, PCFSoftShadowMap, SRGBColorSpace, PointLight } from 'three';
import { CameraRig, type ClosingState, type RoomView } from '../../systems/camera/CameraRig';
import { Studio } from '../../systems/lighting/Studio';
import { MobileTextures } from '../../systems/lighting/useSurfaceMap';
import { AchievementWall } from '../../components/objects/AchievementWall';
import { ProjectBooks } from '../../components/objects/ProjectBooks';
import { HobbyShowcase } from '../../components/objects/HobbyShowcase';
import type { ProjectType } from '../../data/projects';
import { TableLamp } from '../../components/objects/TableLamp';
import { RoomShell, Rug } from '../../components/room/RoomShell';
import { Seating } from '../../components/room/Seating';
import { CoffeeTable } from '../../components/room/CoffeeTable';
import { ReadingCorner } from '../../components/room/ReadingCorner';
import { ROOM_ASSET } from './roomAssets';
import { LAMP_POSITION, LAMP_SCALE } from '../../components/room/layout';
import { Environment, useProgress } from '@react-three/drei';

const DesktopPostProcessing = lazy(() => import('../../systems/lighting/DesktopPostProcessing'));

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
  onClosingChange: (closing: ClosingState) => void;
  hobbyHighlight?: string;
  on: boolean;
  onToggle: () => void;
  onReady: () => void;
};

function AssetReady({ view, asset, children }: { view: MutableRefObject<RoomView>; asset: number; children: ReactNode }) {
  const invalidate = useThree(state => state.invalidate);
  useLayoutEffect(() => {
    const room = view.current;
    room.readyAssets |= asset;
    invalidate();
    return () => { room.readyAssets &= ~asset; invalidate(); };
  }, [view, asset, invalidate]);
  return <>{children}</>;
}

function SceneAsset({ view, asset, children }: { view: MutableRefObject<RoomView>; asset: number; children: ReactNode }) {
  return <Suspense fallback={null}>
    <AssetReady view={view} asset={asset}>{children}</AssetReady>
  </Suspense>;
}

function Exposure({ proof, isolated, on, onToggle, onReady, view, highlight, bookHighlight, openBook, hobbyHighlight, assets, mobile }:
  Props & { view: MutableRefObject<RoomView>; assets: number; mobile: boolean }) {
  const fill = useMemo(() => new PointLight(0xffe6cc, 0.45), []);
  return <Selection>
    {isolated ? <Suspense fallback={null}><Studio /></Suspense> : <>
      <color attach="background" args={['#1a1814']} />
      <Suspense fallback={null}>
        <Environment files={mobile ? '/environment/venice_sunset_512.hdr' : '/environment/venice_sunset_1k.hdr'} environmentIntensity={0.59} />
      </Suspense>
      <directionalLight position={[3.64, 2.45, 0.8]} color="#e6e4da" intensity={0.78} castShadow={!mobile}
        shadow-mapSize={[1024, 1024]} shadow-camera-left={-4.2} shadow-camera-right={4.2}
        shadow-camera-top={3.3} shadow-camera-bottom={-3.3} shadow-camera-far={12}
        shadow-normalBias={0.025} shadow-bias={-0.00022} />
      <pointLight position={[3.44, 1.93, -0.56]} intensity={13} color="#ffedcf" />
      <directionalLight position={[-1.7, 2.7, 5.8]} intensity={0.23} color="#f0dcca" />
      <Suspense fallback={null}><RoomShell assets={assets} /></Suspense>
      {!!(assets & ROOM_ASSET.rug) && <SceneAsset view={view} asset={ROOM_ASSET.rug}><Rug /></SceneAsset>}
      {!!(assets & ROOM_ASSET.chair) && <SceneAsset view={view} asset={ROOM_ASSET.chair}><Seating kind="chair" view={view} /></SceneAsset>}
      {!!(assets & ROOM_ASSET.sofa) && <SceneAsset view={view} asset={ROOM_ASSET.sofa}><Seating kind="sofa" /></SceneAsset>}
      {!!(assets & ROOM_ASSET.coffeeTable) && <SceneAsset view={view} asset={ROOM_ASSET.coffeeTable}><CoffeeTable /></SceneAsset>}
      {!!(assets & ROOM_ASSET.readingCorner) && <SceneAsset view={view} asset={ROOM_ASSET.readingCorner}><ReadingCorner /></SceneAsset>}
      {!!(assets & ROOM_ASSET.posters) && <SceneAsset view={view} asset={ROOM_ASSET.posters}><AchievementWall highlight={highlight} /></SceneAsset>}
      {!!(assets & ROOM_ASSET.books) && <SceneAsset view={view} asset={ROOM_ASSET.books}><ProjectBooks highlight={bookHighlight} open={openBook} /></SceneAsset>}
      {!!(assets & ROOM_ASSET.showcase) && <SceneAsset view={view} asset={ROOM_ASSET.showcase}><HobbyShowcase highlight={hobbyHighlight} /></SceneAsset>}
    </>}
    <primitive object={fill} position={[1.3, 2.2, 1.5]} />
    {proof ? <mesh position-y={0.45} rotation-y={0.38} castShadow receiveShadow>
      <boxGeometry args={[0.9, 0.9, 0.9]} /><meshStandardMaterial color="#888888" roughness={0.67} />
    </mesh> : <Suspense fallback={null}>
      <group position={isolated ? [0, 0, 0] : LAMP_POSITION} scale={isolated ? 1 : LAMP_SCALE}>
        <TableLamp on={on} onToggle={onToggle} onReady={onReady} inRoom={!isolated} mobile={mobile} />
      </group>
    </Suspense>}
    {!mobile && <Suspense fallback={null}><DesktopPostProcessing light={fill} /></Suspense>}
  </Selection>;
}

const mobileQuery = '(pointer: coarse), (max-width: 600px)';

function RoomScene({ mobile, ...props }: Props & { mobile: boolean }) {
  const view = useRef<RoomView>({ chairYaw: 0, readyAssets: 0 });
  const [assets, setAssets] = useState(0);
  const completedLoads = useProgress(progress => progress.loaded);
  const invalidate = useThree(state => state.invalidate);
  // The demand loop can stop before delayed texture and mesh requests finish.
  useLayoutEffect(() => { invalidate(); }, [completedLoads, invalidate]);
  return <>
    <CameraRig isolated={props.isolated} mobile={mobile} view={view} onAssetsChange={setAssets}
      onIntroChange={props.onIntroChange} onEducationChange={props.onEducationChange}
      onGalleryChange={props.onGalleryChange} onShelfChange={props.onShelfChange}
      onShowcaseChange={props.onShowcaseChange} onClosingChange={props.onClosingChange} />
    <Exposure {...props} view={view} assets={assets} mobile={mobile} />
  </>;
}

export function MainRoom(props: Props) {
  const [compact, setCompact] = useState(() => matchMedia(mobileQuery).matches);
  useEffect(() => {
    const query = matchMedia(mobileQuery);
    const update = () => setCompact(query.matches);
    query.addEventListener('change', update);
    return () => query.removeEventListener('change', update);
  }, []);
  const mobile = compact && !props.isolated;
  return <Canvas frameloop="demand" dpr={[1, mobile ? 1.25 : 1.5]}
    shadows={mobile ? false : { type: PCFSoftShadowMap }} aria-label={props.proof ? 'Grey box lighting proof' : props.isolated ? 'A pleated linen table lamp' : 'A room with a lamp, chair, sofa and two shelf bays'}
    gl={{ antialias: true, alpha: false, outputColorSpace: SRGBColorSpace, toneMapping: ACESFilmicToneMapping }}
    onCreated={({ gl }) => { gl.toneMappingExposure = 1; }}>
    <MobileTextures.Provider value={mobile}><RoomScene {...props} mobile={mobile} /></MobileTextures.Provider>
  </Canvas>;
}
