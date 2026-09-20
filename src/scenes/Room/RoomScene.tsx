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
  // Jute/natural fiber rug — warm den vibe.
  const mat = usePBRSet('carpet/Carpet001_1K-JPG', 2, 2, 1.2, '#c4a265');
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

/** String lights draped across the back wall — cozy retro vibes. */
function StringLights() {
  const wireMat = useMemo(
    () => new THREE.MeshStandardMaterial({ color: '#2a2a2a', roughness: 0.6, metalness: 0.4 }),
    []
  );
  const bulbCount = 18;
  const bulbs = useMemo(() => {
    const pts: { x: number; y: number; z: number; color: string }[] = [];
    const palette = ['#ffcc66', '#ff9944', '#ffaa55', '#ffdd88', '#ffbb33', '#ff8833'];
    for (let i = 0; i < bulbCount; i++) {
      const t = i / (bulbCount - 1);
      const x = -3.5 + t * 7;
      const sag = Math.sin(t * Math.PI) * 0.3;
      const y = 2.85 - sag;
      pts.push({ x, y, z: -3.88, color: palette[i % palette.length] });
    }
    return pts;
  }, []);

  return (
    <group>
      {/* Wire catenary */}
      {bulbs.slice(0, -1).map((b, i) => {
        const next = bulbs[i + 1];
        const mx = (b.x + next.x) / 2;
        const my = (b.y + next.y) / 2;
        const dx = next.x - b.x;
        const dy = next.y - b.y;
        const len = Math.sqrt(dx * dx + dy * dy);
        const angle = Math.atan2(dy, dx);
        return (
          <mesh key={`w${i}`} position={[mx, my, b.z]} rotation={[0, 0, angle]}>
            <cylinderGeometry args={[0.004, 0.004, len, 4]} />
            <primitive object={wireMat} attach="material" />
          </mesh>
        );
      })}
      {/* Bulbs — warm emissive spheres */}
      {bulbs.map((b, i) => (
        <group key={`b${i}`} position={[b.x, b.y - 0.04, b.z]}>
          <mesh>
            <sphereGeometry args={[0.025, 8, 8]} />
            <meshStandardMaterial
              color={b.color}
              emissive={new THREE.Color(b.color)}
              emissiveIntensity={1.8}
              roughness={0.3}
              transparent
              opacity={0.9}
            />
          </mesh>
          {i % 3 === 0 && (
            <pointLight color={b.color} intensity={0.3} distance={2.5} decay={2} />
          )}
        </group>
      ))}
    </group>
  );
}

/** Moon lamp on a shelf — glowing sphere, warm orange emissive. */
function MoonLamp() {
  const moonMat = useMemo(
    () => new THREE.MeshStandardMaterial({
      color: '#fff4e0',
      emissive: new THREE.Color('#ffaa44'),
      emissiveIntensity: 1.5,
      roughness: 0.85,
    }),
    []
  );
  return (
    <group position={[3.2, 1.65, -1.2]}>
      <mesh>
        <sphereGeometry args={[0.12, 20, 20]} />
        <primitive object={moonMat} attach="material" />
      </mesh>
      {/* tiny stand */}
      <mesh position={[0, -0.13, 0]}>
        <cylinderGeometry args={[0.06, 0.06, 0.02, 12]} />
        <meshStandardMaterial color="#3a3a3a" roughness={0.5} metalness={0.3} />
      </mesh>
      <pointLight color="#ffaa44" intensity={0.8} distance={3} decay={2} />
    </group>
  );
}

