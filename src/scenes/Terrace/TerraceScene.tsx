import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { MeshPortalMaterial } from '@react-three/drei';
import * as THREE from 'three';
import { useWorldStore } from '../../app/worldStore';
import { PALETTE } from '../../data/palette';
import { getParisHourFraction, getParisLighting } from '../../systems/live/parisTime';
import { WorkshopScene } from '../Workshop/WorkshopScene';

// Instanced backlit rain
function InstancedRain({ restStage }: { restStage: number }) {
  const count = 1400;
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  const drops = useMemo(() => {
    const arr = [];
    for (let i = 0; i < count; i++) {
      arr.push({
        x: (Math.random() - 0.5) * 14,
        y: Math.random() * 9 + 0.5,
        z: Math.random() * 12 - 6,
        speed: 5.0 + Math.random() * 3.5,
        scaleY: 0.14 + Math.random() * 0.16,
      });
    }
    return arr;
  }, [count]);

  useFrame((_, delta) => {
    if (!meshRef.current) return;
    const speedMult = restStage >= 2 ? 0.75 : 1.0;
    const activeLimit = restStage >= 2 ? count : Math.floor(count * 0.75);

    for (let i = 0; i < count; i++) {
      const drop = drops[i];
      if (i < activeLimit) {
        drop.y -= drop.speed * speedMult * delta;
        drop.x += 0.35 * delta;
        if (drop.y < 0) {
          drop.y = 9;
          drop.x = (Math.random() - 0.5) * 14;
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
        color={PALETTE.gold}
        transparent
        opacity={0.65}
        depthWrite={false}
      />
    </instancedMesh>
  );
}

// Majestic Eiffel Tower Silhouette on the Sunset Horizon
function EiffelTower() {
  const setHovered = useWorldStore((s) => s.setHovered);
  const beaconRef = useRef<THREE.PointLight>(null);

  useFrame((state) => {
    if (beaconRef.current) {
      // Rotating beam pulsation
      beaconRef.current.intensity = 2.5 + Math.sin(state.clock.elapsedTime * 2.5) * 1.5;
    }
  });

  return (
    <group
      position={[-0.8, 0.2, -16]}
      scale={[1.15, 1.25, 1.15]}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered('eiffel');
      }}
      onPointerOut={(e) => {
        e.stopPropagation();
        setHovered(null);
      }}
    >
      {/* Invisible hit box for interacting with Eiffel tower */}
      <mesh position={[0, 4.5, 0]}>
        <cylinderGeometry args={[2.5, 4.0, 9.5, 8]} />
        <meshBasicMaterial visible={false} />
      </mesh>

      {/* Base Arch */}
      <mesh position={[0, 1.1, 0]}>
        <torusGeometry args={[1.5, 0.18, 6, 16, Math.PI]} />
        <meshStandardMaterial color={PALETTE.ink} roughness={0.7} />
      </mesh>

      {/* 4 Tapering Lattice Pylon Legs */}
      {/* South-West Leg */}
      <mesh position={[-1.7, 1.1, 0.4]} rotation={[0.08, 0, -0.26]}>
        <cylinderGeometry args={[0.22, 0.52, 2.6, 4]} />
        <meshStandardMaterial color={PALETTE.ink} roughness={0.8} />
      </mesh>
      {/* South-East Leg */}
      <mesh position={[1.7, 1.1, 0.4]} rotation={[0.08, 0, 0.26]}>
        <cylinderGeometry args={[0.22, 0.52, 2.6, 4]} />
        <meshStandardMaterial color={PALETTE.ink} roughness={0.8} />
      </mesh>
      {/* North-West Leg */}
      <mesh position={[-1.7, 1.1, -0.4]} rotation={[-0.08, 0, -0.26]}>
        <cylinderGeometry args={[0.22, 0.52, 2.6, 4]} />
        <meshStandardMaterial color={PALETTE.ink} roughness={0.8} />
      </mesh>
      {/* North-East Leg */}
      <mesh position={[1.7, 1.1, -0.4]} rotation={[-0.08, 0, 0.26]}>
        <cylinderGeometry args={[0.22, 0.52, 2.6, 4]} />
        <meshStandardMaterial color={PALETTE.ink} roughness={0.8} />
      </mesh>

      {/* First Platform Deck */}
      <mesh position={[0, 2.3, 0]}>
        <boxGeometry args={[3.2, 0.22, 1.2]} />
        <meshStandardMaterial color={PALETTE.ink} roughness={0.6} />
      </mesh>
      {/* First Platform Railing glow */}
      <mesh position={[0, 2.45, 0]}>
        <boxGeometry args={[3.0, 0.08, 1.0]} />
        <meshBasicMaterial color={PALETTE.gold} />
      </mesh>

      {/* Second Tier Legs */}
      <mesh position={[-0.8, 3.7, 0]} rotation={[0, 0, -0.16]}>
        <cylinderGeometry args={[0.18, 0.28, 2.6, 4]} />
        <meshStandardMaterial color={PALETTE.ink} roughness={0.8} />
      </mesh>
      <mesh position={[0.8, 3.7, 0]} rotation={[0, 0, 0.16]}>
        <cylinderGeometry args={[0.18, 0.28, 2.6, 4]} />
        <meshStandardMaterial color={PALETTE.ink} roughness={0.8} />
      </mesh>

      {/* Second Platform Deck */}
      <mesh position={[0, 4.9, 0]}>
        <boxGeometry args={[1.8, 0.18, 0.8]} />
        <meshStandardMaterial color={PALETTE.ink} roughness={0.6} />
      </mesh>

      {/* Soaring Slender Spire Body */}
      <mesh position={[0, 6.7, 0]}>
        <cylinderGeometry args={[0.12, 0.45, 3.4, 4]} />
        <meshStandardMaterial color={PALETTE.ink} roughness={0.7} />
      </mesh>

      {/* Upper Cupola & Lantern */}
      <mesh position={[0, 8.45, 0]}>
        <sphereGeometry args={[0.24, 8, 8]} />
        <meshBasicMaterial color={PALETTE.gold} />
      </mesh>
      {/* Antenna Mast */}
      <mesh position={[0, 9.3, 0]}>
        <cylinderGeometry args={[0.02, 0.05, 1.5, 4]} />
        <meshBasicMaterial color={PALETTE.ivory} />
      </mesh>

      {/* Golden Sunset Beacon Light */}
      <pointLight
        ref={beaconRef}
        position={[0, 9.2, 0]}
        color={PALETTE.gold}
        intensity={3.5}
        distance={25}
        decay={1.8}
      />
    </group>
  );
}

// Parisian Rooftops & Haussmannian Balcony
function ParisBalconyAndSkyline() {
  return (
    <group>
      {/* Wet Terrace Stone Tiles */}
      <mesh position={[0, -0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[10, 8]} />
        <meshStandardMaterial
          color={PALETTE.slate}
          roughness={0.15}
          metalness={0.25}
        />
      </mesh>

      {/* Balcony Stone Plinth (Border at edge of terrace) */}
      <mesh position={[0, 0.12, -1.6]}>
        <boxGeometry args={[8.0, 0.24, 0.22]} />
        <meshStandardMaterial color={PALETTE.ink} roughness={0.6} />
      </mesh>

      {/* Haussmannian Wrought-Iron Balustrade Railing */}
      {/* Top handrail */}
      <mesh position={[0, 0.95, -1.6]}>
        <boxGeometry args={[8.0, 0.06, 0.08]} />
        <meshStandardMaterial color={PALETTE.ink} metalness={0.5} roughness={0.3} />
      </mesh>
      {/* Mid horizontal iron band */}
      <mesh position={[0, 0.55, -1.6]}>
        <boxGeometry args={[8.0, 0.03, 0.04]} />
        <meshStandardMaterial color={PALETTE.ink} roughness={0.5} />
      </mesh>

      {/* Balusters & Curving Ironwork Posts */}
      {[-3.6, -2.7, -1.8, -0.9, 0, 0.9, 1.8, 2.7, 3.6].map((x) => (
        <group key={x} position={[x, 0.54, -1.6]}>
          {/* Main vertical spindle */}
          <mesh>
            <cylinderGeometry args={[0.02, 0.02, 0.78, 6]} />
            <meshStandardMaterial color={PALETTE.ink} roughness={0.4} />
          </mesh>
          {/* Decorative iron scroll rosette */}
          <mesh position={[0, 0.15, 0]} rotation={[0, 0, Math.PI / 4]}>
            <ringGeometry args={[0.06, 0.08, 4]} />
            <meshStandardMaterial color={PALETTE.gold} metalness={0.7} roughness={0.3} />
          </mesh>
          <mesh position={[0, -0.15, 0]} rotation={[0, 0, Math.PI / 4]}>
            <ringGeometry args={[0.06, 0.08, 4]} />
            <meshStandardMaterial color={PALETTE.gold} metalness={0.7} roughness={0.3} />
          </mesh>
        </group>
      ))}

      {/* Parisian Mansard Roofs in Midground */}
      {/* Left building block with slate roof */}
      <mesh position={[-4.5, 0.5, -6]} rotation={[0, 0.3, 0]}>
        <boxGeometry args={[5, 2.2, 4]} />
        <meshStandardMaterial color={PALETTE.navy} roughness={0.7} />
      </mesh>
      <mesh position={[-4.5, 1.9, -6]} rotation={[0, 0.3, 0]}>
        <coneGeometry args={[3.2, 1.8, 4]} />
        <meshStandardMaterial color={PALETTE.slate} roughness={0.5} />
      </mesh>

      {/* Right building block with dormer windows */}
      <mesh position={[4.8, 0.4, -7]} rotation={[0, -0.2, 0]}>
        <boxGeometry args={[5.5, 2.5, 4.5]} />
        <meshStandardMaterial color={PALETTE.navy} roughness={0.7} />
      </mesh>
      {/* Glowing attic dormer windows (Parisian warm candlelight) */}
      {[-3.8, -2.6, 3.4, 4.8].map((x, idx) => (
        <group key={idx} position={[x, 1.4, -5.2]}>
          <mesh>
            <boxGeometry args={[0.4, 0.6, 0.2]} />
            <meshStandardMaterial color={PALETTE.ink} />
          </mesh>
          <mesh position={[0, 0, 0.11]}>
            <planeGeometry args={[0.3, 0.45]} />
            <meshBasicMaterial color={PALETTE.gold} />
          </mesh>
        </group>
      ))}

      {/* Terracotta Chimney Stacks */}
      {[-4.2, -3.2, 3.8, 5.2].map((x, idx) => (
        <mesh key={idx} position={[x, 2.4, -6.8]}>
          <cylinderGeometry args={[0.08, 0.1, 0.8, 6]} />
          <meshStandardMaterial color={PALETTE.cherry} roughness={0.8} />
        </mesh>
      ))}

      {/* Distant Sunset Horizon Glow Plane */}
      <mesh position={[0, 3.5, -28]}>
        <planeGeometry args={[45, 18]} />
        <meshBasicMaterial color={'#E58A4E'} transparent opacity={0.25} />
      </mesh>
    </group>
  );
}

// Paris Terrace Bistro Table with Hero Portfolio Props
function TerraceTable() {
  const hovered = useWorldStore((s) => s.hovered);
  const setHovered = useWorldStore((s) => s.setHovered);
  const phase = useWorldStore((s) => s.phase);
  const setPhase = useWorldStore((s) => s.setPhase);
  const setActivePanel = useWorldStore((s) => s.setActivePanel);

  const portalRef = useRef<any>(null);
  // Screen world position: table is at [0.15, 0, 0.75], laptop at [0, 0.94, -0.08]
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
          color={PALETTE.slate}
          roughness={0.25}
          metalness={0.2}
        />
      </mesh>
      {/* Brass Table Rim */}
      <mesh position={[0, 0.92, 0]}>
        <cylinderGeometry args={[0.79, 0.79, 0.035, 32]} />
        <meshStandardMaterial color={PALETTE.gold} metalness={0.8} roughness={0.25} />
      </mesh>
      {/* Cast-iron Table Leg */}
      <mesh position={[0, 0.46, 0]}>
        <cylinderGeometry args={[0.06, 0.12, 0.92, 16]} />
        <meshStandardMaterial color={PALETTE.ink} roughness={0.7} />
      </mesh>
      <mesh position={[0, 0.02, 0]}>
        <cylinderGeometry args={[0.36, 0.36, 0.04, 16]} />
        <meshStandardMaterial color={PALETTE.ink} roughness={0.7} />
      </mesh>

      {/* Hero Prop 1: Laptop (Dive Portal to Workshop) */}
      <group position={[0, 0.94, -0.08]}>
        {/* Invisible hit box for click to dive */}
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

        {/* Laptop Base */}
        <mesh position={[0, 0.01, 0]}>
          <boxGeometry args={[0.38, 0.015, 0.26]} />
          <meshStandardMaterial
            color={hovered === 'laptop' ? PALETTE.gold : PALETTE.ink}
            metalness={0.6}
            roughness={0.3}
          />
        </mesh>

        {/* Laptop Screen tilted slightly back */}
        <group position={[0, 0.02, -0.12]} rotation={[-0.32, 0, 0]}>
          <mesh position={[0, 0.12, 0]}>
            <boxGeometry args={[0.38, 0.24, 0.012]} />
            <meshStandardMaterial color={PALETTE.ink} roughness={0.4} />
          </mesh>
          {/* Screen Portal into Workshop */}
          <mesh position={[0, 0.12, 0.007]}>
            <planeGeometry args={[0.35, 0.21]} />
            <MeshPortalMaterial ref={portalRef} blend={0}>
              <WorkshopScene insidePortal={true} />
            </MeshPortalMaterial>
          </mesh>
        </group>
      </group>

      {/* Hero Prop 2: Selected Works / Portfolio Dossier Notebook */}
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
        {/* Click hit box */}
        <mesh position={[0, 0.04, 0]}>
          <boxGeometry args={[0.32, 0.08, 0.24]} />
          <meshBasicMaterial visible={false} />
        </mesh>
        {/* Leather notebook cover */}
        <mesh position={[0, 0.012, 0]}>
          <boxGeometry args={[0.28, 0.024, 0.2]} />
          <meshStandardMaterial
            color={hovered === 'dossier' ? PALETTE.gold : PALETTE.cherry}
            roughness={0.4}
          />
        </mesh>
        {/* Cream paper pages edge */}
        <mesh position={[0, 0.012, 0.002]}>
          <boxGeometry args={[0.265, 0.02, 0.185]} />
          <meshStandardMaterial color={PALETTE.paper} roughness={0.8} />
        </mesh>
        {/* Gold bookmark ribbon */}
        <mesh position={[0.08, 0.026, 0.06]} rotation={[0, 0.2, 0]}>
          <boxGeometry args={[0.02, 0.002, 0.12]} />
          <meshBasicMaterial color={PALETTE.gold} />
        </mesh>
      </group>

      {/* Hero Prop 3: Espresso Cup with Saucer */}
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
        {/* Saucer */}
        <mesh position={[0, 0.008, 0]}>
          <cylinderGeometry args={[0.1, 0.08, 0.015, 20]} />
          <meshStandardMaterial color={PALETTE.ivory} roughness={0.3} />
        </mesh>
        {/* Cup */}
        <mesh position={[0, 0.06, 0]}>
          <cylinderGeometry args={[0.055, 0.045, 0.09, 20]} />
          <meshStandardMaterial color={PALETTE.ivory} roughness={0.25} />
        </mesh>
        {/* Espresso with golden crema */}
        <mesh position={[0, 0.095, 0]}>
          <cylinderGeometry args={[0.05, 0.05, 0.01, 16]} />
          <meshStandardMaterial color={PALETTE.ink} roughness={0.2} />
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
      >
        <mesh position={[0, 0.01, 0]}>
          <boxGeometry args={[0.26, 0.018, 0.16]} />
          <meshStandardMaterial
            color={hovered === 'map' ? PALETTE.gold : PALETTE.paper}
            roughness={0.9}
          />
        </mesh>
      </group>

      {/* Postcards & Thermal Receipt */}
      <mesh position={[-0.32, 0.938, -0.18]} rotation={[0, -0.3, 0]}>
        <boxGeometry args={[0.16, 0.004, 0.22]} />
        <meshStandardMaterial color={PALETTE.paper} roughness={0.8} />
      </mesh>
      <mesh position={[0.28, 0.938, -0.15]} rotation={[0, 0.18, 0]}>
        <boxGeometry args={[0.1, 0.003, 0.28]} />
        <meshStandardMaterial color={PALETTE.ivory} roughness={0.7} />
      </mesh>

      {/* Crescent Earring on the table */}
      <mesh position={[0.12, 0.94, 0.3]} rotation={[Math.PI / 2, 0, 0.7]}>
        <torusGeometry args={[0.02, 0.005, 8, 16, Math.PI * 1.3]} />
        <meshStandardMaterial color={PALETTE.gold} metalness={0.9} roughness={0.15} />
      </mesh>
    </group>
  );
}

export function TerraceScene() {
  const restStage = useWorldStore((s) => s.restStage);
  const hour = getParisHourFraction();
  // Force sunset golden hour to deliver the signature beautiful evening vista
  const lighting = useMemo(() => getParisLighting(hour, true), [hour]);

  return (
    <>
      {/* Paris Sunset Live Sky & Fog */}
      <color attach="background" args={[lighting.skyTop]} />
      <fog attach="fog" args={[lighting.fogColor, 6, 28]} />

      {/* Ambient twilight illumination */}
      <ambientLight color={lighting.ambientColor} intensity={lighting.ambientIntensity} />

      {/* Warm Golden Hour Sun Key backlighting the balcony and rain */}
      <directionalLight
        position={lighting.sunPosition}
        color={lighting.sunColor}
        intensity={lighting.sunIntensity}
      />

      {/* Sky Fill Light */}
      <directionalLight
        position={[6, 8, 4]}
        color={lighting.ambientColor}
        intensity={lighting.ambientIntensity * 0.9}
      />

      {/* Balcony, Rooftops & Eiffel Tower */}
      <ParisBalconyAndSkyline />
      <EiffelTower />
      <TerraceTable />

      {/* Backlit Instanced Rain */}
      <InstancedRain restStage={restStage} />
    </>
  );
}
