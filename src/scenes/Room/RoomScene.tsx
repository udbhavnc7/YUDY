import { useRef, useMemo, useEffect, useState, useCallback } from 'react';
import { useFrame, ThreeEvent } from '@react-three/fiber';
import { useTexture, Html, useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { useScrollStore } from '../../systems/scroll/ScrollStore';
import { useWorldStore } from '../../app/worldStore';
import { ACHIEVEMENTS, Achievement } from '../../data/achievements';
import { PROJECTS, Project } from '../../data/projects';
import { EDUCATION } from '../../data/education';
import { HOBBIES } from '../../data/hobbies';
import { PROFILE } from '../../data/profile';

/* ---------------------------------- utils --------------------------------- */

function easeInOutSine(x: number) {
  return -(Math.cos(Math.PI * x) - 1) / 2;
}

function inRange(p: number, a: number, b: number) {
  return p >= a && p < b;
}

const STATUS_COLORS: Record<string, string> = {
  winner: '#E3B25C',
  top: '#5B8BD0',
  participated: '#50C878',
};

const PROJECT_MAP: Record<string, Project> = Object.fromEntries(PROJECTS.map((p) => [p.id, p]));

/** Varied spine palette so books read as individuals, not one brown block. */
const SPINE_COLORS = [
  '#8E2F32', '#2F4A7A', '#2D6A4F', '#B07A3B', '#5B3A8E',
  '#A6493B', '#33687A', '#7A6A2F', '#4A4E69', '#94425F',
  '#3B7A5E', '#8A5A2B',
];

function spineColor(id: string): string {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0;
  return SPINE_COLORS[h % SPINE_COLORS.length];
}

function wrapLines(g: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
  const words = text.split(' ');
  const lines: string[] = [];
  let line = '';
  for (const w of words) {
    const test = line ? `${line} ${w}` : w;
    if (g.measureText(test).width > maxWidth && line) {
      lines.push(line);
      line = w;
    } else {
      line = test;
    }
  }
  if (line) lines.push(line);
  return lines.slice(0, 3);
}

/** Rendered poster face: real title / event / year, status-colour masthead. */
function makePosterTexture(ach: Achievement): THREE.CanvasTexture {
  const glow = STATUS_COLORS[ach.status] || '#5B8BD0';
  const c = document.createElement('canvas');
  c.width = 512;
  c.height = 340;
  const g = c.getContext('2d')!;

  g.fillStyle = '#171310';
  g.fillRect(0, 0, 512, 340);
  g.fillStyle = glow;
  g.fillRect(0, 0, 512, 16);

  g.fillStyle = '#F3EAD8';
  g.font = '600 46px Georgia, serif';
  const titleLines = wrapLines(g, ach.title, 440);
  titleLines.forEach((ln, i) => g.fillText(ln, 36, 96 + i * 54));

  g.fillStyle = glow;
  g.font = '600 30px Georgia, serif';
  const ey = 96 + titleLines.length * 54 + 6;
  g.fillText(ach.event, 36, Math.min(ey, 250));

  g.fillStyle = 'rgba(243,234,216,0.55)';
  g.font = '24px monospace';
  g.fillText(String(ach.year), 36, 306);
  g.fillStyle = glow;
  g.font = '600 24px monospace';
  g.fillText(ach.status.toUpperCase(), 512 - 36 - g.measureText(ach.status.toUpperCase()).width, 306);

  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  return tex;
}

/* ------------------------- anchored detail panel -------------------------- */

function DetailPanel({ title, subtitle, body, links, color }: {
  title: string; subtitle?: string; body?: string; links?: { label: string; href: string }[]; color: string;
}) {
  const setSelected = useWorldStore((s) => s.setSelected);
  return (
    <Html position={[0, 0.15, 0.9]} center distanceFactor={7} zIndexRange={[10, 20]}>
      <div
        className="w-64 rounded-2xl border bg-[#0E1726]/92 px-5 py-4 shadow-[0_16px_48px_rgba(0,0,0,0.6)] backdrop-blur-xl"
        style={{ borderColor: `${color}66`, pointerEvents: 'auto' }}
        onPointerDown={(e) => e.stopPropagation()}
      >
        <div className="mb-1 flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full" style={{ background: color }} />
          <span className="font-mono text-[9px] uppercase tracking-[0.2em]" style={{ color: `${color}B3` }}>
            {subtitle}
          </span>
          <button
            onClick={() => setSelected(null)}
            aria-label="Close panel"
            className="ml-auto font-mono text-xs text-[#FBF6EC]/40 hover:text-[#FBF6EC]"
          >
            ×
          </button>
        </div>
        <p className="font-display text-base font-semibold leading-snug text-[#FBF6EC]">{title}</p>
        {body && <p className="mt-1.5 font-sans text-xs leading-relaxed text-[#FBF6EC]/70">{body}</p>}
        {links && links.length > 0 && (
          <div className="mt-2 flex gap-3">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-[11px] underline underline-offset-2"
                style={{ color }}
                onPointerDown={(e) => e.stopPropagation()}
              >
                {l.label}
              </a>
            ))}
          </div>
        )}
      </div>
    </Html>
  );
}

function HoverTag({ text, color }: { text: string; color: string }) {
  return (
    <Html position={[0, 0.62, 0]} center distanceFactor={8} zIndexRange={[10, 20]} pointerEvents="none">
      <div
        className="whitespace-nowrap rounded-full border bg-[#0E1726]/85 px-3 py-1 font-mono text-[10px] tracking-wider text-[#FBF6EC]"
        style={{ borderColor: `${color}88` }}
      >
        <span style={{ color }}>{'● '}</span>
        {text}
      </div>
    </Html>
  );
}

/* ----------------------------------- lamp ---------------------------------- */