/** Rattan/woven floor lamp next to the chair — tall cylinder shade. */
function FloorLamp() {
  const ratMat = useMemo(
    () => new THREE.MeshStandardMaterial({
      color: '#b89060',
      roughness: 0.7,
      metalness: 0.0,
      side: THREE.DoubleSide,
    }),
    []
  );
  const glowMat = useMemo(
    () => new THREE.MeshStandardMaterial({
      color: '#4a3820',
      emissive: new THREE.Color('#ffc470'),
      emissiveIntensity: 1.2,
      roughness: 0.5,
      side: THREE.DoubleSide,
    }),
    []
  );
  return (
    <group position={[2.2, 0, 1.5]}>
      {/* Base plate */}
      <mesh position={[0, 0.02, 0]}>
        <cylinderGeometry args={[0.15, 0.18, 0.04, 16]} />
        <meshStandardMaterial color="#3a3a3a" roughness={0.4} metalness={0.5} />
      </mesh>
      {/* Pole */}
      <mesh position={[0, 0.65, 0]}>
        <cylinderGeometry args={[0.015, 0.02, 1.26, 8]} />
        <meshStandardMaterial color="#2a2a2a" roughness={0.4} metalness={0.6} />
      </mesh>
      {/* Woven shade — outer */}
      <mesh position={[0, 1.45, 0]}>
        <cylinderGeometry args={[0.12, 0.18, 0.5, 16, 1, true]} />
        <primitive object={ratMat} attach="material" />
      </mesh>
      {/* Inner glow */}
      <mesh position={[0, 1.45, 0]}>
        <cylinderGeometry args={[0.115, 0.175, 0.48, 16, 1, true]} />
        <primitive object={glowMat} attach="material" />
      </mesh>
      <pointLight position={[0, 1.45, 0]} color="#ffc470" intensity={1.5} distance={5} decay={2} />
    </group>
  );
}

/** Simple hanging trailing plant — sphere of green with dangling vines. */
function HangingPlant({ position }: { position: [number, number, number] }) {
  const leafMat = useMemo(
    () => new THREE.MeshStandardMaterial({ color: '#3a6b35', roughness: 0.7, metalness: 0.0 }),
    []
  );
  const vineMat = useMemo(
    () => new THREE.MeshStandardMaterial({ color: '#2d5a28', roughness: 0.7, metalness: 0.0 }),
    []
  );
  const potMat = useMemo(
    () => new THREE.MeshStandardMaterial({ color: '#b48c5a', roughness: 0.6, metalness: 0.0 }),
    []
  );
  // Random vine lengths for organic feel
  const vines = useMemo(() => [
    { angle: 0, len: 0.6, offset: 0.04 },
    { angle: Math.PI * 0.4, len: 0.8, offset: 0.05 },
    { angle: Math.PI * 0.8, len: 0.5, offset: 0.03 },
    { angle: Math.PI * 1.2, len: 0.7, offset: 0.06 },
    { angle: Math.PI * 1.6, len: 0.55, offset: 0.04 },
  ], []);
  return (
    <group position={position}>
      {/* Pot */}
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[0.08, 0.06, 0.12, 12]} />
        <primitive object={potMat} attach="material" />
      </mesh>
      {/* Foliage ball */}
      <mesh position={[0, 0.06, 0]}>
        <sphereGeometry args={[0.12, 10, 10]} />
        <primitive object={leafMat} attach="material" />
      </mesh>
      {/* Trailing vines */}
      {vines.map((v, i) => (
        <mesh key={i} position={[
          Math.cos(v.angle) * v.offset,
          -v.len / 2 + 0.02,
          Math.sin(v.angle) * v.offset,
        ]} rotation={[Math.cos(v.angle) * 0.15, 0, Math.sin(v.angle) * 0.15]}>
          <cylinderGeometry args={[0.006, 0.004, v.len, 4]} />
          <primitive object={vineMat} attach="material" />
        </mesh>
      ))}
      {/* Leaf clusters along vines */}
      {vines.map((v, i) => (
        <mesh key={`l${i}`} position={[
          Math.cos(v.angle) * (v.offset + 0.02),
          -v.len * 0.6,
          Math.sin(v.angle) * (v.offset + 0.02),
        ]}>
          <sphereGeometry args={[0.03, 6, 6]} />
          <primitive object={leafMat} attach="material" />
        </mesh>
      ))}
    </group>
  );
}

function Ceiling() {
  const mat = usePBRSet('plaster/Plaster001_1K-JPG', 4, 4, 0.4, '#e8ddd0');
  return (
    <mesh position={[0, 3.2, 0]} rotation={[Math.PI / 2, 0, 0]}>
      <planeGeometry args={[8, 8]} />
      <primitive object={mat} attach="material" />
    </mesh>
  );
}

