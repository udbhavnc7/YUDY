import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { MeshPortalMaterial } from '@react-three/drei';
import * as THREE from 'three';
import { useWorldStore } from '../../app/worldStore';
import { PALETTE } from '../../data/palette';
import { WorkshopScene } from '../Workshop/WorkshopScene';

// Instanced glistening rain backlit by sunset
function InstancedRain({ restStage }: { restStage: number }) {
  const count = 1200;
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  const drops = useMemo(() => {
    const arr = [];
    for (let i = 0; i < count; i++) {
      arr.push({
        x: (Math.random() - 0.5) * 16,
        y: Math.random() * 9 + 0.5,
        z: Math.random() * 12 - 5,
        speed: 4.8 + Math.random() * 3.0,
        scaleY: 0.15 + Math.random() * 0.15,
      });
    }
    return arr;
  }, [count]);

  useFrame((_, delta) => {
    if (!meshRef.current) return;
    const speedMult = restStage >= 2 ? 0.72 : 1.0;
    const activeLimit = restStage >= 2 ? count : Math.floor(count * 0.75);

    for (let i = 0; i < count; i++) {
      const drop = drops[i];
      if (i < activeLimit) {
        drop.y -= drop.speed * speedMult * delta;
        drop.x += 0.3 * delta;
        if (drop.y < 0) {
          drop.y = 9;
          drop.x = (Math.random() - 0.5) * 16;
        }
        dummy.position.set(drop.x, drop.y, drop.z);
        dummy.scale.set(0.009, drop.scaleY, 0.009);
      } else {
        dummy.position.set(0, -999, 0);
      }
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    }
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]} frustumCulled={false}>
      <cylinderGeometry args={[1, 1, 1, 4]} />
      <meshBasicMaterial
        color={'#FFE6A3'}
        transparent
        opacity={0.65}
        depthWrite={false}
      />
    </instancedMesh>
  );
}

// Gorgeous Radiant Sunset Sky Backdrop
function SunsetSkyDome() {
  return (
    <group position={[0, 0, -22]}>
      {/* Radiant Golden-Peach Sunset Sky Plane */}
      <mesh position={[0, 5, 0]}>
        <planeGeometry args={[65, 28]} />
        <meshBasicMaterial color={'#FF8B4D'} />
      </mesh>
      {/* Upper twilight gradient overlay */}
      <mesh position={[0, 11, 0.1]}>
        <planeGeometry args={[65, 16]} />
        <meshBasicMaterial color={'#453257'} transparent opacity={0.88} />
      </mesh>
      {/* Glowing Horizon Sun Disc behind the skyline */}
      <mesh position={[-1.2, 4.2, 0.2]}>
        <circleGeometry args={[4.2, 32]} />
        <meshBasicMaterial color={'#FFF1BE'} />
      </mesh>
      {/* Soft atmospheric sunset haze */}
      <mesh position={[0, 3.2, 0.3]}>
        <planeGeometry args={[65, 9]} />
        <meshBasicMaterial color={'#FFA86B'} transparent opacity={0.65} />
      </mesh>
    </group>
  );
}

