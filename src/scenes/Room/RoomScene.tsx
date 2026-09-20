import { useRef, useMemo, useEffect, useState, useCallback } from 'react';
import { useFrame, ThreeEvent } from '@react-three/fiber';
import { Environment, useTexture } from '@react-three/drei';
import * as THREE from 'three';
import { useScrollStore } from '../../systems/scroll/ScrollStore';
import { getCurrentWaypoint } from '../../systems/scroll/useScrollCamera';
import { useWorldStore } from '../../app/worldStore';

export function Lamp({ onIntroComplete }: { onIntroComplete: () => void }) {
  const scrollProgress = useScrollStore((s) => s.scrollProgress);
  const setHovered = useWorldStore((s) => s.setHovered);

  const lampGroupRef = useRef<THREE.Group>(null);
  const baseRef = useRef<THREE.Mesh>(null);
  const shadeRef = useRef<THREE.Mesh>(null);
  const bulbRef = useRef<THREE.Mesh>(null);
  const lightRef = useRef<THREE.PointLight>(null);

  const [lampOn, setLampOn] = useState(false);
  const [introPlayed, setIntroPlayed] = useState(false);

  // Load real PBR textures for lamp
  const baseTextures = useTexture({
    map: 'https://dl.polyhaven.org/file/ph-assets/Textures/metal/brass_rough/1k/brass_rough_diff_1k.jpg',
    normalMap: 'https://dl.polyhaven.org/file/ph-assets/Textures/metal/brass_rough/1k/brass_rough_nor_gl_1k.jpg',
    roughnessMap: 'https://dl.polyhaven.org/file/ph-assets/Textures/metal/brass_rough/1k/brass_rough_rough_1k.jpg',
    metalnessMap: 'https://dl.polyhaven.org/file/ph-assets/Textures/metal/brass_rough/1k/brass_rough_metal_1k.jpg',
    aoMap: 'https://dl.polyhaven.org/file/ph-assets/Textures/metal/brass_rough/1k/brass_rough_ao_1k.jpg',
  });

  const shadeTextures = useTexture({
    map: 'https://dl.polyhaven.org/file/ph-assets/Textures/fabric/canvas/1k/canvas_diff_1k.jpg',
    normalMap: 'https://dl.polyhaven.org/file/ph-assets/Textures/fabric/canvas/1k/canvas_nor_gl_1k.jpg',
    roughnessMap: 'https://dl.polyhaven.org/file/ph-assets/Textures/fabric/canvas/1k/canvas_rough_1k.jpg',
  });

  const baseMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#1a1a1a',
    roughness: 0.3,
    metalness: 0.7,
    map: baseTextures.map,
    normalMap: baseTextures.normalMap,
    roughnessMap: baseTextures.roughnessMap,
    metalnessMap: baseTextures.metalnessMap,
    aoMap: baseTextures.aoMap,
  }), [baseTextures]);

  const shadeMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#2a2018',
    roughness: 0.7,
    metalness: 0.05,
    side: THREE.DoubleSide,
    map: shadeTextures.map,
    normalMap: shadeTextures.normalMap,
    roughnessMap: shadeTextures.roughnessMap,
  }), [shadeTextures]);

  const shadeInnerMat = useMemo(
    () => new THREE.MeshStandardMaterial({
      color: '#3a2a1a',
      roughness: 0.5,
      metalness: 0.05,
      emissive: new THREE.Color('#ffd47a'),
      emissiveIntensity: 0,
    }),
    []
  );

  const bulbMat = useMemo(
    () => new THREE.MeshBasicMaterial({
      color: '#fff8e7',
      transparent: true,
      opacity: 0,
    }),
    []
  );

  const bulbGlowMat = useMemo(
    () => new THREE.MeshBasicMaterial({
      color: '#fff8e7',
      transparent: true,
      opacity: 0,
    }),
    []
  );

  useEffect(() => {
    if (scrollProgress > 0.02 && !lampOn) {
      setLampOn(true);
    }
  }, [scrollProgress, lampOn]);

  useEffect(() => {
    if (lampOn && !introPlayed) {
      const timer = setTimeout(() => {
        setIntroPlayed(true);
        onIntroComplete();
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [lampOn, introPlayed, onIntroComplete]);

  useFrame((state, delta) => {
    if (!lampGroupRef.current) return;

    if (lampOn && lightRef.current) {
      const targetIntensity = 2.5;
      lightRef.current.intensity += (targetIntensity - lightRef.current.intensity) * delta * 3;

      if (bulbRef.current && bulbRef.current.material instanceof THREE.MeshBasicMaterial) {
        const targetOpacity = 0.9;
        bulbRef.current.material.opacity += (targetOpacity - bulbRef.current.material.opacity) * delta * 4;
      }

      if (shadeRef.current && shadeRef.current.material instanceof THREE.MeshStandardMaterial) {
        const emissiveIntensity = Math.min(lightRef.current.intensity / 2.5, 1);
        shadeRef.current.material.emissiveIntensity = emissiveIntensity * 0.4;
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
    <group ref={lampGroupRef} position={[0, 0, 0]} onPointerOver={handlePointerOver} onPointerOut={handlePointerOut}>
      {/* Lamp Base - Heavy weighted cylinder with brass PBR */}
      <mesh ref={baseRef} position={[0, 0.35, 0]} receiveShadow castShadow>
        <cylinderGeometry args={[0.18, 0.22, 0.7, 24]} />
        <primitive object={baseMat} attach="material" />
      </mesh>

      {/* Base decorative ring */}
      <mesh position={[0, 0.7, 0]} receiveShadow castShadow>
        <torusGeometry args={[0.2, 0.015, 8, 24]} />
        <primitive object={baseMat} attach="material" />
      </mesh>

      {/* Lamp Stem */}
      <mesh position={[0, 1.1, 0]} receiveShadow castShadow>
        <cylinderGeometry args={[0.025, 0.03, 0.4, 12]} />
        <primitive object={baseMat} attach="material" />
      </mesh>

      {/* Lamp Shade - Tapered cylinder (emissive inner for bloom) */}
      <mesh ref={shadeRef} position={[0, 1.65, 0]} receiveShadow castShadow>
        <cylinderGeometry args={[0.12, 0.35, 0.45, 24, 1, true]} />
        <primitive object={shadeInnerMat} attach="material" />
      </mesh>

      {/* Shade outer surface with fabric PBR */}
      <mesh position={[0, 1.65, 0]} receiveShadow castShadow>
        <cylinderGeometry args={[0.125, 0.36, 0.46, 24, 1, true]} />
        <primitive object={shadeMat} attach="material" />
      </mesh>

      {/* Bulb - emissive sphere */}
      <mesh ref={bulbRef} position={[0, 1.52, 0]}>
        <sphereGeometry args={[0.045, 16, 16]} />
        <primitive object={bulbMat} attach="material" />
      </mesh>

      {/* Bulb glow - larger sphere for bloom */}
      <mesh position={[0, 1.52, 0]}>
        <sphereGeometry args={[0.08, 16, 16]} />
        <primitive object={bulbGlowMat} attach="material" />
      </mesh>

      {/* Point light inside shade */}
      <pointLight
        ref={lightRef}
        position={[0, 1.52, 0]}
        color="#ffd47a"
        intensity={0}
        distance={4}
        decay={2}
        castShadow={false}
      />

      {/* Subtle spotlight down from shade */}
      <spotLight
        position={[0, 1.65, 0]}
        color="#ffd47a"
        intensity={0}
        distance={3}
        angle={Math.PI / 3.5}
        penumbra={0.5}
        decay={2}
        castShadow={false}
      >
        <pointLight ref={lightRef} />
      </spotLight>
    </group>
  );
}

export function IntroText({ visible }: { visible: boolean }) {
  const scrollProgress = useScrollStore((s) => s.scrollProgress);

  if (!visible || scrollProgress < 0.03) return null;

  const opacity = Math.min(1, (scrollProgress - 0.03) / 0.04);

  return (
    <div
      className="fixed inset-0 pointer-events-none z-20 flex items-center justify-center"
      style={{ opacity }}
    >
      <div className="text-center px-6">
        <h1 className="font-display text-4xl sm:text-6xl md:text-7xl font-light tracking-[0.15em] text-[#FBF6EC]/90 leading-tight">
          Udbhav NC
        </h1>
        <p className="font-sans text-sm sm:text-base md:text-lg tracking-[0.2em] uppercase text-[#E3B25C]/70 mt-3">
          Computer Science & Data Science
        </p>
        <p className="font-mono text-xs tracking-wider text-[#FBF6EC]/40 mt-2">
          St. Joseph Engineering College, Mangaluru
        </p>
        <p className="font-mono text-[10px] tracking-wider text-[#FBF6EC]/30 mt-4">
          Second-year student building prototypes outside coursework
        </p>
      </div>
    </div>
  );
}

// Room components with real PBR textures
function RoomFloor() {
  const textures = useTexture({
    map: 'https://dl.polyhaven.org/file/ph-assets/Textures/wood/floor_boards/1k/floor_boards_diff_1k.jpg',
    normalMap: 'https://dl.polyhaven.org/file/ph-assets/Textures/wood/floor_boards/1k/floor_boards_nor_gl_1k.jpg',
    roughnessMap: 'https://dl.polyhaven.org/file/ph-assets/Textures/wood/floor_boards/1k/floor_boards_rough_1k.jpg',
    aoMap: 'https://dl.polyhaven.org/file/ph-assets/Textures/wood/floor_boards/1k/floor_boards_ao_1k.jpg',
    displacementMap: 'https://dl.polyhaven.org/file/ph-assets/Textures/wood/floor_boards/1k/floor_boards_disp_1k.png',
  });

  const mat = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#ffffff',
    map: textures.map,
    normalMap: textures.normalMap,
    roughnessMap: textures.roughnessMap,
    aoMap: textures.aoMap,
    displacementMap: textures.displacementMap,
    displacementScale: 0.02,
    roughness: 0.7,
    metalness: 0.0,
  }), [textures]);

  return (
    <mesh position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
      <planeGeometry args={[8, 8, 50, 50]} />
      <primitive object={mat} attach="material" />
    </mesh>
  );
}

function RoomWall({ position, rotation }: { position: [number, number, number]; rotation: [number, number, number] }) {
  const textures = useTexture({
    map: 'https://dl.polyhaven.org/file/ph-assets/Textures/concrete/concrete_plaster/1k/concrete_plaster_diff_1k.jpg',
    normalMap: 'https://dl.polyhaven.org/file/ph-assets/Textures/concrete/concrete_plaster/1k/concrete_plaster_nor_gl_1k.jpg',
    roughnessMap: 'https://dl.polyhaven.org/file/ph-assets/Textures/concrete/concrete_plaster/1k/concrete_plaster_rough_1k.jpg',
    aoMap: 'https://dl.polyhaven.org/file/ph-assets/Textures/concrete/concrete_plaster/1k/concrete_plaster_ao_1k.jpg',
  });

  const mat = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#ffffff',
    map: textures.map,
    normalMap: textures.normalMap,
    roughnessMap: textures.roughnessMap,
    aoMap: textures.aoMap,
    roughness: 0.9,
    metalness: 0.0,
  }), [textures]);

  return (
    <mesh position={position} rotation={rotation} receiveShadow>
      <planeGeometry args={[8, 4, 20, 10]} />
      <primitive object={mat} attach="material" />
    </mesh>
  );
}

export function RoomScene() {
  const scrollProgress = useScrollStore((s) => s.scrollProgress);
  const waypoint = getCurrentWaypoint(scrollProgress);

  const [introComplete, setIntroComplete] = useState(false);
  const handleIntroComplete = useCallback(() => setIntroComplete(true), []);

  useEffect(() => {
    if (waypoint) {
      // Camera position will be handled by CameraRig
    }
  }, [waypoint]);

  return (
    <>
      {/* HDRI Environment */}
      <Environment
        files="https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/venice_sunset_1k.hdr"
        background={false}
        resolution={256}
      />

      {/* Room geometry with PBR textures */}
      <group>
        <RoomFloor />
        <RoomWall position={[0, 1.5, -4]} rotation={[0, 0, 0]} />
        <RoomWall position={[-4, 1.5, 0]} rotation={[0, Math.PI / 2, 0]} />
        <RoomWall position={[4, 1.5, 0]} rotation={[0, -Math.PI / 2, 0]} />
      </group>

      {/* The Lamp - center of the room for intro */}
      <Lamp onIntroComplete={handleIntroComplete} />

      {/* Intro Text */}
      <IntroText visible={introComplete} />
    </>
  );
}