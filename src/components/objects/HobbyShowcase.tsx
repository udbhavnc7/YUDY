import { useEffect, useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Box3, Group, MathUtils, Mesh, MeshStandardMaterial, Quaternion, Vector3 } from 'three';
import { useRoomTextures } from '../../systems/lighting/useSurfaceMap';
import { FLOOR_PLANT, HANGING_PLANT, SHOWCASE_FACING, SHOWCASE_ITEMS, SHOWCASE_POSITION } from '../room/showcaseLayout';
import { preloadRoomModel, useRoomModel } from './useRoomModel';

const textures = ['showcase-plant', 'showcase-plant-normal', 'showcase-plant-arm', 'showcase-prop-normal'];
const haworthia = '/models/potted-haworthia.glb';
const pothos = '/models/trailing-pothos.glb';
const models = [haworthia, pothos, ...SHOWCASE_ITEMS.map(item => item.hobby.asset)];

type XYZ = [number, number, number];
type ModelProps = {
  asset: string;
  position: XYZ;
  rotation?: XYZ;
  scale: XYZ;
  surface?: Partial<Pick<MeshStandardMaterial, 'map' | 'normalMap' | 'roughnessMap' | 'metalnessMap' | 'aoMap'>>;
  colors?: Record<string, string>;
  active?: boolean;
};

function ShowcaseModel({ asset, position, rotation, scale, surface, colors, active = false }: ModelProps) {
  const scene = useRoomModel(asset);
  const root = useRef<Group>(null);
  const invalidate = useThree(s => s.invalidate);
  const motion = useMemo(() => matchMedia('(prefers-reduced-motion: reduce)'), []);
  const { model, materials } = useMemo(() => {
    const model = new Group();
    const object = scene.clone(true);
    const materials = new Map<MeshStandardMaterial, MeshStandardMaterial>();
    object.traverse(part => {
      if (!(part instanceof Mesh)) return;
      part.castShadow = part.receiveShadow = true;
      if (!(part.material instanceof MeshStandardMaterial)) return;
      const source = part.material;
      const color = colors?.[source.name];
      if (!surface && !color) return;
      let material = materials.get(source);
      if (!material) {
        material = source.clone();
        Object.assign(material, surface);
        if (color) material.color.set(color);
        if (surface?.normalMap && !surface.map) material.normalScale.setScalar(0.1);
        materials.set(source, material);
      }
      part.material = material;
    });
    if (rotation) object.rotation.set(...rotation);
    object.scale.set(...scale);
    const bounds = new Box3().setFromObject(object);
    const center = bounds.getCenter(new Vector3());
    object.position.set(-center.x, -bounds.min.y, -center.z);
    model.add(object);
    return { model, materials };
  }, [scene, rotation, scale, surface, colors]);

  useEffect(() => () => { materials.forEach(material => material.dispose()); }, [materials]);
  useEffect(() => { invalidate(); }, [active, invalidate]);
  useFrame((_, delta) => {
    if (!root.current) return;
    const target = active ? 0.03 : 0;
    const offset = root.current.position.y - position[1];
    const lift = motion.matches || Math.abs(offset - target) < 0.0005
      ? target : MathUtils.damp(offset, target, 12, Math.min(delta, 0.075));
    root.current.position.y = position[1] + lift;
    if (lift !== target) invalidate();
  });

  return <group ref={root} position={position}><primitive object={model} /></group>;
}

const hangingScale: XYZ = [1.47, 1.47, 1.47];
const pottedScale: XYZ = [1.52, 1.52, 1.52];
const pottedRotation: XYZ = [0, -0.6, 0];
const hangingRotation: XYZ = [0, 0.52, 0];
const hangingColors = { 'Matte ivory plant pot': '#956a51', 'Living foliage': '#345c2f', 'Green stems': '#4c6732' };
const propColors: Record<string, Record<string, string>> = {
  '/models/project-book.glb': { Cover: '#60463a', 'Front board': '#644539', 'Page edges': '#b59b76', Pages: '#d1b98b' },
  '/models/frying-pan.glb': { 'Satin galvanized steel': '#666968' },
};
const cordTop = new Vector3(0, 3.185 - HANGING_PLANT[1], 0);
const up = new Vector3(0, 1, 0);
const cords = [0.3, 2.40, 4.49].map(angle => {
  const rim = new Vector3(0.116 * Math.cos(angle), 0.119, 0.116 * Math.sin(angle));
  const direction = cordTop.clone().sub(rim);
  return { center: rim.lerp(cordTop, 0.5), length: direction.length(),
    rotation: new Quaternion().setFromUnitVectors(up, direction.normalize()) };
});

export function HobbyShowcase({ highlight }: { highlight?: string }) {
  models.forEach(preloadRoomModel);
  const [map, normalMap, arm, propNormal] = useRoomTextures(textures);
  const plantSurface = useMemo(() => ({ map, normalMap, roughnessMap: arm, aoMap: arm }), [map, normalMap, arm]);
  const propSurface = useMemo(() => ({ normalMap: propNormal }), [propNormal]);
  return <>
    <ShowcaseModel asset={haworthia} position={FLOOR_PLANT}
      rotation={pottedRotation} scale={pottedScale} surface={plantSurface} />
    <ShowcaseModel asset={pothos} position={HANGING_PLANT} rotation={hangingRotation}
      scale={hangingScale} colors={hangingColors} />
    <group position={HANGING_PLANT}>
      {cords.map(({ center, length, rotation }, index) => <mesh key={index} position={center} quaternion={rotation}>
        <cylinderGeometry args={[0.0029, 0.0029, length, 7]} />
        <meshStandardMaterial color="#ad9879" roughness={0.91} />
      </mesh>)}
      <mesh position={cordTop}>
        <cylinderGeometry args={[0.028, 0.031, 0.022, 16]} />
        <meshStandardMaterial color="#8a6a45" metalness={0.58} roughness={0.47} />
      </mesh>
    </group>
    <group position={SHOWCASE_POSITION} rotation-y={SHOWCASE_FACING}>
      {SHOWCASE_ITEMS.map(({ hobby, position, rotation, scale }) => <ShowcaseModel key={hobby.id}
        asset={hobby.asset} position={position} rotation={rotation} scale={scale}
        colors={propColors[hobby.asset]} surface={hobby.asset === '/models/project-book.glb' ? undefined : propSurface}
        active={highlight === hobby.id} />)}
    </group>
  </>;
}