// Majestic Eiffel Tower on the Sunset Horizon
function EiffelTower() {
  const setHovered = useWorldStore((s) => s.setHovered);
  const beaconRef = useRef<THREE.PointLight>(null);

  useFrame((state) => {
    if (beaconRef.current) {
      beaconRef.current.intensity = 2.8 + Math.sin(state.clock.elapsedTime * 2.8) * 1.6;
    }
  });

  return (
    <group
      position={[-1.2, 0.6, -17]}
      scale={[1.22, 1.32, 1.22]}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered('eiffel');
      }}
      onPointerOut={(e) => {
        e.stopPropagation();
        setHovered(null);
      }}
    >
      <mesh position={[0, 4.5, 0]}>
        <cylinderGeometry args={[2.5, 4.0, 9.5, 8]} />
        <meshBasicMaterial visible={false} />
      </mesh>

      {/* Base Archway */}
      <mesh position={[0, 1.1, 0]}>
        <torusGeometry args={[1.5, 0.2, 6, 16, Math.PI]} />
        <meshStandardMaterial color={'#1D2333'} roughness={0.7} />
      </mesh>

      {/* 4 Tapered Lattice Pylons */}
      <mesh position={[-1.7, 1.1, 0.4]} rotation={[0.08, 0, -0.26]}>
        <cylinderGeometry args={[0.22, 0.52, 2.6, 4]} />
        <meshStandardMaterial color={'#1D2333'} roughness={0.75} />
      </mesh>
      <mesh position={[1.7, 1.1, 0.4]} rotation={[0.08, 0, 0.26]}>
        <cylinderGeometry args={[0.22, 0.52, 2.6, 4]} />
        <meshStandardMaterial color={'#1D2333'} roughness={0.75} />
      </mesh>
      <mesh position={[-1.7, 1.1, -0.4]} rotation={[-0.08, 0, -0.26]}>
        <cylinderGeometry args={[0.22, 0.52, 2.6, 4]} />
        <meshStandardMaterial color={'#1D2333'} roughness={0.75} />
      </mesh>
      <mesh position={[1.7, 1.1, -0.4]} rotation={[-0.08, 0, 0.26]}>
        <cylinderGeometry args={[0.22, 0.52, 2.6, 4]} />
        <meshStandardMaterial color={'#1D2333'} roughness={0.75} />
      </mesh>

      {/* First Platform */}
      <mesh position={[0, 2.3, 0]}>
        <boxGeometry args={[3.2, 0.22, 1.2]} />
        <meshStandardMaterial color={'#161B29'} roughness={0.6} />
      </mesh>
      <mesh position={[0, 2.44, 0]}>
        <boxGeometry args={[3.0, 0.08, 1.0]} />
        <meshBasicMaterial color={PALETTE.gold} />
      </mesh>

      {/* Second Tier Legs */}
      <mesh position={[-0.8, 3.7, 0]} rotation={[0, 0, -0.16]}>
        <cylinderGeometry args={[0.18, 0.28, 2.6, 4]} />
        <meshStandardMaterial color={'#1D2333'} roughness={0.75} />
      </mesh>
      <mesh position={[0.8, 3.7, 0]} rotation={[0, 0, 0.16]}>
        <cylinderGeometry args={[0.18, 0.28, 2.6, 4]} />
        <meshStandardMaterial color={'#1D2333'} roughness={0.75} />
      </mesh>

      {/* Second Platform */}
      <mesh position={[0, 4.9, 0]}>
        <boxGeometry args={[1.8, 0.18, 0.8]} />
        <meshStandardMaterial color={'#161B29'} roughness={0.6} />
      </mesh>

      {/* Spire Tower Body */}
      <mesh position={[0, 6.8, 0]}>
        <cylinderGeometry args={[0.12, 0.45, 3.5, 4]} />
        <meshStandardMaterial color={'#1D2333'} roughness={0.7} />
      </mesh>

      {/* Lantern & Golden Beacon */}
      <mesh position={[0, 8.6, 0]}>
        <sphereGeometry args={[0.26, 8, 8]} />
        <meshBasicMaterial color={'#FFE894'} />
      </mesh>
      <mesh position={[0, 9.4, 0]}>
        <cylinderGeometry args={[0.02, 0.05, 1.5, 4]} />
        <meshBasicMaterial color={'#FFF6DE'} />
      </mesh>

      <pointLight
        ref={beaconRef}
        position={[0, 8.8, 0]}
        color={'#FFD269'}
        intensity={3.5}
        distance={30}
        decay={1.8}
      />
    </group>
  );
}

