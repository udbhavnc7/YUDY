import { useRef, useMemo, useEffect, useState, useCallback } from 'react';
import { useFrame, ThreeEvent } from '@react-three/fiber';
import { useTexture, Html } from '@react-three/drei';
import * as THREE from 'three';
import { useScrollStore } from '../../systems/scroll/ScrollStore';
import { useWorldStore } from '../../app/worldStore';
import { ACHIEVEMENTS } from '../../data/achievements';

function easeInOutSine(x: number) {
  return -(Math.cos(Math.PI * x) - 1) / 2;
}

export function Lamp({ onIntroComplete }: { onIntroComplete: () => void }) {
  const scrollProgress = useScrollStore((s) => s.scrollProgress);
  const setHovered = useWorldStore((s) => s.setHovered);

  const lampGroupRef = useRef<THREE.Group>(null);
  const lightRef = useRef<THREE.PointLight>(null);
  const spotRef = useRef<THREE.SpotLight>(null);

  const [lampOn, setLampOn] = useState(false);
  const [introPlayed, setIntroPlayed] = useState(false);

  useEffect(() => {
    if (lampGroupRef.current) {
      lampGroupRef.current.layers.set(1);
    }
  }, []);

  const baseMat = useMemo(
    () => new THREE.MeshStandardMaterial({
      color: '#2a2a2a', roughness: 0.25, metalness: 0.85,
    }), []
  );
  const shadeMat = useMemo(
    () => new THREE.MeshStandardMaterial({
      color: '#1e1812', roughness: 0.75, metalness: 0.05, side: THREE.DoubleSide,
    }), []
  );
  const shadeInnerMat = useMemo(
    () => new THREE.MeshStandardMaterial({
      color: '#2a1f12', roughness: 0.5, metalness: 0.05,
      emissive: new THREE.Color('#ffd47a'), emissiveIntensity: 0,
    }), []
  );
  const bulbMat = useMemo(
    () => new THREE.MeshBasicMaterial({ color: '#fff8e7', transparent: true, opacity: 0 }), []
  );
  const bulbGlowMat = useMemo(
    () => new THREE.MeshBasicMaterial({ color: '#fff8e7', transparent: true, opacity: 0 }), []
  );

  const bulbRef = useRef<THREE.Mesh>(null);
  const shadeRef = useRef<THREE.Mesh>(null);
  const baseRef = useRef<THREE.Mesh>(null);

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
      const targetIntensity = 3.0;
      lightRef.current.intensity += (targetIntensity - lightRef.current.intensity) * delta * 3;
      if (spotRef.current) {
        spotRef.current.intensity += (targetIntensity * 0.5 - spotRef.current.intensity) * delta * 3;
      }
      if (bulbRef.current && bulbRef.current.material instanceof THREE.MeshBasicMaterial) {
        const targetOpacity = 0.9;
        bulbRef.current.material.opacity += (targetOpacity - bulbRef.current.material.opacity) * delta * 4;
      }
      if (shadeRef.current && shadeRef.current.material instanceof THREE.MeshStandardMaterial) {
        const emissiveIntensity = Math.min(lightRef.current.intensity / 2.0, 2.0);
        shadeRef.current.material.emissiveIntensity = emissiveIntensity * 0.8;
      }
    }

    const breathingY = Math.sin(state.clock.elapsedTime * 0.8) * 0.005;
    lampGroupRef.current.position.y = breathingY;
  });

  const handlePointerOver = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    document.body.style.cursor = 'pointer';
    setHovered('lamp');
  };
  const handlePointerOut = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    document.body.style.cursor = 'default';
    setHovered(null);
  };

  return (
    <group ref={lampGroupRef} position={[0, 0, 0]}
      onPointerOver={handlePointerOver} onPointerOut={handlePointerOut}>
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
      <mesh position={[0, 1.52, 0]}>
        <sphereGeometry args={[0.08, 16, 16]} />
        <primitive object={bulbGlowMat} attach="material" />
      </mesh>
      <pointLight ref={lightRef} position={[0, 1.52, 0]} color="#ffd47a" intensity={0} distance={5} decay={2} castShadow={false} />
      <spotLight ref={spotRef} position={[0, 1.65, 0]} color="#ffd47a" intensity={0} distance={4} angle={Math.PI / 3.5} penumbra={0.5} decay={2} castShadow={false} />
    </group>
  );
}