export function Lamp({ onIntroComplete }: { onIntroComplete: () => void }) {
  const scrollProgress = useScrollStore((s) => s.scrollProgress);
  const setHovered = useWorldStore((s) => s.setHovered);
  const setSelected = useWorldStore((s) => s.setSelected);
  const selected = useWorldStore((s) => s.selected);

  const lampGroupRef = useRef<THREE.Group>(null);
  const lightRef = useRef<THREE.PointLight>(null);
  const spotRef = useRef<THREE.SpotLight>(null);

  const [lampOn, setLampOn] = useState(false);
  const [introPlayed, setIntroPlayed] = useState(false);

  const baseMat = useMemo(
    () => new THREE.MeshStandardMaterial({ color: '#3d3d45', roughness: 0.25, metalness: 0.85 }), []
  );
  // Woven shade: fabric weave tinted warm; the glow still comes from emissive.
  const shadeFabric = usePBRSet('fabric/Fabric025_1K-JPG', 2, 1, 0.6, '#c8a878');
  const shadeMat = useMemo(() => {
    shadeFabric.side = THREE.DoubleSide;
    return shadeFabric;
  }, [shadeFabric]);
  const shadeInnerMat = useMemo(
    () => new THREE.MeshStandardMaterial({
      color: '#6a4a28', roughness: 0.5, metalness: 0.05,
      emissive: new THREE.Color('#ffd47a'), emissiveIntensity: 0,
    }), []
  );
  const bulbMat = useMemo(
    () => new THREE.MeshBasicMaterial({ color: '#fff8e7', transparent: true, opacity: 0 }), []
  );
  const bulbGlowMat = useMemo(
    () => new THREE.MeshBasicMaterial({ color: '#ffdf9e', transparent: true, opacity: 0 }), []
  );

  const bulbRef = useRef<THREE.Mesh>(null);
  const shadeRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  const baseRef = useRef<THREE.Mesh>(null);

  useEffect(() => {
    if (lampGroupRef.current) lampGroupRef.current.layers.set(1);
  }, []);

  useEffect(() => {
    if (scrollProgress > 0.02 && !lampOn) setLampOn(true);
  }, [scrollProgress, lampOn]);

  useEffect(() => {
    if (lampOn && !introPlayed) {
      const timer = setTimeout(() => { setIntroPlayed(true); onIntroComplete(); }, 1500);
      return () => clearTimeout(timer);
    }
  }, [lampOn, introPlayed, onIntroComplete]);

  useFrame((state, delta) => {
    if (!lampGroupRef.current) return;
    if (lampOn && lightRef.current) {
      const targetIntensity = 4.0;
      lightRef.current.intensity += (targetIntensity - lightRef.current.intensity) * delta * 3;
      if (spotRef.current) {
        spotRef.current.intensity += (targetIntensity * 0.5 - spotRef.current.intensity) * delta * 3;
      }
      if (bulbRef.current && bulbRef.current.material instanceof THREE.MeshBasicMaterial) {
        bulbRef.current.material.opacity += (0.95 - bulbRef.current.material.opacity) * delta * 4;
      }
      if (glowRef.current && glowRef.current.material instanceof THREE.MeshBasicMaterial) {
        glowRef.current.material.opacity += (0.28 - glowRef.current.material.opacity) * delta * 3;
      }
      if (shadeRef.current && shadeRef.current.material instanceof THREE.MeshStandardMaterial) {
        shadeRef.current.material.emissiveIntensity = Math.min(lightRef.current.intensity / 2.0, 2.0) * 0.8;
      }
    }
    lampGroupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.8) * 0.005;
  });

  const active = inRange(scrollProgress, 0.0, 0.10);
  const handleOver = (e: ThreeEvent<PointerEvent>) => {
    if (!active) return;
    e.stopPropagation();
    document.body.style.cursor = 'pointer';
    setHovered('lamp');
  };
  const handleOut = (e: ThreeEvent<PointerEvent>) => {
    if (!active) return;
    e.stopPropagation();
    document.body.style.cursor = 'default';
    setHovered(null);
  };
  const handleClick = (e: ThreeEvent<MouseEvent>) => {
    if (!active) return;
    e.stopPropagation();
    setSelected('lamp');
  };

  return (
    <group ref={lampGroupRef} position={[0, 0, 0]} onPointerOver={handleOver} onPointerOut={handleOut} onClick={handleClick}>
      <mesh ref={baseRef} position={[0, 0.35, 0]} receiveShadow castShadow>
        <cylinderGeometry args={[0.18, 0.22, 0.7, 24]} />
        <primitive object={baseMat} attach="material" />
      </mesh>
      <mesh position={[0, 0.7, 0]} receiveShadow castShadow>
        <torusGeometry args={[0.2, 0.015, 8, 24]} />
        <primitive object={baseMat} attach="material" />
      </mesh>
      <mesh position={[0, 1.1, 0]} receiveShadow castShadow>
        <cylinderGeometry args={[0.025, 0.03, 0.4, 12]} />
        <primitive object={baseMat} attach="material" />
      </mesh>
      <mesh ref={shadeRef} position={[0, 1.65, 0]} receiveShadow castShadow>
        <cylinderGeometry args={[0.12, 0.35, 0.45, 24, 1, true]} />
        <primitive object={shadeInnerMat} attach="material" />
      </mesh>
      <mesh position={[0, 1.65, 0]} receiveShadow castShadow>
        <cylinderGeometry args={[0.125, 0.36, 0.46, 24, 1, true]} />
        <primitive object={shadeMat} attach="material" />
      </mesh>
      <mesh ref={bulbRef} position={[0, 1.52, 0]}>
        <sphereGeometry args={[0.045, 16, 16]} />
        <primitive object={bulbMat} attach="material" />
      </mesh>
      <mesh ref={glowRef} position={[0, 1.52, 0]}>
        <sphereGeometry args={[0.11, 16, 16]} />
        <primitive object={bulbGlowMat} attach="material" />
      </mesh>
      <pointLight ref={lightRef} position={[0, 1.52, 0]} color="#ffd47a" intensity={0} distance={9} decay={2} castShadow={false} />
      <spotLight ref={spotRef} position={[0, 1.65, 0]} color="#ffd47a" intensity={0} distance={5} angle={Math.PI / 3.5} penumbra={0.5} decay={2} castShadow={false} />
      {selected === 'lamp' && (
        <DetailPanel title={PROFILE.name} subtitle="Introduction" body={`${PROFILE.title} · ${PROFILE.location}. ${PROFILE.profile}`} color="#E3B25C" />
      )}
    </group>
  );
}