/* (TrimArt and makeTrimArtTexture removed — replaced by StringLights and retro decor) */

/* (WallSconce removed — replaced by StringLights) */

/** Coffee table with a book stack — the room's lived-in corner. */
function SideTable() {
  const trimWood = usePBRSet('darkwood/darkwood', 1, 1, 0.6, '#8a7560');
  const bookA = useMemo(() => new THREE.MeshStandardMaterial({ color: '#5B3A8E', roughness: 0.55 }), []);
  const bookB = useMemo(() => new THREE.MeshStandardMaterial({ color: '#e06520', roughness: 0.55 }), []);
  const bookC = useMemo(() => new THREE.MeshStandardMaterial({ color: '#c49b2f', roughness: 0.55 }), []);
  return (
    <group position={[-1.7, 0, -2.2]}>
      <mesh position={[0, 0.35, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.7, 0.04, 0.5]} />
        <primitive object={trimWood} attach="material" />
      </mesh>
      {/* Hairpin legs */}
      {[[-0.28, 0.175, -0.2], [0.28, 0.175, -0.2], [-0.28, 0.175, 0.2], [0.28, 0.175, 0.2]].map((pos, i) => (
        <mesh key={i} position={pos as [number, number, number]} castShadow>
          <cylinderGeometry args={[0.01, 0.01, 0.35, 6]} />
          <meshStandardMaterial color="#2a2a2a" roughness={0.3} metalness={0.7} />
        </mesh>
      ))}
      {/* book stack */}
      <mesh position={[-0.1, 0.39, 0.05]} castShadow rotation={[0, 0.3, 0]}>
        <boxGeometry args={[0.22, 0.035, 0.16]} />
        <primitive object={bookA} attach="material" />
      </mesh>
      <mesh position={[-0.08, 0.425, 0.04]} castShadow rotation={[0, -0.15, 0]}>
        <boxGeometry args={[0.2, 0.03, 0.15]} />
        <primitive object={bookB} attach="material" />
      </mesh>
      <mesh position={[-0.12, 0.455, 0.06]} castShadow rotation={[0, 0.5, 0]}>
        <boxGeometry args={[0.18, 0.025, 0.14]} />
        <primitive object={bookC} attach="material" />
      </mesh>
    </group>
  );
}

/** Edison-bulb pendant over the rug, swaying gently. */
function Pendant() {
  const groupRef = useRef<THREE.Group>(null);
  const wireMat = useMemo(
    () => new THREE.MeshStandardMaterial({ color: '#2a2a2a', roughness: 0.4, metalness: 0.6 }),
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
        <cylinderGeometry args={[0.005, 0.005, 1.0, 6]} />
        <primitive object={wireMat} attach="material" />
      </mesh>
      {/* Edison bulb — elongated */}
      <mesh position={[0, -1.06, 0]} castShadow>
        <capsuleGeometry args={[0.03, 0.08, 6, 12]} />
        <primitive object={bulbMat} attach="material" />
      </mesh>
      <pointLight position={[0, -1.1, 0]} color="#ffbe62" intensity={2.2} distance={7} decay={2} />
    </group>
  );
}

/** Warm wood ceiling beams. */
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

  // Retro orange cushion — mid-century vibes.
  const cushionMat = usePBRSet('fabric/Fabric025_1K-JPG', 1, 1, 0.8, '#e06520');

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

const PILLOW_COLORS: Record<string, string> = { school: '#d4543a', college: '#c49b2f' };