export function IntroText({ visible }: { visible: boolean }) {
  const scrollProgress = useScrollStore((s) => s.scrollProgress);
  if (!visible || scrollProgress < 0.03) return null;
  const opacity = Math.min(1, (scrollProgress - 0.03) / 0.04);
  return (
    <Html fullscreen pointerEvents="none" zIndexRange={[20, 30]}>
      <div className="fixed inset-0 pointer-events-none z-20 flex items-center justify-center" style={{ opacity }}>
        <div className="text-center px-6">
          <h1 className="font-display text-4xl sm:text-6xl md:text-7xl font-light tracking-[0.15em] text-[#FBF6EC]/90 leading-tight">Udbhav NC</h1>
          <p className="font-sans text-sm sm:text-base md:text-lg tracking-[0.2em] uppercase text-[#E3B25C]/70 mt-3">Computer Science & Data Science</p>
          <p className="font-mono text-xs tracking-wider text-[#FBF6EC]/40 mt-2">St. Joseph Engineering College, Mangaluru</p>
          <p className="font-mono text-[10px] tracking-wider text-[#FBF6EC]/30 mt-4">Second-year student building prototypes outside coursework</p>
        </div>
      </div>
    </Html>
  );
}

function RoomFloor() {
  const [floorTex] = useTexture(['/paris_terrace_bg.jpg']);
  const mat = useMemo(() => {
    const m = new THREE.MeshStandardMaterial({ color: '#1a1612', roughness: 0.7, metalness: 0.05 });
    if (floorTex) { m.map = floorTex; floorTex.colorSpace = THREE.SRGBColorSpace; }
    return m;
  }, [floorTex]);
  return (
    <mesh position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
      <planeGeometry args={[8, 8, 10, 10]} />
      <primitive object={mat} attach="material" />
    </mesh>
  );
}

function RoomWall({ position, rotation }: { position: [number, number, number]; rotation: [number, number, number] }) {
  const [wallTex] = useTexture(['/paris_sunset_balcony.jpg']);
  const mat = useMemo(() => {
    const m = new THREE.MeshStandardMaterial({ color: '#14110f', roughness: 0.9, metalness: 0.0 });
    if (wallTex) { m.map = wallTex; wallTex.colorSpace = THREE.SRGBColorSpace; }
    return m;
  }, [wallTex]);
  return (
    <mesh position={position} rotation={rotation} receiveShadow>
      <planeGeometry args={[8, 4, 10, 5]} />
      <primitive object={mat} attach="material" />
    </mesh>
  );
}

function Chair() {
  const [leatherTex] = useTexture(['/paris_balcony_sunset.jpg']);
  const scrollProgress = useScrollStore((s) => s.scrollProgress);
  const setHovered = useWorldStore((s) => s.setHovered);
  const chairGroupRef = useRef<THREE.Group>(null);

  const leatherMat = useMemo(() => {
    const m = new THREE.MeshStandardMaterial({ color: '#1a1512', roughness: 0.6, metalness: 0.0 });
    if (leatherTex) { m.map = leatherTex; leatherTex.colorSpace = THREE.SRGBColorSpace; }
    return m;
  }, [leatherTex]);
  const woodMat = useMemo(() => new THREE.MeshStandardMaterial({ color: '#2d1f15', roughness: 0.7, metalness: 0.0 }), []);

  useFrame(() => {
    if (!chairGroupRef.current) return;
    if (scrollProgress >= 0.10 && scrollProgress < 0.22) {
      const zoneProgress = (scrollProgress - 0.10) / (0.22 - 0.10);
      chairGroupRef.current.rotation.y = easeInOutSine(zoneProgress) * Math.PI * 2;
    } else if (scrollProgress >= 0.22) {
      chairGroupRef.current.rotation.y = easeInOutSine(1) * Math.PI * 2;
    } else {
      chairGroupRef.current.rotation.y = 0;
    }
  });

  return (
    <group ref={chairGroupRef} position={[1.2, 0, 1.5]} castShadow receiveShadow
      onPointerOver={(e) => { e.stopPropagation(); setHovered('chair'); }}
      onPointerOut={(e) => { e.stopPropagation(); setHovered(null); }}>
      <mesh position={[0, 0.45, 0]}><boxGeometry args={[0.6, 0.08, 0.55]} /><primitive object={leatherMat} attach="material" /></mesh>
      <mesh position={[0, 0.9, -0.22]}><boxGeometry args={[0.6, 0.9, 0.08]} /><primitive object={leatherMat} attach="material" /></mesh>
      {[-0.26, 0.26].map((x) =>
        [-0.22, 0.22].map((z) => (
          <mesh key={`${x}-${z}`} position={[x, 0.22, z]}><cylinderGeometry args={[0.035, 0.035, 0.45, 12]} /><primitive object={woodMat} attach="material" /></mesh>
        ))
      )}
    </group>
  );
}