export function IntroText({ visible }: { visible: boolean }) {
  const scrollProgress = useScrollStore((s) => s.scrollProgress);
  if (!visible || scrollProgress < 0.03) return null;
  const opacity = Math.min(1, (scrollProgress - 0.03) / 0.04);
  return (
    <Html fullscreen pointerEvents="none" zIndexRange={[20, 30]}>
      <div className="pointer-events-none fixed inset-0 z-20 flex items-center justify-center" style={{ opacity }}>
        <div className="px-6 text-center">
          <h1 className="font-display text-4xl font-light leading-tight tracking-[0.15em] text-[#FBF6EC]/90 sm:text-6xl md:text-7xl">Udbhav NC</h1>
          <p className="mt-3 font-sans text-sm uppercase tracking-[0.2em] text-[#E3B25C]/70 sm:text-base md:text-lg">Computer Science & Data Science</p>
          <p className="mt-2 font-mono text-xs tracking-wider text-[#FBF6EC]/40">St. Joseph Engineering College, Mangaluru</p>
          <p className="mt-4 font-mono text-[10px] tracking-wider text-[#FBF6EC]/30">Second-year student building prototypes outside coursework</p>
        </div>
      </div>
    </Html>
  );
}

/* ------------------------------- room shell -------------------------------- */

/**
 * Real scanned PBR set (ambientCG, CC0): albedo + OpenGL normal + roughness.
 * Color map gets sRGB; normal/roughness stay linear per VISUAL-QUALITY.md §4.
 */
function usePBRSet(base: string, repeatX: number, repeatY: number, normalScale: number, tint = '#ffffff') {
  const [color, normal, rough] = useTexture([
    `/textures/${base}_Color.jpg`,
    `/textures/${base}_NormalGL.jpg`,
    `/textures/${base}_Roughness.jpg`,
  ]);
  return useMemo(() => {
    for (const t of [color, normal, rough]) {
      t.wrapS = THREE.RepeatWrapping;
      t.wrapT = THREE.RepeatWrapping;
      t.repeat.set(repeatX, repeatY);
      t.anisotropy = 8;
    }
    color.colorSpace = THREE.SRGBColorSpace;
    const m = new THREE.MeshStandardMaterial({
      color: tint,
      map: color,
      normalMap: normal,
      normalScale: new THREE.Vector2(normalScale, normalScale),
      roughnessMap: rough,
      roughness: 1.0,
      metalness: 0.0,
    });
    return m;
  }, [color, normal, rough, repeatX, repeatY, normalScale, tint]);
}

function RoomFloor() {
  // Warmed honey tint over the parquet.
  const mat = usePBRSet('woodfloor/WoodFloor042_1K-JPG', 4, 4, 0.9, '#eeddc2');
  return (
    <mesh position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
      <planeGeometry args={[8, 8, 10, 10]} />
      <primitive object={mat} attach="material" />
    </mesh>
  );
}

