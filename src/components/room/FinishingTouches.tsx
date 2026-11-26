import { useEffect, useMemo, useRef, useState, type MutableRefObject } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import { CanvasTexture, CatmullRomCurve3, Group, MathUtils, Mesh, MeshStandardMaterial, PointLight,
  SRGBColorSpace, TubeGeometry, Vector3, type Material } from 'three';
import { PROFILE } from '../../data/profile';
import type { RoomView } from '../../systems/camera/CameraRig';
import { useRoomModel } from '../objects/useRoomModel';

const CHANDELIER = '/models/chandelier.glb';
const ROYAL_CHAIR = '/models/royal-chair.glb';
const DESK = '/models/corner-computer-desk.glb';
const MONITOR = '/models/monitor-27.glb';
const CURTAINS = '/models/window-curtains.glb';

function cloneLitModel(source: Group) {
  const clone = source.clone(true);
  clone.traverse(object => {
    if (object instanceof Mesh) object.castShadow = object.receiveShadow = true;
  });
  return clone;
}

export function CeilingChandelier({ mobile, view }: { mobile: boolean; view: MutableRefObject<RoomView> }) {
  const source = useRoomModel(CHANDELIER);
  const model = useMemo(() => cloneLitModel(source), [source]);
  const light = useRef<PointLight>(null);
  const glow = useRef(0);
  const reduced = useMemo(() => matchMedia('(prefers-reduced-motion: reduce)'), []);
  const invalidate = useThree(state => state.invalidate);
  useFrame((_, delta) => {
    // Keep a faint warm pool in the room, then bring the chandelier up as the camera reveals it.
    const target = 0.07 + 0.93 * MathUtils.smoothstep(view.current.progress, 0.45, 0.96);
    glow.current = reduced.matches || Math.abs(glow.current - target) < 0.001
      ? target : MathUtils.damp(glow.current, target, 4.8, Math.min(delta, 0.075));
    if (light.current) light.current.intensity = (mobile ? 2.2 : 4.5) * glow.current;
    if (glow.current !== target) invalidate();
  });
  return <>
    <group position={[0.1, 2.35, 0.25]} scale={0.8}><primitive object={model} /></group>
    <pointLight ref={light} position={[0.1, 2.72, 0.25]} color="#ffe2b7" intensity={0}
      distance={4.2} decay={2} />
  </>;
}

export function WindowCurtains() {
  const source = useRoomModel(CURTAINS);
  const model = useMemo(() => cloneLitModel(source), [source]);
  return <group position={[3.78, 0.68, -0.48]} rotation-y={-Math.PI / 2}>
    <primitive object={model} />
  </group>;
}

export function RoyalChair() {
  const source = useRoomModel(ROYAL_CHAIR);
  const model = useMemo(() => cloneLitModel(source), [source]);
  return <group position={[1.72, 0, 1.55]} rotation-y={Math.PI / 2}>
    <primitive object={model} />
  </group>;
}

function makeScreen() {
  const canvas = document.createElement('canvas');
  canvas.width = 768;
  canvas.height = 432;
  const context = canvas.getContext('2d');
  if (!context) throw new Error('Canvas is unavailable for the monitor display.');
  context.fillStyle = '#18251f';
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.fillStyle = '#24342c';
  context.fillRect(0, 0, canvas.width, 52);
  context.fillStyle = '#d9bc8b';
  context.fillRect(28, 23, 10, 10);
  context.font = '600 18px Segoe UI, sans-serif';
  context.fillText('YUDY  /  PORTFOLIO', 52, 34);
  context.fillStyle = '#d8cbb4';
  context.font = '500 17px Segoe UI, sans-serif';
  context.fillText(PROFILE.name, 44, 119);
  context.fillStyle = '#d9bc8b';
  context.font = '600 13px Segoe UI, sans-serif';
  context.fillText('A ROOM THAT TELLS THE STORY', 44, 152);
  context.fillStyle = '#b7c4b9';
  context.font = '16px Consolas, monospace';
  ['MainRoom.tsx', 'CameraRig.tsx', 'ProjectBooks.tsx'].forEach((line, index) => {
    const y = 217 + index * 43;
    context.fillStyle = '#33463c';
    context.fillRect(44, y - 22, 680, 31);
    context.fillStyle = '#d9bc8b';
    context.fillText(String(index + 1).padStart(2, '0'), 60, y);
    context.fillStyle = '#b7c4b9';
    context.fillText(line, 104, y);
    context.fillStyle = '#738a78';
    context.fillText('  // authored room system', 330, y);
  });
  const texture = new CanvasTexture(canvas);
  texture.colorSpace = SRGBColorSpace;
  return texture;
}