// Lush Foliage Potted Plants
function BalconyPlants() {
  return (
    <group>
      {/* Plant 1: Large Terracotta Planter with Palm / Monstera Leaves (Left corner) */}
      <group position={[-2.4, 0, -0.6]}>
        {/* Terracotta pot */}
        <mesh position={[0, 0.35, 0]}>
          <cylinderGeometry args={[0.38, 0.28, 0.7, 16]} />
          <meshStandardMaterial color={'#B25938'} roughness={0.7} />
        </mesh>
        <mesh position={[0, 0.7, 0]}>
          <cylinderGeometry args={[0.4, 0.38, 0.08, 16]} />
          <meshStandardMaterial color={'#A04B2C'} roughness={0.7} />
        </mesh>
        {/* Pot soil */}
        <mesh position={[0, 0.68, 0]}>
          <cylinderGeometry args={[0.36, 0.36, 0.04, 12]} />
          <meshStandardMaterial color={'#241A15'} roughness={0.9} />
        </mesh>

        {/* Big Broad Tropical Leaves */}
        {[-0.5, -0.2, 0.15, 0.4, 0.7].map((angle, i) => (
          <group key={i} position={[0, 0.7, 0]} rotation={[0.3, angle * Math.PI, -0.35 + i * 0.15]}>
            <mesh position={[0, 0.45, 0]}>
              <boxGeometry args={[0.02, 0.9, 0.02]} />
              <meshStandardMaterial color={'#2A4A28'} />
            </mesh>
            <mesh position={[0, 0.75, 0]} rotation={[0.4, 0, 0]}>
              <coneGeometry args={[0.26, 0.65, 3]} />
              <meshStandardMaterial color={'#3C6A37'} roughness={0.5} />
            </mesh>
          </group>
        ))}
      </group>

      {/* Plant 2: Trailing Ivy on Left Railing */}
      <group position={[-1.5, 0.95, -1.6]}>
        {/* Planter box hooked on railing */}
        <mesh position={[0, -0.08, 0]}>
          <boxGeometry args={[0.7, 0.2, 0.22]} />
          <meshStandardMaterial color={'#8C4328'} roughness={0.8} />
        </mesh>
        {/* Overflowing trailing green clusters */}
        {[-0.25, -0.08, 0.1, 0.25].map((x, i) => (
          <mesh key={i} position={[x, -0.18 - (i % 2) * 0.12, 0.08]} rotation={[0.2, 0, (i - 1.5) * 0.2]}>
            <sphereGeometry args={[0.13, 7, 7]} />
            <meshStandardMaterial color={'#48753E'} roughness={0.6} />
          </mesh>
        ))}
      </group>

      {/* Plant 3: Blooming Lavender / Flowers in Terracotta Pot (Right foreground) */}
      <group position={[2.1, 0, 0.2]}>
        <mesh position={[0, 0.25, 0]}>
          <cylinderGeometry args={[0.26, 0.18, 0.5, 16]} />
          <meshStandardMaterial color={'#B86242'} roughness={0.7} />
        </mesh>
        {/* Foliage bush */}
        <mesh position={[0, 0.55, 0]}>
          <sphereGeometry args={[0.32, 10, 8]} />
          <meshStandardMaterial color={'#3F6335'} roughness={0.6} />
        </mesh>
        {/* Blooming lilac / gold flower spikes */}
        {[-0.12, 0, 0.14].map((x, i) =>
          [-0.1, 0.08].map((z, j) => (
            <mesh key={`${i}-${j}`} position={[x, 0.78, z]}>
              <cylinderGeometry args={[0.03, 0.04, 0.24, 6]} />
              <meshStandardMaterial color={'#C784A6'} />
            </mesh>
          ))
        )}
      </group>

      {/* Plant 4: Trailing Ivy on Right Railing */}
      <group position={[1.8, 0.95, -1.6]}>
        <mesh position={[0, -0.08, 0]}>
          <boxGeometry args={[0.8, 0.2, 0.22]} />
          <meshStandardMaterial color={'#8C4328'} roughness={0.8} />
        </mesh>
        {[-0.28, -0.08, 0.12, 0.28].map((x, i) => (
          <mesh key={i} position={[x, -0.2 - (i % 2) * 0.14, 0.08]}>
            <sphereGeometry args={[0.14, 7, 7]} />
            <meshStandardMaterial color={'#48753E'} roughness={0.6} />
          </mesh>
        ))}
      </group>

      {/* Plant 5: Slender Olive / Citrus Tree (Right background corner) */}
      <group position={[2.6, 0, -1.2]}>
        <mesh position={[0, 0.45, 0]}>
          <cylinderGeometry args={[0.34, 0.25, 0.9, 16]} />
          <meshStandardMaterial color={'#9C4C30'} roughness={0.7} />
        </mesh>
        {/* Trunk */}
        <mesh position={[0, 1.2, 0]} rotation={[0.05, 0, -0.04]}>
          <cylinderGeometry args={[0.04, 0.06, 1.3, 8]} />
          <meshStandardMaterial color={'#42342A'} roughness={0.8} />
        </mesh>
        {/* Foliage canopy */}
        <mesh position={[0, 1.85, 0]}>
          <sphereGeometry args={[0.55, 10, 8]} />
          <meshStandardMaterial color={'#4C6E3E'} roughness={0.6} />
        </mesh>
        <mesh position={[-0.15, 2.2, 0.05]}>
          <sphereGeometry args={[0.42, 8, 8]} />
          <meshStandardMaterial color={'#5A804A'} roughness={0.6} />
        </mesh>
      </group>
    </group>
  );
}