function Rug() {
  // Carpet pile under the sitting area: color + deep normal for the tufts.
  const mat = usePBRSet('carpet/Carpet001_1K-JPG', 2, 2, 1.2);
  return (
    <mesh position={[0.5, 0.006, -0.4]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
      <planeGeometry args={[3.4, 3.6]} />
      <primitive object={mat} attach="material" />
    </mesh>
  );
}

function RoomWall({ mat, position, rotation }: {
  mat: THREE.Material; position: [number, number, number]; rotation: [number, number, number];
}) {
  return (
    <mesh position={position} rotation={rotation} receiveShadow>
      <planeGeometry args={[8, 4, 10, 5]} />
      <primitive object={mat} attach="material" />
    </mesh>
  );
}

/** Skirting + crown molding in dark wood: the cheapest "finished room" cue. */
function RoomTrim({ mat }: { mat: THREE.Material }) {
  const skirtY = 0.06;
  const crownY = 3.05;
  return (
    <group>
      {/* back wall (z=-4) */}
      <mesh position={[0, skirtY, -3.96]}><boxGeometry args={[8, 0.12, 0.08]} /><primitive object={mat} attach="material" /></mesh>
      <mesh position={[0, crownY, -3.96]}><boxGeometry args={[8, 0.16, 0.1]} /><primitive object={mat} attach="material" /></mesh>
      {/* side walls (x=±4) */}
      {[-3.96, 3.96].map((x) => (
        <group key={x}>
          <mesh position={[x, skirtY, 0]}><boxGeometry args={[0.08, 0.12, 8]} /><primitive object={mat} attach="material" /></mesh>
          <mesh position={[x, crownY, 0]}><boxGeometry args={[0.1, 0.16, 8]} /><primitive object={mat} attach="material" /></mesh>
        </group>
      ))}
    </group>
  );
}

/** Gold picture-molding rectangles on the maroon walls: instant royalty. */
function GoldTrim() {
  const goldMat = useMemo(
    () => new THREE.MeshStandardMaterial({ color: '#C9A227', roughness: 0.32, metalness: 1.0 }),
    []
  );
  const Rect = ({ position, rotation }: { position: [number, number, number]; rotation: [number, number, number] }) => (
    <group position={position} rotation={rotation}>
      <mesh position={[0, 0.85, 0]}><boxGeometry args={[2.2, 0.055, 0.03]} /><primitive object={goldMat} attach="material" /></mesh>
      <mesh position={[0, -0.85, 0]}><boxGeometry args={[2.2, 0.055, 0.03]} /><primitive object={goldMat} attach="material" /></mesh>
      <mesh position={[-1.1, 0, 0]}><boxGeometry args={[0.055, 1.75, 0.03]} /><primitive object={goldMat} attach="material" /></mesh>
      <mesh position={[1.1, 0, 0]}><boxGeometry args={[0.055, 1.75, 0.03]} /><primitive object={goldMat} attach="material" /></mesh>
    </group>
  );
  return (
    <group>
      <Rect position={[-3.94, 1.7, -1.5]} rotation={[0, Math.PI / 2, 0]} />
      <Rect position={[-3.94, 1.7, 1.5]} rotation={[0, Math.PI / 2, 0]} />
      <Rect position={[3.94, 1.7, -1.5]} rotation={[0, -Math.PI / 2, 0]} />
      <Rect position={[3.94, 1.7, 1.5]} rotation={[0, -Math.PI / 2, 0]} />
    </group>
  );
}

function Ceiling() {
  const mat = usePBRSet('plaster/Plaster001_1K-JPG', 4, 4, 0.4, '#6a5a48');
  return (
    <mesh position={[0, 3.2, 0]} rotation={[Math.PI / 2, 0, 0]}>
      <planeGeometry args={[8, 8]} />
      <primitive object={mat} attach="material" />
    </mesh>
  );
}

/** Mughal-arch night art for inside the gold frames: indigo dusk, gold arch, moon. */
function makeTrimArtTexture(moonX: number): THREE.CanvasTexture {
  const c = document.createElement('canvas');
  c.width = 512;
  c.height = 384;
  const g = c.getContext('2d')!;
  const sky = g.createLinearGradient(0, 0, 0, 384);
  sky.addColorStop(0, '#101a33');
  sky.addColorStop(0.6, '#1d2b4d');
  sky.addColorStop(1, '#3a2b3f');
  g.fillStyle = sky;
  g.fillRect(0, 0, 512, 384);
  // Moon + halo.
  const halo = g.createRadialGradient(moonX, 84, 4, moonX, 84, 70);
  halo.addColorStop(0, 'rgba(243,234,216,0.9)');
  halo.addColorStop(0.25, 'rgba(243,234,216,0.28)');
  halo.addColorStop(1, 'rgba(243,234,216,0)');
  g.fillStyle = halo;
  g.fillRect(0, 0, 512, 384);
  g.fillStyle = '#F3EAD8';
  g.beginPath();
  g.arc(moonX, 84, 22, 0, Math.PI * 2);
  g.fill();
  // Gold cusped arch silhouette.
  g.strokeStyle = '#C9A227';
  g.lineWidth = 7;
  g.beginPath();
  g.moveTo(156, 384);
  g.lineTo(156, 200);
  g.quadraticCurveTo(156, 130, 216, 118);
  g.quadraticCurveTo(236, 114, 256, 84);
  g.quadraticCurveTo(276, 114, 296, 118);
  g.quadraticCurveTo(356, 130, 356, 200);
  g.lineTo(356, 384);
  g.stroke();
  // Ground line + stars.
  g.lineWidth = 4;
  g.beginPath();
  g.moveTo(60, 340);
  g.lineTo(452, 340);
  g.stroke();
  g.fillStyle = 'rgba(243,234,216,0.8)';
  const stars: [number, number][] = [[80, 60], [150, 140], [330, 60], [420, 150], [250, 200], [420, 260], [100, 260]];
  for (const [sx, sy] of stars) {
    g.beginPath();
    g.arc(sx, sy, 2.5, 0, Math.PI * 2);
    g.fill();
  }
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  return tex;
}

/** Framed night-art inside each gold rectangle, so the trim means something. */
function TrimArt() {
  const artA = useMemo(() => makeTrimArtTexture(150), []);
  const artB = useMemo(() => makeTrimArtTexture(360), []);
  const matA = useMemo(() => new THREE.MeshStandardMaterial({ map: artA, roughness: 0.85 }), [artA]);
  const matB = useMemo(() => new THREE.MeshStandardMaterial({ map: artB, roughness: 0.85 }), [artB]);
  const spots: { pos: [number, number, number]; rot: [number, number, number]; mat: THREE.Material }[] = [
    { pos: [-3.92, 1.7, -1.5], rot: [0, Math.PI / 2, 0], mat: matA },
    { pos: [-3.92, 1.7, 1.5], rot: [0, Math.PI / 2, 0], mat: matB },
    { pos: [3.92, 1.7, -1.5], rot: [0, -Math.PI / 2, 0], mat: matB },
    { pos: [3.92, 1.7, 1.5], rot: [0, -Math.PI / 2, 0], mat: matA },
  ];
  return (
    <group>
      {spots.map((s, i) => (
        <mesh key={i} position={s.pos} rotation={s.rot}>
          <planeGeometry args={[2.0, 1.5]} />
          <primitive object={s.mat} attach="material" />
        </mesh>
      ))}
    </group>
  );
}

/** Brass wall sconce with a live amber flame: walls that give light. */
function WallSconce({ position, rotation }: { position: [number, number, number]; rotation: [number, number, number] }) {
  const brassMat = useMemo(
    () => new THREE.MeshStandardMaterial({ color: '#8a6a1f', roughness: 0.35, metalness: 1.0 }),
    []
  );
  const flameMat = useMemo(
    () => new THREE.MeshStandardMaterial({ color: '#3a2410', emissive: new THREE.Color('#ffb84d'), emissiveIntensity: 2.2, roughness: 0.6 }),
    []
  );
  const lightRef = useRef<THREE.PointLight>(null);
  useFrame((state) => {
    if (lightRef.current) {
      lightRef.current.intensity =
        0.7 + Math.sin(state.clock.elapsedTime * 9.3 + position[2]) * 0.07 + Math.sin(state.clock.elapsedTime * 23.7) * 0.04;
    }
  });
  return (
    <group position={position} rotation={rotation}>
      <mesh position={[0, 0, 0]} castShadow><boxGeometry args={[0.1, 0.22, 0.07]} /><primitive object={brassMat} attach="material" /></mesh>
      <mesh position={[0, 0.02, 0.09]} castShadow><cylinderGeometry args={[0.055, 0.035, 0.07, 12]} /><primitive object={brassMat} attach="material" /></mesh>
      <mesh position={[0, 0.09, 0.09]}>
        <sphereGeometry args={[0.035, 12, 10]} />
        <primitive object={flameMat} attach="material" />
      </mesh>
      <pointLight ref={lightRef} position={[0, 0.12, 0.15]} color="#ff9a3c" intensity={0.7} distance={4.5} decay={2} />
    </group>
  );
}

/** Side table with a book stack and a live diya: the room's lived-in corner. */
function SideTable() {
  const trimWood = usePBRSet('darkwood/darkwood', 1, 1, 0.6);
  const brassMat = useMemo(
    () => new THREE.MeshStandardMaterial({ color: '#8a6a1f', roughness: 0.35, metalness: 1.0 }),
    []
  );
  const flameMat = useMemo(
    () => new THREE.MeshStandardMaterial({ color: '#3a2410', emissive: new THREE.Color('#ffc25e'), emissiveIntensity: 2.4, roughness: 0.6 }),
    []
  );
  const bookA = useMemo(() => new THREE.MeshStandardMaterial({ color: '#5B3A8E', roughness: 0.55 }), []);
  const bookB = useMemo(() => new THREE.MeshStandardMaterial({ color: '#A6493B', roughness: 0.55 }), []);
  const diyaRef = useRef<THREE.PointLight>(null);
  useFrame((state) => {
    if (diyaRef.current) {
      diyaRef.current.intensity =
        0.85 + Math.sin(state.clock.elapsedTime * 10.7) * 0.1 + Math.sin(state.clock.elapsedTime * 27.3) * 0.06;
    }
  });
  return (
    <group position={[-1.7, 0, -2.2]}>
      <mesh position={[0, 0.52, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.34, 0.34, 0.05, 20]} />
        <primitive object={trimWood} attach="material" />
      </mesh>
      {[-0.22, 0.22, 0].map((x, i) => (
        <mesh key={i} position={[x, 0.26, i === 2 ? 0.18 : -0.12]} castShadow>
          <cylinderGeometry args={[0.025, 0.03, 0.52, 10]} />
          <primitive object={trimWood} attach="material" />
        </mesh>
      ))}
      {/* book stack */}
      <mesh position={[-0.1, 0.575, 0.05]} castShadow rotation={[0, 0.3, 0]}>
        <boxGeometry args={[0.3, 0.045, 0.22]} />
        <primitive object={bookA} attach="material" />
      </mesh>
      <mesh position={[-0.08, 0.62, 0.04]} castShadow rotation={[0, -0.15, 0]}>
        <boxGeometry args={[0.26, 0.04, 0.2]} />
        <primitive object={bookB} attach="material" />
      </mesh>
      {/* diya */}
      <mesh position={[0.14, 0.565, -0.08]} castShadow>
        <cylinderGeometry args={[0.07, 0.045, 0.05, 14]} />
        <primitive object={brassMat} attach="material" />
      </mesh>
      <mesh position={[0.14, 0.62, -0.08]}>
        <sphereGeometry args={[0.022, 10, 8]} />
        <primitive object={flameMat} attach="material" />
      </mesh>
      <pointLight ref={diyaRef} position={[0.14, 0.7, -0.08]} color="#ffa63e" intensity={0.85} distance={3.5} decay={2} />
    </group>
  );
}

/** Brass pendant over the rug, swaying almost imperceptibly. Pools warm light. */
function Pendant() {
  const groupRef = useRef<THREE.Group>(null);
  const brassMat = useMemo(
    () => new THREE.MeshStandardMaterial({ color: '#6a5218', roughness: 0.4, metalness: 1.0, side: THREE.DoubleSide }),
    []
  );
  const bulbMat = useMemo(
    () => new THREE.MeshStandardMaterial({ color: '#fff2cf', emissive: new THREE.Color('#ffcf7a'), emissiveIntensity: 2.6, roughness: 0.5 }),
    []
  );
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.5) * 0.02;
      groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.37 + 1) * 0.015;
    }
  });
  return (
    <group ref={groupRef} position={[0.5, 3.2, -0.3]}>
      <mesh position={[0, -0.5, 0]}>
        <cylinderGeometry args={[0.008, 0.008, 1.0, 8]} />
        <primitive object={brassMat} attach="material" />
      </mesh>
      <mesh position={[0, -1.06, 0]} castShadow>
        <cylinderGeometry args={[0.05, 0.22, 0.24, 20, 1, true]} />
        <primitive object={brassMat} attach="material" />
      </mesh>
      <mesh position={[0, -1.12, 0]}>
        <sphereGeometry args={[0.045, 14, 12]} />
        <primitive object={bulbMat} attach="material" />
      </mesh>
      <pointLight position={[0, -1.2, 0]} color="#ffbe62" intensity={2.2} distance={7} decay={2} />
    </group>
  );
}