export function ComputerNook() {
  const deskSource = useRoomModel(DESK);
  const monitorSource = useRoomModel(MONITOR);
  const desk = useMemo(() => cloneLitModel(deskSource), [deskSource]);
  const screenMap = useMemo(makeScreen, []);
  const screenModel = useMemo(() => {
    const model = monitorSource.clone(true);
    let screenMaterial: MeshStandardMaterial | undefined;
    const owned = new Set<Material>();
    model.traverse(object => {
      if (!(object instanceof Mesh)) return;
      object.castShadow = object.receiveShadow = true;
      if (object.name !== 'Screen') return;
      const original = Array.isArray(object.material) ? object.material[0] : object.material;
      screenMaterial = original.clone() as MeshStandardMaterial;
      screenMaterial.map = screenMap;
      screenMaterial.emissiveMap = screenMap;
      screenMaterial.emissive.set('#ebcf9a');
      screenMaterial.emissiveIntensity = 0.62;
      screenMaterial.color.set('#ffffff');
      screenMaterial.needsUpdate = true;
      object.material = screenMaterial;
      owned.add(screenMaterial);
    });
    return { model, screenMaterial, owned };
  }, [monitorSource, screenMap]);
  const [powered, setPowered] = useState(true);
  const brightness = useRef(0);
  const screenGlow = useRef<PointLight>(null);
  const motion = useMemo(() => matchMedia('(prefers-reduced-motion: reduce)'), []);
  const invalidate = useThree(state => state.invalidate);
  const cable = useMemo(() => new TubeGeometry(new CatmullRomCurve3([
    new Vector3(0, 1.15, -0.08), new Vector3(0, 0.91, -0.12),
    new Vector3(0, 0.27, -0.31), new Vector3(0, 0.19, -0.39),
  ]), 18, 0.007, 6, false), []);
  useEffect(() => () => {
    screenModel.owned.forEach(material => material.dispose());
    screenMap.dispose();
    cable.dispose();
  }, [screenModel, screenMap, cable]);

  useFrame((_, delta) => {
    const target = powered ? 1 : 0;
    brightness.current = motion.matches || Math.abs(brightness.current - target) < 0.001
      ? target : MathUtils.damp(brightness.current, target, 5.4, Math.min(delta, 0.075));
    if (screenModel.screenMaterial) {
      screenModel.screenMaterial.color.setScalar(0.035 + brightness.current * 0.965);
      screenModel.screenMaterial.emissiveIntensity = brightness.current * 0.62;
    }
    if (screenGlow.current) screenGlow.current.intensity = brightness.current * 0.42;
    if (brightness.current !== target) invalidate();
  });

  return <group position={[3.28, 0, 1.55]} rotation-y={-Math.PI / 2}>
    <primitive object={desk} />
    <group position={[0, 0.75, -0.13]}><primitive object={screenModel.model} /></group>
    <pointLight ref={screenGlow} position={[0, 1.07, 0.06]} color="#bfd2a5"
      intensity={0} distance={1.8} decay={2} />
    <mesh position={[0.08, 0.772, 0.27]} castShadow>
      <boxGeometry args={[0.43, 0.018, 0.145]} />
      <meshStandardMaterial color="#2b302e" roughness={0.74} />
    </mesh>
    {Array.from({ length: 4 }, (_, row) => Array.from({ length: 9 }, (_, column) =>
      <mesh key={`${row}:${column}`} position={[-0.116 + column * 0.048, 0.786, 0.222 + row * 0.027]}>
        <boxGeometry args={[0.034, 0.007, 0.016]} />
        <meshStandardMaterial color={row === 3 && column === 8 ? '#b69b76' : '#778078'} roughness={0.72} />
      </mesh>))}
    <mesh position={[-0.26, 0.78, 0.26]} rotation-y={-0.12} castShadow>
      <boxGeometry args={[0.09, 0.018, 0.13]} />
      <meshStandardMaterial color="#313a35" roughness={0.55} />
    </mesh>
    <mesh geometry={cable}>
      <meshStandardMaterial color="#292927" roughness={0.82} />
    </mesh>
    <Html position={[0, 1.31, 0.15]} center zIndexRange={[28, 0]}>
      <div className="monitor-actions">
        <button className="coffee-action" type="button" aria-pressed={powered}
          onClick={event => { event.stopPropagation(); setPowered(value => !value); }}>
          {powered ? 'Switch display off' : 'Wake the display'}
        </button>
        <a className="coffee-action monitor-link" href="/work/">Open portfolio</a>
      </div>
    </Html>
  </group>;
}