// Decorative String Lights & Lanterns
function BalconyDecorations() {
  return (
    <group>
      {/* Warm Fairy String Lights draped along the handrail */}
      {[-3.2, -2.4, -1.6, -0.8, 0, 0.8, 1.6, 2.4, 3.2].map((x, i) => (
        <group key={i} position={[x, 0.94 - Math.sin((i / 8) * Math.PI) * 0.08, -1.55]}>
          {/* Glowing bulb */}
          <mesh>
            <sphereGeometry args={[0.032, 8, 8]} />
            <meshBasicMaterial color={'#FFE89E'} />
          </mesh>
          <pointLight color={'#FFB852'} intensity={0.4} distance={1.6} />
        </group>
      ))}

      {/* Moroccan / Parisian Glass Lantern on terrace floor (Left side) */}
      <group position={[-1.55, 0, -0.2]}>
        <mesh position={[0, 0.22, 0]}>
          <cylinderGeometry args={[0.12, 0.14, 0.44, 6]} />
          <meshStandardMaterial color={'#1D2333'} metalness={0.8} roughness={0.3} />
        </mesh>
        {/* Glass panel */}
        <mesh position={[0, 0.22, 0]}>
          <cylinderGeometry args={[0.11, 0.13, 0.38, 6]} />
          <meshStandardMaterial color={'#FFF1BE'} transparent opacity={0.65} />
        </mesh>
        {/* Candle light inside */}
        <mesh position={[0, 0.18, 0]}>
          <sphereGeometry args={[0.035, 8, 8]} />
          <meshBasicMaterial color={'#FFA834'} />
        </mesh>
        <pointLight position={[0, 0.22, 0]} color={'#FFB042'} intensity={1.8} distance={3.5} />
      </group>

      {/* Parisian Bistro Chairs */}
      {/* Chair 1 (Left of table) */}
      <group position={[-0.65, 0, 0.75]} rotation={[0, 0.6, 0]}>
        {/* Round seat */}
        <mesh position={[0, 0.52, 0]}>
          <cylinderGeometry args={[0.22, 0.22, 0.03, 16]} />
          <meshStandardMaterial color={'#8C4B2E'} roughness={0.6} />
        </mesh>
        {/* Curved backrest */}
        <mesh position={[-0.18, 0.85, 0]} rotation={[0, 0, -0.15]}>
          <torusGeometry args={[0.2, 0.018, 6, 16, Math.PI]} />
          <meshStandardMaterial color={'#1D2333'} metalness={0.7} />
        </mesh>
        {/* 4 legs */}
        {[-0.14, 0.14].map((x) =>
          [-0.14, 0.14].map((z) => (
            <mesh key={`${x}-${z}`} position={[x, 0.26, z]}>
              <cylinderGeometry args={[0.015, 0.015, 0.52, 6]} />
              <meshStandardMaterial color={'#1D2333'} />
            </mesh>
          ))
        )}
      </group>

      {/* Chair 2 (Right of table) */}
      <group position={[0.95, 0, 0.75]} rotation={[0, -0.6, 0]}>
        <mesh position={[0, 0.52, 0]}>
          <cylinderGeometry args={[0.22, 0.22, 0.03, 16]} />
          <meshStandardMaterial color={'#8C4B2E'} roughness={0.6} />
        </mesh>
        <mesh position={[0.18, 0.85, 0]} rotation={[0, 0, 0.15]}>
          <torusGeometry args={[0.2, 0.018, 6, 16, Math.PI]} />
          <meshStandardMaterial color={'#1D2333'} metalness={0.7} />
        </mesh>
        {[-0.14, 0.14].map((x) =>
          [-0.14, 0.14].map((z) => (
            <mesh key={`${x}-${z}`} position={[x, 0.26, z]}>
              <cylinderGeometry args={[0.015, 0.015, 0.52, 6]} />
              <meshStandardMaterial color={'#1D2333'} />
            </mesh>
          ))
        )}
      </group>
    </group>
  );
}