/** Dark ceiling beams: architecture overhead, not a void. */
function CeilingBeams({ mat }: { mat: THREE.Material }) {
  return (
    <group>
      {[-2.5, 0, 2.5].map((z) => (
        <mesh key={z} position={[0, 3.12, z]} castShadow>
          <boxGeometry args={[8, 0.14, 0.2]} />
          <primitive object={mat} attach="material" />
        </mesh>
      ))}
    </group>
  );
}

function Sconces() {
  return (
    <group>
      <WallSconce position={[-3.9, 1.95, 0]} rotation={[0, Math.PI / 2, 0]} />
      <WallSconce position={[3.9, 1.95, 0]} rotation={[0, -Math.PI / 2, 0]} />
      <WallSconce position={[-1.5, 2.0, -3.92]} rotation={[0, 0, 0]} />
      <WallSconce position={[1.5, 2.0, -3.92]} rotation={[0, 0, 0]} />
    </group>
  );
}

/* ---------------------------------- chair ---------------------------------- */

function Chair() {
  const scrollProgress = useScrollStore((s) => s.scrollProgress);
  const setHovered = useWorldStore((s) => s.setHovered);
  const setSelected = useWorldStore((s) => s.setSelected);
  const hovered = useWorldStore((s) => s.hovered);
  const selected = useWorldStore((s) => s.selected);
  const chairGroupRef = useRef<THREE.Group>(null);

  // Real scanned mesh: Poly Haven WoodenChair_01 (CC0), 1k PBR.
  const { scene } = useGLTF('/models/WoodenChair_01/WoodenChair_01.gltf');
  useEffect(() => {
    scene.traverse((o) => {
      if ((o as THREE.Mesh).isMesh) {
        o.castShadow = true;
        o.receiveShadow = true;
      }
    });
  }, [scene]);

  useFrame(() => {
    if (!chairGroupRef.current) return;
    if (inRange(scrollProgress, 0.10, 0.22)) {
      chairGroupRef.current.rotation.y = easeInOutSine((scrollProgress - 0.10) / 0.12) * Math.PI * 2;
    } else if (scrollProgress >= 0.22) {
      chairGroupRef.current.rotation.y = Math.PI * 2;
    } else {
      chairGroupRef.current.rotation.y = 0;
    }
  });

  // Maroon cushion so the wooden chair sits in the royal palette.
  const cushionMat = usePBRSet('fabric/Fabric025_1K-JPG', 1, 1, 0.8, '#7a2a2e');

  const active = inRange(scrollProgress, 0.10, 0.22);
  const isHot = hovered === 'chair' || selected === 'chair';

  return (
    <group
      ref={chairGroupRef}
      position={[1.2, 0, 1.5]}
      onPointerOver={(e) => { if (!active) return; e.stopPropagation(); document.body.style.cursor = 'pointer'; setHovered('chair'); }}
      onPointerOut={(e) => { if (!active) return; e.stopPropagation(); document.body.style.cursor = 'default'; setHovered(null); }}
      onClick={(e) => { if (!active) return; e.stopPropagation(); setSelected('chair'); }}
    >
      <primitive object={scene} />
      <mesh position={[0, 0.5, 0.02]} castShadow>
        <boxGeometry args={[0.42, 0.1, 0.4]} />
        <primitive object={cushionMat} attach="material" />
      </mesh>
      {isHot && <HoverTag text="Wooden Chair — Identity" color="#E3B25C" />}
      {selected === 'chair' && (
        <DetailPanel title={PROFILE.name} subtitle="Identity" body={`${PROFILE.title} · ${PROFILE.location}. ${PROFILE.profile}`} color="#E3B25C" />
      )}
    </group>
  );
}