function Sofa() {
  const [fabricTex] = useTexture(['/paris_balcony_sunset.jpg']);
  const setHovered = useWorldStore((s) => s.setHovered);
  const fabricMat = useMemo(() => {
    const m = new THREE.MeshStandardMaterial({ color: '#1e1a16', roughness: 0.8, metalness: 0.0 });
    if (fabricTex) { m.map = fabricTex; fabricTex.colorSpace = THREE.SRGBColorSpace; }
    return m;
  }, [fabricTex]);
  const woodMat = useMemo(() => new THREE.MeshStandardMaterial({ color: '#2d1f15', roughness: 0.7, metalness: 0.0 }), []);

  return (
    <group position={[0, 0, -2.5]} castShadow receiveShadow
      onPointerOver={(e) => { e.stopPropagation(); setHovered('sofa'); }}
      onPointerOut={(e) => { e.stopPropagation(); setHovered(null); }}>
      <mesh position={[0, 0.2, 0]}><boxGeometry args={[1.8, 0.4, 0.8]} /><primitive object={fabricMat} attach="material" /></mesh>
      <mesh position={[0, 0.65, -0.35]}><boxGeometry args={[1.8, 0.5, 0.1]} /><primitive object={fabricMat} attach="material" /></mesh>
      <mesh position={[-0.95, 0.5, 0]}><boxGeometry args={[0.1, 0.6, 0.7]} /><primitive object={fabricMat} attach="material" /></mesh>
      <mesh position={[0.95, 0.5, 0]}><boxGeometry args={[0.1, 0.6, 0.7]} /><primitive object={fabricMat} attach="material" /></mesh>
      {[-0.8, 0.8].map((x) =>
        [-0.3, 0.3].map((z) => (
          <mesh key={`${x}-${z}`} position={[x, 0.1, z]}><cylinderGeometry args={[0.04, 0.04, 0.2, 12]} /><primitive object={woodMat} attach="material" /></mesh>
        ))
      )}
    </group>
  );
}

function Bookshelf({ position, scale = 1, isGroup = false, projectIds = [] }: { position: [number, number, number]; scale?: number; isGroup?: boolean; projectIds?: string[] }) {
  const woodMat = useMemo(() => new THREE.MeshStandardMaterial({ color: '#2d1f15', roughness: 0.6, metalness: 0.0 }), []);
  const bookSpineMat = useMemo(() => new THREE.MeshStandardMaterial({ color: '#3d2f1f', roughness: 0.5, metalness: 0.0 }), []);
  const setHovered = useWorldStore((s) => s.setHovered);
  const shelfDepth = isGroup ? 0.45 : 0.3;
  const shelfHeight = isGroup ? 0.35 : 0.28;
  const shelfCount = isGroup ? 4 : 5;

  return (
    <group position={position} scale={scale} castShadow receiveShadow
      onPointerOver={(e) => { e.stopPropagation(); setHovered(`bookshelf-${position[0]}`); }}
      onPointerOut={(e) => { e.stopPropagation(); setHovered(null); }}>
      <mesh position={[-0.6, shelfCount * shelfHeight / 2, 0]}><boxGeometry args={[0.05, shelfCount * shelfHeight, shelfDepth]} /><primitive object={woodMat} attach="material" /></mesh>
      <mesh position={[0.6, shelfCount * shelfHeight / 2, 0]}><boxGeometry args={[0.05, shelfCount * shelfHeight, shelfDepth]} /><primitive object={woodMat} attach="material" /></mesh>
      <mesh position={[0, shelfCount * shelfHeight, 0]}><boxGeometry args={[1.25, 0.04, shelfDepth + 0.05]} /><primitive object={woodMat} attach="material" /></mesh>
      <mesh position={[0, 0, 0]}><boxGeometry args={[1.25, 0.04, shelfDepth + 0.05]} /><primitive object={woodMat} attach="material" /></mesh>
      {[...Array(shelfCount)].map((_, i) => (
        <mesh key={i} position={[0, (i + 0.5) * shelfHeight, 0]}><boxGeometry args={[1.15, 0.03, shelfDepth - 0.02]} /><primitive object={bookSpineMat} attach="material" /></mesh>
      ))}
      <mesh position={[0, shelfCount * shelfHeight / 2, -shelfDepth / 2 + 0.01]}><planeGeometry args={[1.15, shelfCount * shelfHeight]} /><primitive object={woodMat} attach="material" /></mesh>
      {projectIds.slice(0, shelfCount).map((projectId, i) => (
        <group key={projectId} position={[0, (i + 0.5) * shelfHeight + 0.02, 0]}>
          <mesh position={[0, 0, shelfDepth / 2 + 0.01]}><boxGeometry args={[0.08, 0.25, shelfDepth - 0.04]} /><primitive object={bookSpineMat} attach="material" /></mesh>
        </group>
      ))}
    </group>
  );
}

const STATUS_COLORS: Record<string, string> = {
  winner: '#E3B25C',
  top: '#4a6fa5',
  participated: '#50C878',
};