function Sofa() {
  const scrollProgress = useScrollStore((s) => s.scrollProgress);
  const setHovered = useWorldStore((s) => s.setHovered);
  const setSelected = useWorldStore((s) => s.setSelected);
  const hovered = useWorldStore((s) => s.hovered);
  const selected = useWorldStore((s) => s.selected);

  // Real scanned mesh: Poly Haven sofa_03 (CC0), 1k PBR.
  // Tinted olive/mustard to match reference.
  const { scene } = useGLTF('/models/sofa_03/sofa_03.gltf');
  useEffect(() => {
    scene.traverse((o) => {
      if ((o as THREE.Mesh).isMesh) {
        o.castShadow = true;
        o.receiveShadow = true;
        // Override color to olive/mustard per reference images
        const mat = (o as THREE.Mesh).material as THREE.MeshStandardMaterial;
        if (mat && mat.isMeshStandardMaterial) {
          mat.color.set('#7a8040');
        }
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

/** Dense salon-hang gallery wall — all achievements in varied positions. */
function PosterWall() {
  const scrollProgress = useScrollStore((s) => s.scrollProgress);
  const visible = inRange(scrollProgress, 0.32, 0.47);
  if (!visible) return null;

  // Use ALL achievements for a dense gallery wall
  const achievements = ACHIEVEMENTS;

  // Salon-hang layout: staggered heights, varied spacing
  const positions: [number, number, number][] = [
    [-3.0, 0.6, 0],    // top-left
    [-1.4, 0.1, 0],    // bottom center-left
    [0.2, 0.7, 0],     // top center
    [1.7, 0.0, 0],     // bottom center-right
    [-2.2, -0.3, 0],   // bottom-left (low)
    [3.0, 0.5, 0],     // top-right
  ];

  return (
    <group position={[0, 1.5, -4]}>
      {achievements.map((ach, i) => (
        <Poster key={ach.id} ach={ach} position={positions[i] || [(-2 + i * 1.2), 0.3, 0]} />
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
      {/* Warm ambient — retro den baseline */}
      <ambientLight color="#3a2a18" intensity={0.7} />
      <hemisphereLight args={['#ffecd2', '#3a2a18', 0.5]} />
      {/* Central warm overhead */}
      <pointLight position={[0, 3.5, 0]} color="#ffecd2" intensity={0.8} distance={12} decay={2} />
      {/* Back wall wash — catches posters */}
      <directionalLight position={[0, 2, -3]} color="#ffd47a" intensity={0.4} castShadow={false} />
      {/* Warm fill left (near shelves) */}
      <pointLight position={[-3, 2, 1]} color="#ffb366" intensity={0.3} distance={9} decay={2} />
      {/* Warm fill right */}
      <pointLight position={[3, 1.5, 1]} color="#E3B25C" intensity={0.35} distance={8} decay={2} />
      {/* Subtle cool fill for depth — very low */}
      <directionalLight position={[4, 3, 3]} color="#8a9ab0" intensity={0.1} castShadow={false} />
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

  // Warm cream walls — clean retro den. Light enough for posters to pop.
  const creamWall = usePBRSet('plaster/Plaster001_1K-JPG', 3, 2, 0.5, '#f0e6d3');
  const accentWall = usePBRSet('plaster/Plaster001_1K-JPG', 3, 2, 0.5, '#ece0cc');
  const trimWood = usePBRSet('darkwood/darkwood', 2, 1, 0.5, '#8a7560');

  return (
    <>
      <RoomLights />
      <group>
        <RoomFloor />
        <Rug />
        {/* Warm cream walls — clean backdrop for dense decor */}
        <RoomWall mat={accentWall} position={[0, 1.5, -4]} rotation={[0, 0, 0]} />
        <RoomWall mat={creamWall} position={[-4, 1.5, 0]} rotation={[0, Math.PI / 2, 0]} />
        <RoomWall mat={creamWall} position={[4, 1.5, 0]} rotation={[0, -Math.PI / 2, 0]} />
        <RoomTrim mat={trimWood} />
        <StringLights />
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
      <MoonLamp />
      <FloorLamp />
      {/* Hanging plants for trailing greenery */}
      <HangingPlant position={[-2.5, 2.8, -3.5]} />
      <HangingPlant position={[2.8, 2.7, -2.0]} />
      <HangingPlant position={[-1.0, 2.9, 2.5]} />
      <Lamp onIntroComplete={handleIntroComplete} />
      <IntroText visible={introComplete} />
    </>
  );
}