/* ------------------------------- sofa + pillows ----------------------------- */

const PILLOW_COLORS: Record<string, string> = { school: '#8E2F32', college: '#2F4A7A' };

function Sofa() {
  const scrollProgress = useScrollStore((s) => s.scrollProgress);
  const setHovered = useWorldStore((s) => s.setHovered);
  const setSelected = useWorldStore((s) => s.setSelected);
  const hovered = useWorldStore((s) => s.hovered);
  const selected = useWorldStore((s) => s.selected);

  // Real scanned mesh: Poly Haven sofa_03 (CC0), 1k PBR.
  const { scene } = useGLTF('/models/sofa_03/sofa_03.gltf');
  useEffect(() => {
    scene.traverse((o) => {
      if ((o as THREE.Mesh).isMesh) {
        o.castShadow = true;
        o.receiveShadow = true;
      }
    });
  }, [scene]);

  // Pillow fabric: the weave normal map kills the plastic look;
  // the school/college colour survives as a tint over the cloth.
  const schoolCloth = usePBRSet('fabric/Fabric025_1K-JPG', 1, 1, 0.8, PILLOW_COLORS.school);
  const collegeCloth = usePBRSet('fabric/Fabric025_1K-JPG', 1, 1, 0.8, PILLOW_COLORS.college);
  const pillowMats: Record<string, THREE.MeshStandardMaterial> = useMemo(
    () => ({ school: schoolCloth, college: collegeCloth }),
    [schoolCloth, collegeCloth]
  );

  const active = inRange(scrollProgress, 0.22, 0.32);
  const over = (id: string) => (e: ThreeEvent<PointerEvent>) => {
    if (!active) return;
    e.stopPropagation();
    document.body.style.cursor = 'pointer';
    setHovered(id);
  };
  const out = () => (e: ThreeEvent<PointerEvent>) => {
    if (!active) return;
    e.stopPropagation();
    document.body.style.cursor = 'default';
    setHovered(null);
  };
  const click = (id: string) => (e: ThreeEvent<MouseEvent>) => {
    if (!active) return;
    e.stopPropagation();
    setSelected(id);
  };

  return (
    <group position={[0, 0, -2.5]}>
      <primitive object={scene} />
      {EDUCATION.map((edu, i) => {
        const x = i === 0 ? -0.45 : 0.45;
        const id = `pillow:${edu.id}`;
        const hot = hovered === id || selected === id;
        return (
          <group
            key={edu.id}
            position={[x, 0.58, -0.05]}
            rotation={[0, 0, i === 0 ? 0.12 : -0.12]}
            onPointerOver={over(id)}
            onPointerOut={out()}
            onClick={click(id)}
          >
            <mesh castShadow scale={hot ? 1.08 : 1}>
              <boxGeometry args={[0.42, 0.36, 0.16]} />
              <primitive object={pillowMats[edu.id]} attach="material" />
            </mesh>
            {hot && <HoverTag text={edu.type === 'school' ? 'School' : 'College'} color={PILLOW_COLORS[edu.id]} />}
            {selected === id && (
              <DetailPanel title={edu.institution} subtitle={edu.type === 'school' ? 'School' : 'College'} body={edu.details} color={PILLOW_COLORS[edu.id]} />
            )}
          </group>
        );
      })}
    </group>
  );
}

/* --------------------------------- bookshelf -------------------------------- */

function Book({ projectId, position, isGroup, zone, lean = 0 }: {
  projectId: string; position: [number, number, number]; isGroup: boolean; zone: [number, number]; lean?: number;
}) {
  const scrollProgress = useScrollStore((s) => s.scrollProgress);
  const setHovered = useWorldStore((s) => s.setHovered);
  const setSelected = useWorldStore((s) => s.setSelected);
  const hovered = useWorldStore((s) => s.hovered);
  const selected = useWorldStore((s) => s.selected);

  const proj = PROJECT_MAP[projectId];
  const mat = useMemo(
    () => new THREE.MeshStandardMaterial({ color: spineColor(projectId), roughness: 0.5, metalness: 0.05 }),
    [projectId]
  );

  if (!proj) return null;
  const id = `book:${projectId}`;
  const active = inRange(scrollProgress, zone[0], zone[1]);
  const hot = hovered === id || selected === id;
  const w = isGroup ? 0.11 : 0.08;
  const h = isGroup ? 0.32 : 0.25;

  return (
    <group
      position={hot ? [position[0], position[1] + 0.01, position[2] + 0.07] : [position[0], position[1] + (lean !== 0 ? 0.015 : 0), position[2]]}
      rotation={[0, 0, hot ? 0 : lean]}
      onPointerOver={(e) => { if (!active) return; e.stopPropagation(); document.body.style.cursor = 'pointer'; setHovered(id); }}
      onPointerOut={(e) => { if (!active) return; e.stopPropagation(); document.body.style.cursor = 'default'; setHovered(null); }}
      onClick={(e) => { if (!active) return; e.stopPropagation(); setSelected(id); }}
    >
      <mesh castShadow>
        <boxGeometry args={[w, h, 0.2]} />
        <primitive object={mat} attach="material" />
      </mesh>
      {hot && <HoverTag text={`${proj.title} — ${proj.author}`} color={spineColor(projectId)} />}
      {selected === id && (
        <DetailPanel
          title={proj.title}
          subtitle={`${proj.type === 'solo' ? 'Solo' : 'Group'} · by ${proj.author}`}
          body={`${proj.description} Tech: ${proj.technologies.join(', ')}.`}
          links={[
            { label: 'GitHub ↗', href: proj.github },
            ...(proj.live ? [{ label: 'Live demo ↗', href: proj.live }] : []),
          ]}
          color={spineColor(projectId)}
        />
      )}
    </group>
  );
}