function PosterWall() {
  const scrollProgress = useScrollStore((s) => s.scrollProgress);
  const setHovered = useWorldStore((s) => s.setHovered);
  const visible = scrollProgress >= 0.32 && scrollProgress < 0.47;
  if (!visible) return null;

  const achievements = ACHIEVEMENTS.slice(0, 4);

  return (
    <group position={[0, 1.5, -4]}
      onPointerOver={(e) => { e.stopPropagation(); setHovered('poster-wall'); }}
      onPointerOut={(e) => { e.stopPropagation(); setHovered(null); }}>
      <mesh position={[0, 0, -0.01]}>
        <planeGeometry args={[8, 3]} />
        <primitive object={new THREE.MeshStandardMaterial({ color: '#0a0a0a' })} attach="material" />
      </mesh>
      {achievements.map((ach, i) => (
        <group key={ach.id} position={[-2 + i * 2, 0, 0]}>
          <mesh position={[0, 0.8, 0]}>
            <boxGeometry args={[1.5, 1.0, 0.02]} />
            <primitive object={new THREE.MeshStandardMaterial({ color: STATUS_COLORS[ach.status] || '#4a6fa5' })} attach="material" />
          </mesh>
        </group>
      ))}
    </group>
  );
}

function PlantShowcase() {
  const scrollProgress = useScrollStore((s) => s.scrollProgress);
  const setHovered = useWorldStore((s) => s.setHovered);
  const visible = scrollProgress >= 0.74 && scrollProgress < 0.87;
  if (!visible) return null;

  const plantMat = useMemo(() => new THREE.MeshStandardMaterial({ color: '#2d5a27', roughness: 0.8, metalness: 0.0 }), []);
  const potMat = useMemo(() => new THREE.MeshStandardMaterial({ color: '#8B6914', roughness: 0.7, metalness: 0.0 }), []);

  return (
    <group position={[1.8, 0, -0.5]}
      onPointerOver={(e) => { e.stopPropagation(); setHovered('plant-showcase'); }}
      onPointerOut={(e) => { e.stopPropagation(); setHovered(null); }}>
      <group position={[0, 0, 0]}>
        <mesh position={[0, 0.3, 0]} castShadow><cylinderGeometry args={[0.15, 0.2, 0.6, 8]} /><primitive object={potMat} attach="material" /></mesh>
        <mesh position={[0, 0.65, 0]} castShadow><sphereGeometry args={[0.4, 8, 6]} /><primitive object={plantMat} attach="material" /></mesh>
      </group>
      <group position={[0.8, 0, -0.3]}>
        <mesh position={[0, 0.25, 0]} castShadow><cylinderGeometry args={[0.1, 0.15, 0.5, 8]} /><primitive object={potMat} attach="material" /></mesh>
        <mesh position={[0, 0.5, 0]} castShadow><sphereGeometry args={[0.3, 8, 6]} /><primitive object={plantMat} attach="material" /></mesh>
      </group>
    </group>
  );
}

function RoomLights() {
  return (
    <>
      <ambientLight color="#1a1a2e" intensity={0.3} />
      <pointLight position={[0, 3.5, 0]} color="#ffecd2" intensity={0.5} distance={10} decay={2} />
      <directionalLight position={[0, 2, -3]} color="#ffd47a" intensity={0.3} castShadow={false} />
      <pointLight position={[-3, 2, 1]} color="#4a6fa5" intensity={0.2} distance={8} decay={2} />
      <pointLight position={[0, 0.1, 0]} color="#1a1612" intensity={0.1} distance={3} decay={2} />
    </>
  );
}

export function RoomScene() {
  const [introComplete, setIntroComplete] = useState(false);
  const handleIntroComplete = useCallback(() => setIntroComplete(true), []);

  return (
    <>
      <RoomLights />
      <group>
        <RoomFloor />
        <RoomWall position={[0, 1.5, -4]} rotation={[0, 0, 0]} />
        <RoomWall position={[-4, 1.5, 0]} rotation={[0, Math.PI / 2, 0]} />
        <RoomWall position={[4, 1.5, 0]} rotation={[0, -Math.PI / 2, 0]} />
      </group>
      <Chair />
      <Sofa />
      <Bookshelf position={[-3.2, 0, 1.2]} projectIds={['nayana', 'medaether', 'sanchay', 'lume', 'tattva']} />
      <Bookshelf position={[-3.2, 0, -1.2]} scale={1.3} isGroup={true} projectIds={['kawach', 'vortex', 'prism']} />
      <Bookshelf position={[3.2, 0, 1.2]} scale={1.3} isGroup={true} projectIds={['smartcart', 'chatguard', 'cardioscan']} />
      <PosterWall />
      <PlantShowcase />
      <Lamp onIntroComplete={handleIntroComplete} />
      <IntroText visible={introComplete} />
    </>
  );
}