// Parisian Haussmannian Balcony Balustrade and Rooftop Horizon
function ParisBalconyAndSkyline() {
  return (
    <group>
      {/* Terracotta Floor Tiles with Polished Warm Sunset Reflections */}
      <mesh position={[0, -0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[12, 10]} />
        <meshStandardMaterial
          color={'#5A3B30'}
          roughness={0.22}
          metalness={0.18}
        />
      </mesh>

      {/* Balcony Stone Plinth (Edge of terrace) */}
      <mesh position={[0, 0.12, -1.6]}>
        <boxGeometry args={[9.0, 0.24, 0.22]} />
        <meshStandardMaterial color={'#242D3D'} roughness={0.6} />
      </mesh>

      {/* Wrought-Iron Handrail */}
      <mesh position={[0, 0.96, -1.6]}>
        <boxGeometry args={[9.0, 0.06, 0.08]} />
        <meshStandardMaterial color={'#161B29'} metalness={0.6} roughness={0.3} />
      </mesh>
      <mesh position={[0, 0.55, -1.6]}>
        <boxGeometry args={[9.0, 0.03, 0.04]} />
        <meshStandardMaterial color={'#161B29'} roughness={0.5} />
      </mesh>

      {/* Balusters with decorative bronze rosettes */}
      {[-4.0, -3.2, -2.4, -1.6, -0.8, 0, 0.8, 1.6, 2.4, 3.2, 4.0].map((x) => (
        <group key={x} position={[x, 0.55, -1.6]}>
          <mesh>
            <cylinderGeometry args={[0.018, 0.018, 0.78, 6]} />
            <meshStandardMaterial color={'#161B29'} roughness={0.4} />
          </mesh>
          <mesh position={[0, 0.14, 0]} rotation={[0, 0, Math.PI / 4]}>
            <ringGeometry args={[0.05, 0.075, 4]} />
            <meshStandardMaterial color={PALETTE.gold} metalness={0.8} roughness={0.25} />
          </mesh>
          <mesh position={[0, -0.14, 0]} rotation={[0, 0, Math.PI / 4]}>
            <ringGeometry args={[0.05, 0.075, 4]} />
            <meshStandardMaterial color={PALETTE.gold} metalness={0.8} roughness={0.25} />
          </mesh>
        </group>
      ))}

      {/* Parisian Mansard Roofs in Midground */}
      <mesh position={[-5.2, 0.6, -7]} rotation={[0, 0.35, 0]}>
        <boxGeometry args={[6, 2.6, 5]} />
        <meshStandardMaterial color={'#232F42'} roughness={0.7} />
      </mesh>
      <mesh position={[-5.2, 2.2, -7]} rotation={[0, 0.35, 0]}>
        <coneGeometry args={[3.8, 2.0, 4]} />
        <meshStandardMaterial color={'#34445C'} roughness={0.5} />
      </mesh>

      <mesh position={[5.4, 0.5, -8]} rotation={[0, -0.25, 0]}>
        <boxGeometry args={[6.5, 2.8, 5]} />
        <meshStandardMaterial color={'#232F42'} roughness={0.7} />
      </mesh>

      {/* Glowing attic dormer windows */}
      {[-4.5, -3.2, 4.2, 5.8].map((x, idx) => (
        <group key={idx} position={[x, 1.6, -6.0]}>
          <mesh>
            <boxGeometry args={[0.42, 0.65, 0.2]} />
            <meshStandardMaterial color={'#161B29'} />
          </mesh>
          <mesh position={[0, 0, 0.11]}>
            <planeGeometry args={[0.32, 0.5]} />
            <meshBasicMaterial color={'#FFC56E'} />
          </mesh>
        </group>
      ))}

      {/* Chimney Stacks */}
      {[-4.8, -3.8, 4.6, 6.0].map((x, idx) => (
        <mesh key={idx} position={[x, 2.6, -7.5]}>
          <cylinderGeometry args={[0.09, 0.11, 0.9, 6]} />
          <meshStandardMaterial color={'#A04332'} roughness={0.8} />
        </mesh>
      ))}
    </group>
  );
}

// Paris Terrace Bistro Table with Udbhav's Hero Portfolio Props
function TerraceTable() {
  const hovered = useWorldStore((s) => s.hovered);
  const setHovered = useWorldStore((s) => s.setHovered);
  const phase = useWorldStore((s) => s.phase);
  const setPhase = useWorldStore((s) => s.setPhase);
  const setActivePanel = useWorldStore((s) => s.setActivePanel);

  const portalRef = useRef<any>(null);
  const screenPos = useMemo(() => new THREE.Vector3(0.15, 1.05, 0.58), []);

  useFrame((state) => {
    if (portalRef.current) {
      const dist = state.camera.position.distanceTo(screenPos);
      if (dist > 0.85) {
        portalRef.current.blend = 0;
      } else if (dist <= 0.08) {
        portalRef.current.blend = 1;
      } else {
        const t = (0.85 - dist) / (0.85 - 0.08);
        portalRef.current.blend = Math.max(0, Math.min(1, t * t));
      }
    }
  });

  return (
    <group position={[0.15, 0, 0.75]}>
      {/* Parisian Bistro Round Table Top */}
      <mesh position={[0, 0.92, 0]}>
        <cylinderGeometry args={[0.78, 0.78, 0.04, 32]} />
        <meshStandardMaterial
          color={'#263345'}
          roughness={0.25}
          metalness={0.25}
        />
      </mesh>
      {/* Polished Brass Table Rim */}
      <mesh position={[0, 0.92, 0]}>
        <cylinderGeometry args={[0.795, 0.795, 0.038, 32]} />
        <meshStandardMaterial color={PALETTE.gold} metalness={0.85} roughness={0.2} />
      </mesh>
      {/* Cast-iron Table Leg */}
      <mesh position={[0, 0.46, 0]}>
        <cylinderGeometry args={[0.06, 0.12, 0.92, 16]} />
        <meshStandardMaterial color={'#161B29'} roughness={0.7} />
      </mesh>
      <mesh position={[0, 0.02, 0]}>
        <cylinderGeometry args={[0.36, 0.36, 0.04, 16]} />
        <meshStandardMaterial color={'#161B29'} roughness={0.7} />
      </mesh>

      {/* Hero Prop 1: Laptop (Dive Portal to Workshop) */}
      <group position={[0, 0.94, -0.08]}>
        <mesh
          position={[0, 0.12, 0]}
          onPointerOver={(e) => {
            e.stopPropagation();
            document.body.style.cursor = 'pointer';
            setHovered('laptop');
          }}
          onPointerOut={(e) => {
            e.stopPropagation();
            document.body.style.cursor = 'default';
            setHovered(null);
          }}
          onClick={(e) => {
            e.stopPropagation();
            if (phase === 'dwelling') {
              setPhase('diving');
            }
          }}
        >
          <boxGeometry args={[0.48, 0.32, 0.38]} />
          <meshBasicMaterial visible={false} />
        </mesh>

        <mesh position={[0, 0.01, 0]}>
          <boxGeometry args={[0.38, 0.015, 0.26]} />
          <meshStandardMaterial
            color={hovered === 'laptop' ? PALETTE.gold : '#161B29'}
            metalness={0.65}
            roughness={0.3}
          />
        </mesh>

        <group position={[0, 0.02, -0.12]} rotation={[-0.32, 0, 0]}>
          <mesh position={[0, 0.12, 0]}>
            <boxGeometry args={[0.38, 0.24, 0.012]} />
            <meshStandardMaterial color={'#161B29'} roughness={0.4} />
          </mesh>
          <mesh position={[0, 0.12, 0.007]}>
            <planeGeometry args={[0.35, 0.21]} />
            <MeshPortalMaterial ref={portalRef} blend={0}>
              <WorkshopScene insidePortal={true} />
            </MeshPortalMaterial>
          </mesh>
        </group>
      </group>

      {/* Hero Prop 2: Udbhav's Portfolio & Resume Dossier Notebook */}
      <group
        position={[-0.36, 0.945, 0.12]}
        rotation={[0, 0.35, 0]}
        onPointerOver={(e) => {
          e.stopPropagation();
          document.body.style.cursor = 'pointer';
          setHovered('dossier');
        }}
        onPointerOut={(e) => {
          e.stopPropagation();
          document.body.style.cursor = 'default';
          setHovered(null);
        }}
        onClick={(e) => {
          e.stopPropagation();
          setActivePanel('receipt');
        }}
      >
        <mesh position={[0, 0.04, 0]}>
          <boxGeometry args={[0.32, 0.08, 0.24]} />
          <meshBasicMaterial visible={false} />
        </mesh>
        <mesh position={[0, 0.012, 0]}>
          <boxGeometry args={[0.28, 0.024, 0.2]} />
          <meshStandardMaterial
            color={hovered === 'dossier' ? PALETTE.gold : PALETTE.cherry}
            roughness={0.4}
          />
        </mesh>
        <mesh position={[0, 0.012, 0.002]}>
          <boxGeometry args={[0.265, 0.02, 0.185]} />
          <meshStandardMaterial color={PALETTE.paper} roughness={0.8} />
        </mesh>
        <mesh position={[0.08, 0.026, 0.06]} rotation={[0, 0.2, 0]}>
          <boxGeometry args={[0.02, 0.002, 0.12]} />
          <meshBasicMaterial color={PALETTE.gold} />
        </mesh>
      </group>

      {/* Hero Prop 3: Espresso with Saucer */}
      <group
        position={[0.34, 0.94, 0.15]}
        onPointerOver={(e) => {
          e.stopPropagation();
          document.body.style.cursor = 'pointer';
          setHovered('coffee');
        }}
        onPointerOut={(e) => {
          e.stopPropagation();
          document.body.style.cursor = 'default';
          setHovered(null);
        }}
      >
        <mesh position={[0, 0.06, 0]}>
          <cylinderGeometry args={[0.12, 0.12, 0.14, 12]} />
          <meshBasicMaterial visible={false} />
        </mesh>
        <mesh position={[0, 0.008, 0]}>
          <cylinderGeometry args={[0.1, 0.08, 0.015, 20]} />
          <meshStandardMaterial color={PALETTE.ivory} roughness={0.3} />
        </mesh>
        <mesh position={[0, 0.06, 0]}>
          <cylinderGeometry args={[0.055, 0.045, 0.09, 20]} />
          <meshStandardMaterial color={PALETTE.ivory} roughness={0.25} />
        </mesh>
        <mesh position={[0, 0.095, 0]}>
          <cylinderGeometry args={[0.05, 0.05, 0.01, 16]} />
          <meshStandardMaterial color={'#1A1009'} roughness={0.15} />
        </mesh>
      </group>

      {/* Hero Prop 4: Folded Rail Map */}
      <group
        position={[-0.05, 0.94, 0.32]}
        rotation={[0, -0.15, 0]}
        onPointerOver={(e) => {
          e.stopPropagation();
          document.body.style.cursor = 'pointer';
          setHovered('map');
        }}
        onPointerOut={(e) => {
          e.stopPropagation();
          document.body.style.cursor = 'default';
          setHovered(null);
        }}
        onClick={(e) => {
          e.stopPropagation();
          setActivePanel('receipt');
        }}
      >
        <mesh position={[0, 0.01, 0]}>
          <boxGeometry args={[0.26, 0.018, 0.16]} />
          <meshStandardMaterial
            color={hovered === 'map' ? PALETTE.gold : PALETTE.paper}
            roughness={0.9}
          />
        </mesh>
      </group>
    </group>
  );
}

export function TerraceScene() {
  const restStage = useWorldStore((s) => s.restStage);

  return (
    <>
      {/* Rich Golden Twilight Sunset Atmosphere */}
      <color attach="background" args={['#2B243B']} />
      <fog attach="fog" args={['#664654', 12, 38]} />

      {/* Radiant Warm Twilight Ambient Fill */}
      <ambientLight color={'#FFDEC2'} intensity={1.1} />

      {/* Directional Sunset Golden Hour Key Light illuminating balcony & rain */}
      <directionalLight
        position={[-4, 5, -16]}
        color={'#FFAC52'}
        intensity={3.4}
      />

      {/* Sky Warm Coral Fill */}
      <directionalLight
        position={[5, 8, 4]}
        color={'#FFAE80'}
        intensity={1.2}
      />

      {/* Sunset Horizon and Sky Dome */}
      <SunsetSkyDome />

      {/* Balcony, Haussmannian Railing, Plants & Decorations */}
      <ParisBalconyAndSkyline />
      <BalconyPlants />
      <BalconyDecorations />

      {/* Eiffel Tower Silhouette with Golden Beacon */}
      <EiffelTower />

      {/* Bistro Table with Udbhav's Laptop & Portfolio */}
      <TerraceTable />

      {/* Glistening Backlit Rain */}
      <InstancedRain restStage={restStage} />
    </>
  );
}