function Bookshelf({ position, scale = 1, isGroup = false, projectIds = [], zone }: {
  position: [number, number, number]; scale?: number; isGroup?: boolean; projectIds?: string[]; zone: [number, number];
}) {
  // Shelf carcass: dark scanned planks instead of painted boxes.
  const woodMat = usePBRSet('darkwood/darkwood', 1, 1, 0.7);
  const boardMat = usePBRSet('darkwood/darkwood', 1, 1, 0.7, '#c9bcab');

  const shelfDepth = isGroup ? 0.45 : 0.3;
  const shelfHeight = isGroup ? 0.35 : 0.28;
  const shelfCount = isGroup ? 4 : 5;

  return (
    <group position={position} scale={scale} castShadow receiveShadow>
      <mesh position={[-0.6, (shelfCount * shelfHeight) / 2, 0]} castShadow><boxGeometry args={[0.05, shelfCount * shelfHeight, shelfDepth]} /><primitive object={woodMat} attach="material" /></mesh>
      <mesh position={[0.6, (shelfCount * shelfHeight) / 2, 0]} castShadow><boxGeometry args={[0.05, shelfCount * shelfHeight, shelfDepth]} /><primitive object={woodMat} attach="material" /></mesh>
      <mesh position={[0, shelfCount * shelfHeight, 0]} castShadow><boxGeometry args={[1.25, 0.04, shelfDepth + 0.05]} /><primitive object={woodMat} attach="material" /></mesh>
      <mesh position={[0, 0, 0]} castShadow><boxGeometry args={[1.25, 0.04, shelfDepth + 0.05]} /><primitive object={woodMat} attach="material" /></mesh>
      {/* cornice + plinth: furniture, not boxes */}
      <mesh position={[0, shelfCount * shelfHeight + 0.05, 0]} castShadow><boxGeometry args={[1.35, 0.07, shelfDepth + 0.14]} /><primitive object={woodMat} attach="material" /></mesh>
      <mesh position={[0, 0.045, 0]} castShadow><boxGeometry args={[1.35, 0.09, shelfDepth + 0.14]} /><primitive object={woodMat} attach="material" /></mesh>
      {[...Array(shelfCount)].map((_, i) => (
        <mesh key={i} position={[0, (i + 0.5) * shelfHeight, 0]} receiveShadow><boxGeometry args={[1.15, 0.03, shelfDepth - 0.02]} /><primitive object={boardMat} attach="material" /></mesh>
      ))}
      <mesh position={[0, (shelfCount * shelfHeight) / 2, -shelfDepth / 2 + 0.01]}><planeGeometry args={[1.15, shelfCount * shelfHeight]} /><primitive object={woodMat} attach="material" /></mesh>
      {projectIds.slice(0, shelfCount).map((pid, i) => (
        <Book key={pid} projectId={pid} position={[-0.45 + i * 0.22, (i + 0.5) * shelfHeight + 0.03, (i % 3) * 0.012]} isGroup={isGroup} zone={zone} lean={i % 5 === 4 ? -0.13 : 0} />
      ))}
    </group>
  );
}

/* -------------------------------- poster wall ------------------------------- */

function Poster({ ach, position }: { ach: Achievement; position: [number, number, number] }) {
  const scrollProgress = useScrollStore((s) => s.scrollProgress);
  const setHovered = useWorldStore((s) => s.setHovered);
  const setSelected = useWorldStore((s) => s.setSelected);
  const hovered = useWorldStore((s) => s.hovered);
  const selected = useWorldStore((s) => s.selected);

  const glow = STATUS_COLORS[ach.status] || '#5B8BD0';
  const faceTex = useMemo(() => makePosterTexture(ach), [ach]);
  const frameMat = useMemo(
    () => new THREE.MeshStandardMaterial({ color: glow, roughness: 0.4, metalness: 0.3, emissive: new THREE.Color(glow), emissiveIntensity: 0.25 }),
    [glow]
  );

  const id = `poster:${ach.id}`;
  const active = inRange(scrollProgress, 0.32, 0.47);
  const hot = hovered === id || selected === id;

  useFrame(() => {
    const target = hot ? 0.9 : 0.25;
    frameMat.emissiveIntensity += (target - frameMat.emissiveIntensity) * 0.15;
  });

  return (
    <group
      position={position}
      scale={hot ? 1.05 : 1}
      onPointerOver={(e) => { if (!active) return; e.stopPropagation(); document.body.style.cursor = 'pointer'; setHovered(id); }}
      onPointerOut={(e) => { if (!active) return; e.stopPropagation(); document.body.style.cursor = 'default'; setHovered(null); }}
      onClick={(e) => { if (!active) return; e.stopPropagation(); setSelected(id); }}
    >
      <mesh castShadow>
        <boxGeometry args={[1.5, 1.0, 0.03]} />
        <primitive object={frameMat} attach="material" />
      </mesh>
      <mesh position={[0, 0, 0.017]}>
        <planeGeometry args={[1.38, 0.9]} />
        <meshStandardMaterial map={faceTex} roughness={0.85} metalness={0} />
      </mesh>
      {hot && <HoverTag text={`${ach.title} · ${ach.event}`} color={glow} />}
      {selected === id && (
        <DetailPanel
          title={ach.title}
          subtitle={`${ach.event} · ${ach.year} · ${ach.status}`}
          body={ach.description}
          links={ach.link ? [{ label: 'GitHub ↗', href: ach.link }] : []}
          color={glow}
        />
      )}
    </group>
  );
}

