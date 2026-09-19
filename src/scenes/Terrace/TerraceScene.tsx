import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { MeshPortalMaterial } from '@react-three/drei';
import * as THREE from 'three';
import { useWorldStore } from '../../app/worldStore';
import { PALETTE } from '../../data/palette';
import { getParisHourFraction, getParisLighting } from '../../systems/live/parisTime';
import { WorkshopScene } from '../Workshop/WorkshopScene';

// Instanced rain component
function InstancedRain({ restStage }: { restStage: number }) {
  const count = 1200;
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  // Drops coordinates [x, y, z, speed, length]
  const drops = useMemo(() => {
    const arr = [];
    for (let i = 0; i < count; i++) {
      arr.push({
        x: (Math.random() - 0.5) * 12,
        y: Math.random() * 8 + 0.5,
        z: (Math.random() - 0.5) * 10,
        speed: 4.5 + Math.random() * 3.5,
        scaleY: 0.12 + Math.random() * 0.15,
      });
    }
    return arr;
  }, [count]);

  useFrame((_, delta) => {
    if (!meshRef.current) return;

    // Rest stage 2: rain thickens, drop ticks slow
    const speedMult = restStage >= 2 ? 0.75 : 1.0;
    // In stage 2, active drop count increases by 30%
    const activeLimit = restStage >= 2 ? count : Math.floor(count * 0.75);

    for (let i = 0; i < count; i++) {
      const drop = drops[i];
      if (i < activeLimit) {
        drop.y -= drop.speed * speedMult * delta;
        // slant slightly with wind
        drop.x += 0.4 * delta;
        if (drop.y < 0) {
          drop.y = 8;
          drop.x = (Math.random() - 0.5) * 12;
        }
        dummy.position.set(drop.x, drop.y, drop.z);
        dummy.scale.set(0.008, drop.scaleY, 0.008);
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
        color={PALETTE.sky}
        transparent
        opacity={0.55}
        depthWrite={false}
      />
    </instancedMesh>
  );
}

// Simplified Eiffel Tower silhouette in the distance
function EiffelSilhouette() {
  return (
    <group position={[3.2, 1.8, -14]} scale={[0.32, 0.38, 0.32]}>
      {/* Base arch */}
      <mesh position={[0, 1.2, 0]}>
        <boxGeometry args={[4.2, 0.3, 0.6]} />
        <meshBasicMaterial color={PALETTE.navy} />
      </mesh>
      {/* Legs */}
      <mesh position={[-1.6, 0.6, 0]} rotation={[0, 0, -0.2]}>
        <boxGeometry args={[0.5, 1.5, 0.5]} />
        <meshBasicMaterial color={PALETTE.navy} />
      </mesh>
      <mesh position={[1.6, 0.6, 0]} rotation={[0, 0, 0.2]}>
        <boxGeometry args={[0.5, 1.5, 0.5]} />
        <meshBasicMaterial color={PALETTE.navy} />
      </mesh>
      {/* Tier 2 */}
      <mesh position={[0, 2.5, 0]}>
        <boxGeometry args={[2.5, 0.25, 0.5]} />
        <meshBasicMaterial color={PALETTE.navy} />
      </mesh>
      {/* Mid body */}
      <mesh position={[0, 4.2, 0]}>
        <coneGeometry args={[1.2, 3.2, 4]} />
        <meshBasicMaterial color={PALETTE.navy} />
      </mesh>
      {/* Spire */}
      <mesh position={[0, 7.0, 0]}>
        <cylinderGeometry args={[0.08, 0.4, 2.8, 4]} />
        <meshBasicMaterial color={PALETTE.navy} />
      </mesh>
      {/* Beacon tip */}
      <mesh position={[0, 8.5, 0]}>
        <sphereGeometry args={[0.15, 8, 8]} />
        <meshBasicMaterial color={PALETTE.gold} />
      </mesh>
    </group>
  );
}

// Rooftop balustrade & wet zinc skyline
function RooftopSurroundings() {
  return (
    <group>
      {/* Terrace Floor */}
      <mesh position={[0, -0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[12, 12]} />
        <meshStandardMaterial
          color={PALETTE.slate}
          roughness={0.2}
          metalness={0.15}
        />
      </mesh>

      {/* Railing */}
      <mesh position={[0, 0.5, -2.8]}>
        <boxGeometry args={[6.5, 0.08, 0.08]} />
        <meshStandardMaterial color={PALETTE.ink} roughness={0.5} />
      </mesh>
      {[-2.8, -1.4, 0, 1.4, 2.8].map((x) => (
        <mesh key={x} position={[x, 0.25, -2.8]}>
          <cylinderGeometry args={[0.03, 0.03, 0.5, 6]} />
          <meshStandardMaterial color={PALETTE.ink} roughness={0.5} />
        </mesh>
      ))}

      {/* Distant zinc Parisian rooftops */}
      <mesh position={[-4, 0.8, -7]} rotation={[0, Math.PI / 4, 0]}>
        <coneGeometry args={[3, 1.8, 4]} />
        <meshStandardMaterial color={PALETTE.navy} roughness={0.6} />
      </mesh>
      <mesh position={[5, 0.6, -9]}>
        <boxGeometry args={[4.5, 2.0, 2]} />
        <meshStandardMaterial color={PALETTE.slate} roughness={0.7} />
      </mesh>
      {/* Distant chimney stacks */}
      {[-3, -1.5, 2, 4.5].map((x, idx) => (
        <mesh key={idx} position={[x, 1.5, -6.5]}>
          <cylinderGeometry args={[0.1, 0.12, 0.7, 5]} />
          <meshStandardMaterial color={PALETTE.ink} />
        </mesh>
      ))}
    </group>
  );
}

// Terrace Table & Hero Props
function TerraceTable() {
  const hovered = useWorldStore((s) => s.hovered);
  const setHovered = useWorldStore((s) => s.setHovered);
  const phase = useWorldStore((s) => s.phase);
  const setPhase = useWorldStore((s) => s.setPhase);

  const portalRef = useRef<any>(null);
  const screenPos = useMemo(() => new THREE.Vector3(0, 1.03, -0.16), []);

  useFrame((state) => {
    if (portalRef.current) {
      const dist = state.camera.position.distanceTo(screenPos);
      if (dist > 0.85) {
        portalRef.current.blend = 0;
      } else if (dist <= 0.06) {
        portalRef.current.blend = 1;
      } else {
        const t = (0.85 - dist) / (0.85 - 0.06);
        portalRef.current.blend = Math.max(0, Math.min(1, t * t));
      }
    }
  });

  return (
    <group position={[0, 0, 0]}>
      {/* Round Wooden / Stone Table */}
      <mesh position={[0, 0.85, 0]}>
        <cylinderGeometry args={[1.0, 1.0, 0.06, 32]} />
        <meshStandardMaterial
          color={PALETTE.slate}
          roughness={0.35}
          metalness={0.1}
        />
      </mesh>
      {/* Table pedestal base */}
      <mesh position={[0, 0.42, 0]}>
        <cylinderGeometry args={[0.08, 0.18, 0.85, 16]} />
        <meshStandardMaterial color={PALETTE.ink} roughness={0.7} />
      </mesh>
      <mesh position={[0, 0.02, 0]}>
        <cylinderGeometry args={[0.45, 0.45, 0.04, 16]} />
        <meshStandardMaterial color={PALETTE.ink} roughness={0.7} />
      </mesh>

      {/* Hero Prop 1: Laptop (Dive portal to Workshop) */}
      <group position={[0, 0.89, -0.05]}>
        {/* Invisible enlarged hit box for easy hovering & clicking */}
        <mesh
          position={[0, 0.1, 0]}
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
          <boxGeometry args={[0.45, 0.3, 0.35]} />
          <meshBasicMaterial visible={false} />
        </mesh>

        {/* Laptop base */}
        <mesh position={[0, 0.01, 0]}>
          <boxGeometry args={[0.38, 0.015, 0.26]} />
          <meshStandardMaterial
            color={hovered === 'laptop' ? PALETTE.gold : PALETTE.ink}
            metalness={0.6}
            roughness={0.3}
          />
        </mesh>
        {/* Screen tilted back ~110 deg */}
        <group position={[0, 0.02, -0.12]} rotation={[-0.35, 0, 0]}>
          <mesh position={[0, 0.12, 0]}>
            <boxGeometry args={[0.38, 0.24, 0.012]} />
            <meshStandardMaterial color={PALETTE.ink} roughness={0.4} />
          </mesh>
          {/* Screen with MeshPortalMaterial to Workshop */}
          <mesh position={[0, 0.12, 0.007]}>
            <planeGeometry args={[0.35, 0.21]} />
            <MeshPortalMaterial ref={portalRef} blend={0}>
              <WorkshopScene insidePortal={true} />
            </MeshPortalMaterial>
          </mesh>
        </group>
      </group>

      {/* Hero Prop 2: Coffee Cup with saucer */}
      <group position={[0.38, 0.89, 0.2]}>
        <mesh
          position={[0, 0.06, 0]}
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
          <cylinderGeometry args={[0.12, 0.12, 0.15, 12]} />
          <meshBasicMaterial visible={false} />
        </mesh>
        {/* Saucer */}
        <mesh position={[0, 0.008, 0]}>
          <cylinderGeometry args={[0.1, 0.08, 0.015, 20]} />
          <meshStandardMaterial color={PALETTE.ivory} roughness={0.3} />
        </mesh>
        {/* Ceramic Cup */}
        <mesh position={[0, 0.06, 0]}>
          <cylinderGeometry args={[0.055, 0.045, 0.09, 20]} />
          <meshStandardMaterial color={PALETTE.ivory} roughness={0.25} />
        </mesh>
        {/* Dark espresso inside */}
        <mesh position={[0, 0.095, 0]}>
          <cylinderGeometry args={[0.05, 0.05, 0.01, 16]} />
          <meshStandardMaterial color={PALETTE.ink} roughness={0.1} />
        </mesh>
      </group>

      {/* Hero Prop 3: Folded Map */}
      <group position={[-0.35, 0.89, 0.25]} rotation={[0, 0.3, 0]}>
        <mesh
          position={[0, 0.02, 0]}
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
          <boxGeometry args={[0.32, 0.06, 0.24]} />
          <meshBasicMaterial visible={false} />
        </mesh>
        <mesh position={[0, 0.008, 0]}>
          <boxGeometry args={[0.26, 0.016, 0.18]} />
          <meshStandardMaterial
            color={hovered === 'map' ? PALETTE.gold : PALETTE.paper}
            roughness={0.9}
          />
        </mesh>
      </group>

      {/* Postcards & Thermal Receipt */}
      <mesh position={[-0.38, 0.885, -0.15]} rotation={[0, -0.4, 0]}>
        <boxGeometry args={[0.16, 0.005, 0.22]} />
        <meshStandardMaterial color={PALETTE.paper} roughness={0.8} />
      </mesh>
      <mesh position={[0.32, 0.885, -0.15]} rotation={[0, 0.15, 0]}>
        <boxGeometry args={[0.1, 0.003, 0.28]} />
        <meshStandardMaterial color={PALETTE.ivory} roughness={0.7} />
      </mesh>

      {/* Cassette Player */}
      <group position={[-0.05, 0.89, 0.38]} rotation={[0, -0.1, 0]}>
        <mesh position={[0, 0.02, 0]}>
          <boxGeometry args={[0.22, 0.04, 0.14]} />
          <meshStandardMaterial color={PALETTE.ink} roughness={0.6} metalness={0.3} />
        </mesh>
        {/* Cassette window */}
        <mesh position={[0, 0.041, 0]}>
          <planeGeometry args={[0.12, 0.06]} />
          <meshStandardMaterial color={PALETTE.gold} roughness={0.4} />
        </mesh>
      </group>

      {/* Crescent Earring */}
      <mesh position={[0.15, 0.885, 0.35]} rotation={[Math.PI / 2, 0, 0.8]}>
        <torusGeometry args={[0.02, 0.005, 8, 16, Math.PI * 1.3]} />
        <meshStandardMaterial color={PALETTE.gold} metalness={0.8} roughness={0.2} />
      </mesh>
    </group>
  );
}

export function TerraceScene() {
  const restStage = useWorldStore((s) => s.restStage);
  const hour = getParisHourFraction();
  const lighting = useMemo(() => getParisLighting(hour), [hour]);

  return (
    <>
      {/* Paris Live Sky & Ambient Environment */}
      <color attach="background" args={[lighting.skyTop]} />
      <fog attach="fog" args={[lighting.fogColor, 5, 26]} />

      <ambientLight color={lighting.ambientColor} intensity={lighting.ambientIntensity} />

      {/* Directional Sun / Moon key */}
      <directionalLight
        position={lighting.sunPosition}
        color={lighting.sunColor}
        intensity={lighting.sunIntensity}
      />

      {/* Soft fill light */}
      <directionalLight
        position={[-lighting.sunPosition[0], 4, -lighting.sunPosition[2]]}
        color={lighting.ambientColor}
        intensity={lighting.ambientIntensity * 0.8}
      />

      {/* World geometry */}
      <RooftopSurroundings />
      <EiffelSilhouette />
      <TerraceTable />

      {/* Instanced Rain */}
      <InstancedRain restStage={restStage} />
    </>
  );
}