function PosterWall() {
  const scrollProgress = useScrollStore((s) => s.scrollProgress);
  const visible = inRange(scrollProgress, 0.32, 0.47);
  if (!visible) return null;

  const achievements = ACHIEVEMENTS.slice(0, 4);

  return (
    <group position={[0, 1.5, -4]}>
      <mesh position={[0, 0, -0.02]} receiveShadow>
        <planeGeometry args={[8, 3]} />
        <primitive object={new THREE.MeshStandardMaterial({ color: '#241d16', roughness: 0.95 })} attach="material" />
      </mesh>
      {achievements.map((ach, i) => (
        <Poster key={ach.id} ach={ach} position={[-2.7 + i * 1.8, 0.3, 0]} />
      ))}
    </group>
  );
}

/* ------------------------------- plant showcase ----------------------------- */

const POT_COLORS = ['#A6493B', '#33687A'];

function PlantShowcase() {
  const scrollProgress = useScrollStore((s) => s.scrollProgress);
  const setHovered = useWorldStore((s) => s.setHovered);
  const setSelected = useWorldStore((s) => s.setSelected);
  const hovered = useWorldStore((s) => s.hovered);
  const selected = useWorldStore((s) => s.selected);
  const visible = inRange(scrollProgress, 0.74, 0.87);
  const active = visible;

  // Real scanned mesh: Poly Haven potted_plant_04 (CC0), 1k PBR.
  // Hooks stay above the early return to keep hook order stable.
  const { scene } = useGLTF('/models/potted_plant_04/potted_plant_04.gltf');
  useEffect(() => {
    scene.traverse((o) => {
      if ((o as THREE.Mesh).isMesh) {
        o.castShadow = true;
        o.receiveShadow = true;
      }
    });
  }, [scene]);

  if (!visible) return null;

  const pots: { pos: [number, number, number]; scale: number; hobby: number }[] = [
    { pos: [0, 0, 0], scale: 1, hobby: 0 },
    { pos: [0.9, 0, -0.3], scale: 0.75, hobby: 1 },
  ];

  return (
    <group position={[1.8, 0, -0.5]}>
      {pots.map((pot, i) => {
        const hobby = HOBBIES[pot.hobby];
        const id = `plant:${hobby.id}`;
        const hot = hovered === id || selected === id;
        return (
          <group
            key={hobby.id}
            position={pot.pos}
            scale={hot ? pot.scale * 1.06 : pot.scale}
            onPointerOver={(e) => { if (!active) return; e.stopPropagation(); document.body.style.cursor = 'pointer'; setHovered(id); }}
            onPointerOut={(e) => { if (!active) return; e.stopPropagation(); document.body.style.cursor = 'default'; setHovered(null); }}
            onClick={(e) => { if (!active) return; e.stopPropagation(); setSelected(id); }}
          >
            <primitive object={i === 0 ? scene : scene.clone()} />
            {hot && <HoverTag text={hobby.title} color={POT_COLORS[i]} />}
            {selected === id && (
              <DetailPanel title={hobby.title} subtitle="Hobby" body={hobby.description} color={POT_COLORS[i]} />
            )}
          </group>
        );
      })}
    </group>
  );
}

/* ---------------------------------- lights ---------------------------------- */

function RoomLights() {
  return (
    <>
      <ambientLight color="#2a3350" intensity={0.55} />
      <hemisphereLight args={['#4a5a80', '#241a12', 0.5]} />
      <pointLight position={[0, 3.5, 0]} color="#ffecd2" intensity={0.6} distance={12} decay={2} />
      <directionalLight position={[0, 2, -3]} color="#ffd47a" intensity={0.35} castShadow={false} />
      <pointLight position={[-3, 2, 1]} color="#5B8BD0" intensity={0.35} distance={9} decay={2} />
      <pointLight position={[3, 1.5, 1]} color="#E3B25C" intensity={0.25} distance={8} decay={2} />
      {/* cool moonlight fill for warm/cool contrast */}
      <directionalLight position={[4, 3, 3]} color="#7a9cc6" intensity={0.22} castShadow={false} />
    </>
  );
}

/* ----------------------------------- scene ---------------------------------- */

useGLTF.preload('/models/sofa_03/sofa_03.gltf');
useGLTF.preload('/models/WoodenChair_01/WoodenChair_01.gltf');
useGLTF.preload('/models/potted_plant_04/potted_plant_04.gltf');

export function RoomScene() {
  const [introComplete, setIntroComplete] = useState(false);
  const handleIntroComplete = useCallback(() => setIntroComplete(true), []);

  // Royal palette: deep maroon plaster sides, gold damask accent behind posters.
  const maroonPlaster = usePBRSet('plaster/Plaster001_1K-JPG', 3, 2, 0.5, '#7a4030');
  const damaskWall = usePBRSet('wallpaper/Wallpaper001B_1K-JPG', 4, 2, 0.7, '#d8b98a');
  const trimWood = usePBRSet('darkwood/darkwood', 2, 1, 0.5);

  return (
    <>
      <RoomLights />
      <group>
        <RoomFloor />
        <Rug />
        <RoomWall mat={damaskWall} position={[0, 1.5, -4]} rotation={[0, 0, 0]} />
        <RoomWall mat={maroonPlaster} position={[-4, 1.5, 0]} rotation={[0, Math.PI / 2, 0]} />
        <RoomWall mat={maroonPlaster} position={[4, 1.5, 0]} rotation={[0, -Math.PI / 2, 0]} />
        <RoomTrim mat={trimWood} />
        <GoldTrim />
        <TrimArt />
        <Sconces />
        <Ceiling />
        <CeilingBeams mat={trimWood} />
      </group>
      <SideTable />
      <Pendant />
      <Chair />
      <Sofa />
      <Bookshelf position={[-3.2, 0, 1.2]} projectIds={['nayana', 'medaether', 'sanchay', 'lume', 'tattva']} zone={[0.47, 0.62]} />
      <Bookshelf position={[-3.2, 0, -1.2]} scale={1.3} isGroup={true} projectIds={['kawach', 'vortex', 'prism']} zone={[0.62, 0.74]} />
      <Bookshelf position={[3.2, 0, 1.2]} scale={1.3} isGroup={true} projectIds={['smartcart', 'chatguard', 'cardioscan']} zone={[0.62, 0.74]} />
      <PosterWall />
      <PlantShowcase />
      <Lamp onIntroComplete={handleIntroComplete} />
      <IntroText visible={introComplete} />
    </>
  );
}
