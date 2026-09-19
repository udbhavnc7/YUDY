import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { MeshPortalMaterial } from '@react-three/drei';
import * as THREE from 'three';
import { useWorldStore } from '../../app/worldStore';
import { PALETTE } from '../../data/palette';
import { WorkshopScene } from '../Workshop/WorkshopScene';
import { EiffelTower3D, ParisianRooftops3D, ParisSkyDome } from './ParisCityscape3D';

// Parisian Balcony Floor & Haussmann Wrought-Iron Railing
function BalconyArchitecture() {
  const balusterPositions = useMemo(() => {
    const pos = [];
    for (let x = -3.8; x <= 3.8; x += 0.22) {
      pos.push(x);
    }
    return pos;
  }, []);

  const fairyLights = useMemo(() => {
    const lights = [];
    for (let x = -3.4; x <= 3.4; x += 0.52) {
      lights.push({
        x,
        y: 1.08 + Math.sin(x * 3.2) * 0.03,
        z: -0.7,
      });
    }
    return lights;
  }, []);

  return (
    <group>
      {/* Parisian Stone Terrace Decking Floor with Wet Sheen */}
      <mesh position={[0, -0.02, 1.2]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[8.6, 5.0]} />
        <meshStandardMaterial
          color={'#251F22'}
          roughness={0.4}
          metalness={0.25}
        />
      </mesh>

      {/* Parisian Balcony Limestone Curb Edge */}
      <mesh position={[0, 0.04, -0.7]}>
        <boxGeometry args={[8.6, 0.12, 0.22]} />
        <meshStandardMaterial color={'#524640'} roughness={0.7} />
      </mesh>

      {/* Right Building Corner Haussmann Stone Facade */}
      <mesh position={[4.1, 2.2, 0.5]}>
        <boxGeometry args={[0.7, 4.6, 3.8]} />
        <meshStandardMaterial color={'#544740'} roughness={0.8} />
      </mesh>
      {/* French Balcony Door Frame on right */}
      <mesh position={[3.72, 1.6, 0.8]}>
        <boxGeometry args={[0.08, 2.8, 1.4]} />
        <meshStandardMaterial color={'#1A1614'} roughness={0.6} />
      </mesh>

      {/* Haussmann Wrought-Iron Balcony Railing */}
      <group position={[0, 0, -0.7]}>
        {/* Top Heavy Cast-Iron Rail */}
        <mesh position={[0, 1.1, 0]}>
          <boxGeometry args={[7.8, 0.04, 0.06]} />
          <meshStandardMaterial color={'#151920'} roughness={0.5} metalness={0.5} />
        </mesh>
        {/* Polished Brass Top Handrail Cap */}
        <mesh position={[0, 1.125, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.024, 0.024, 7.8, 12]} />
          <meshStandardMaterial color={PALETTE.gold} metalness={0.9} roughness={0.2} />
        </mesh>

        {/* Bottom Support Rail */}
        <mesh position={[0, 0.14, 0]}>
          <boxGeometry args={[7.8, 0.03, 0.04]} />
          <meshStandardMaterial color={'#151920'} roughness={0.5} metalness={0.5} />
        </mesh>

        {/* Decorative Balusters */}
        {balusterPositions.map((x, i) => (
          <group key={i} position={[x, 0.62, 0]}>
            <mesh>
              <cylinderGeometry args={[0.009, 0.009, 0.94, 8]} />
              <meshStandardMaterial color={'#1C212B'} roughness={0.5} metalness={0.4} />
            </mesh>
            {/* Ornamental brass ring on alternating balusters */}
            {i % 2 === 0 && (
              <mesh position={[0, 0.12, 0]}>
                <torusGeometry args={[0.035, 0.006, 6, 16]} />
                <meshStandardMaterial color={PALETTE.gold} metalness={0.8} roughness={0.25} />
              </mesh>
            )}
          </group>
        ))}

        {/* Fairy String Lights along the Railing */}
        {fairyLights.map((pt, i) => (
          <group key={i} position={[pt.x, pt.y, 0]}>
            <mesh>
              <sphereGeometry args={[0.02, 10, 10]} />
              <meshBasicMaterial color={'#FFE399'} />
            </mesh>
          </group>
        ))}
      </group>
    </group>
  );
}

// Instanced glistening rain backlit by sunset
function InstancedRain({ restStage }: { restStage: number }) {
  const count = 900;
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  const drops = useMemo(() => {
    const arr = [];
    for (let i = 0; i < count; i++) {
      arr.push({
        x: (Math.random() - 0.5) * 14,
        y: Math.random() * 8 + 0.5,
        z: Math.random() * 8 - 3,
        speed: 4.5 + Math.random() * 2.8,
        scaleY: 0.14 + Math.random() * 0.14,
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
        drop.x += 0.25 * delta;
        if (drop.y < 0) {
          drop.y = 8;
          drop.x = (Math.random() - 0.5) * 14;
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
        color={'#FFE6A3'}
        transparent
        opacity={0.45}
        depthWrite={false}
      />
    </instancedMesh>
  );
}

// Lush 3D Balcony Potted Plants & Vines
function ForegroundBalconyPlants() {
  return (
    <group>
      {/* Terracotta Planter with Tropical Monstera (Left Foreground) */}
      <group position={[-1.75, 0, 0.35]}>
        <mesh position={[0, 0.28, 0]}>
          <cylinderGeometry args={[0.32, 0.24, 0.56, 16]} />
          <meshStandardMaterial color={'#8C3F24'} roughness={0.7} />
        </mesh>
        <mesh position={[0, 0.56, 0]}>
          <cylinderGeometry args={[0.3, 0.3, 0.04, 12]} />
          <meshStandardMaterial color={'#1F1713'} roughness={0.9} />
        </mesh>
        {/* Broad Green Leaves */}
        {[-0.4, -0.15, 0.15, 0.45].map((angle, i) => (
          <group key={i} position={[0, 0.56, 0]} rotation={[0.3, angle * Math.PI, -0.3 + i * 0.18]}>
            <mesh position={[0, 0.35, 0]}>
              <boxGeometry args={[0.02, 0.7, 0.02]} />
              <meshStandardMaterial color={'#1F3A1D'} />
            </mesh>
            <mesh position={[0, 0.65, 0]} rotation={[0.35, 0, 0]}>
              <coneGeometry args={[0.22, 0.55, 3]} />
              <meshStandardMaterial color={'#2D5229'} roughness={0.5} />
            </mesh>
          </group>
        ))}
      </group>

      {/* Railing Hanging Planter Box with Red Geraniums (Left Railing) */}
      <group position={[-1.4, 0.85, -0.68]}>
        <mesh position={[0, 0.1, 0]}>
          <boxGeometry args={[0.9, 0.22, 0.24]} />
          <meshStandardMaterial color={'#202630'} roughness={0.6} />
        </mesh>
        <mesh position={[0, 0.25, 0]}>
          <sphereGeometry args={[0.28, 8, 8]} />
          <meshStandardMaterial color={'#284422'} roughness={0.6} />
        </mesh>
        {[-0.3, -0.1, 0.1, 0.3].map((x, i) => (
          <mesh key={i} position={[x, 0.38, (i % 2 === 0 ? 0.06 : -0.06)]}>
            <sphereGeometry args={[0.045, 6, 6]} />
            <meshStandardMaterial color={'#C93844'} roughness={0.4} />
          </mesh>
        ))}
      </group>

      {/* Terracotta Pot with Blooming Geraniums & Ivy (Right Railing) */}
      <group position={[1.85, 0, 0.25]}>
        <mesh position={[0, 0.24, 0]}>
          <cylinderGeometry args={[0.28, 0.2, 0.48, 16]} />
          <meshStandardMaterial color={'#8C3F24'} roughness={0.7} />
        </mesh>
        <mesh position={[0, 0.48, 0]}>
          <sphereGeometry args={[0.3, 8, 8]} />
          <meshStandardMaterial color={'#2C4A24'} roughness={0.6} />
        </mesh>
        {[-0.1, 0, 0.12].map((x, i) =>
          [-0.08, 0.08].map((z, j) => (
            <mesh key={`${i}-${j}`} position={[x, 0.68, z]}>
              <sphereGeometry args={[0.042, 6, 6]} />
              <meshStandardMaterial color={'#D64E3A'} />
            </mesh>
          ))
        )}
      </group>
    </group>
  );
}

// Paris Terrace Carrara Marble Bistro Table with Real Project Items
function TerraceTable() {
  const hovered = useWorldStore((s) => s.hovered);
  const setHovered = useWorldStore((s) => s.setHovered);
  const phase = useWorldStore((s) => s.phase);
  const setPhase = useWorldStore((s) => s.setPhase);
  const setActivePanel = useWorldStore((s) => s.setActivePanel);
  const setActiveProjectIndex = useWorldStore((s) => s.setActiveProjectIndex);

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

  const openProject = (idx: number) => {
    setActiveProjectIndex(idx);
    setActivePanel('receipt');
  };

  return (
    <group position={[0.15, 0, 0.75]}>
      {/* Parisian Bistro Carrara Marble Table Top */}
      <mesh position={[0, 0.92, 0]}>
        <cylinderGeometry args={[0.82, 0.82, 0.038, 48]} />
        <meshStandardMaterial
          color={'#DFDDD8'}
          roughness={0.25}
          metalness={0.1}
        />
      </mesh>
      {/* Polished French Brass Table Rim */}
      <mesh position={[0, 0.92, 0]}>
        <cylinderGeometry args={[0.835, 0.835, 0.036, 48]} />
        <meshStandardMaterial color={PALETTE.gold} metalness={0.9} roughness={0.2} />
      </mesh>
      {/* Parisian Cast-Iron Tripod Pedestal Base */}
      <mesh position={[0, 0.46, 0]}>
        <cylinderGeometry args={[0.06, 0.14, 0.92, 16]} />
        <meshStandardMaterial color={'#12161E'} roughness={0.6} metalness={0.4} />
      </mesh>
      <mesh position={[0, 0.03, 0]}>
        <cylinderGeometry args={[0.4, 0.42, 0.06, 16]} />
        <meshStandardMaterial color={'#12161E'} roughness={0.6} metalness={0.4} />
      </mesh>

      {/* ========================================================================= */}
      {/* Project Item 1: Laptop — KAWACH (Emergency Mesh & Portal to Workshop) */}
      {/* ========================================================================= */}
      <group position={[0, 0.94, -0.06]}>
        <mesh
          position={[0, 0.14, 0]}
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

        {/* Aluminium Unibody Base with Keyboard */}
        <mesh position={[0, 0.01, 0]}>
          <boxGeometry args={[0.42, 0.015, 0.28]} />
          <meshStandardMaterial
            color={hovered === 'laptop' ? PALETTE.gold : '#1E242E'}
            metalness={0.7}
            roughness={0.25}
          />
        </mesh>
        {/* Trackpad */}
        <mesh position={[0, 0.018, 0.08]}>
          <boxGeometry args={[0.12, 0.002, 0.08]} />
          <meshStandardMaterial color={'#141820'} roughness={0.3} />
        </mesh>
        {/* Keyboard recess */}
        <mesh position={[0, 0.018, -0.03]}>
          <boxGeometry args={[0.34, 0.002, 0.12]} />
          <meshStandardMaterial color={'#0E1117'} roughness={0.4} />
        </mesh>

        {/* Laptop Display Lid */}
        <group position={[0, 0.02, -0.13]} rotation={[-0.32, 0, 0]}>
          <mesh position={[0, 0.13, 0]}>
            <boxGeometry args={[0.42, 0.26, 0.012]} />
            <meshStandardMaterial color={'#1E242E'} roughness={0.3} metalness={0.7} />
          </mesh>
          <mesh position={[0, 0.13, 0.007]}>
            <planeGeometry args={[0.39, 0.23]} />
            <MeshPortalMaterial ref={portalRef} blend={0}>
              <WorkshopScene insidePortal={true} />
            </MeshPortalMaterial>
          </mesh>
        </group>
      </group>

      {/* ========================================================================= */}
      {/* Project Item 2: LUME — Topographic Land Survey Lens */}
      {/* ========================================================================= */}
      <group
        position={[-0.32, 0.945, -0.22]}
        rotation={[0, 0.4, 0]}
        onPointerOver={(e) => {
          e.stopPropagation();
          document.body.style.cursor = 'pointer';
          setHovered('item-lume');
        }}
        onPointerOut={(e) => {
          e.stopPropagation();
          document.body.style.cursor = 'default';
          setHovered(null);
        }}
        onClick={(e) => {
          e.stopPropagation();
          openProject(1); // 01 LUME
        }}
      >
        <mesh position={[0, 0.06, 0]}>
          <boxGeometry args={[0.18, 0.14, 0.18]} />
          <meshBasicMaterial visible={false} />
        </mesh>
        <mesh position={[0, 0.015, 0]}>
          <cylinderGeometry args={[0.09, 0.1, 0.03, 16]} />
          <meshStandardMaterial
            color={hovered === 'item-lume' ? PALETTE.gold : '#1A212E'}
            metalness={0.6}
            roughness={0.3}
          />
        </mesh>
        <mesh position={[0, 0.05, 0]} rotation={[0, 0.5, 0]}>
          <octahedronGeometry args={[0.045]} />
          <meshStandardMaterial
            color={'#6EE7B7'}
            transparent
            opacity={0.88}
            roughness={0.1}
            metalness={0.2}
          />
        </mesh>
        <mesh position={[0, 0.032, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.08, 0.086, 24]} />
          <meshBasicMaterial color={hovered === 'item-lume' ? PALETTE.gold : '#10B981'} />
        </mesh>
      </group>

      {/* ========================================================================= */}
      {/* Project Item 3: SANCHAY — Handcrafted Leather Ledger & Currency Seal */}
      {/* ========================================================================= */}
      <group
        position={[-0.42, 0.945, 0.12]}
        rotation={[0, 0.25, 0]}
        onPointerOver={(e) => {
          e.stopPropagation();
          document.body.style.cursor = 'pointer';
          setHovered('item-sanchay');
        }}
        onPointerOut={(e) => {
          e.stopPropagation();
          document.body.style.cursor = 'default';
          setHovered(null);
        }}
        onClick={(e) => {
          e.stopPropagation();
          openProject(3); // 03 Sanchay
        }}
      >
        <mesh position={[0, 0.04, 0]}>
          <boxGeometry args={[0.22, 0.08, 0.18]} />
          <meshBasicMaterial visible={false} />
        </mesh>
        <mesh position={[0, 0.015, 0]}>
          <boxGeometry args={[0.18, 0.03, 0.14]} />
          <meshStandardMaterial
            color={hovered === 'item-sanchay' ? PALETTE.gold : '#4E2F1F'}
            roughness={0.65}
          />
        </mesh>
        <mesh position={[0, 0.015, 0.005]}>
          <boxGeometry args={[0.17, 0.024, 0.13]} />
          <meshStandardMaterial color={PALETTE.paper} roughness={0.85} />
        </mesh>
        <mesh position={[0.03, 0.033, 0]}>
          <cylinderGeometry args={[0.024, 0.024, 0.006, 16]} />
          <meshStandardMaterial color={PALETTE.gold} metalness={0.9} roughness={0.2} />
        </mesh>
      </group>

      {/* ========================================================================= */}
      {/* Project Item 4: NAYANA — Gaze Tracking Optical Sensor Bar */}
      {/* ========================================================================= */}
      <group
        position={[0.34, 0.945, -0.26]}
        rotation={[0, -0.35, 0]}
        onPointerOver={(e) => {
          e.stopPropagation();
          document.body.style.cursor = 'pointer';
          setHovered('item-nayana');
        }}
        onPointerOut={(e) => {
          e.stopPropagation();
          document.body.style.cursor = 'default';
          setHovered(null);
        }}
        onClick={(e) => {
          e.stopPropagation();
          openProject(2); // 02 NAYANA
        }}
      >
        <mesh position={[0, 0.04, 0]}>
          <boxGeometry args={[0.22, 0.1, 0.12]} />
          <meshBasicMaterial visible={false} />
        </mesh>
        <mesh position={[0, 0.018, 0]}>
          <boxGeometry args={[0.16, 0.024, 0.04]} />
          <meshStandardMaterial
            color={hovered === 'item-nayana' ? PALETTE.gold : '#181E29'}
            metalness={0.8}
            roughness={0.2}
          />
        </mesh>
        {[-0.045, 0.045].map((lx, i) => (
          <mesh key={i} position={[lx, 0.018, 0.021]}>
            <sphereGeometry args={[0.009, 8, 8]} />
            <meshBasicMaterial color={'#38BDF8'} />
          </mesh>
        ))}
      </group>

      {/* ========================================================================= */}
      {/* Project Item 5: SAATHI — Multilingual Voice Companion Capsule */}
      {/* ========================================================================= */}
      <group
        position={[-0.18, 0.945, 0.38]}
        rotation={[0, 0.15, 0]}
        onPointerOver={(e) => {
          e.stopPropagation();
          document.body.style.cursor = 'pointer';
          setHovered('item-saathi');
        }}
        onPointerOut={(e) => {
          e.stopPropagation();
          document.body.style.cursor = 'default';
          setHovered(null);
        }}
        onClick={(e) => {
          e.stopPropagation();
          openProject(4); // 04 SAATHI
        }}
      >
        <mesh position={[0, 0.04, 0]}>
          <boxGeometry args={[0.15, 0.1, 0.15]} />
          <meshBasicMaterial visible={false} />
        </mesh>
        <mesh position={[0, 0.022, 0]}>
          <capsuleGeometry args={[0.025, 0.05, 4, 12]} />
          <meshStandardMaterial
            color={hovered === 'item-saathi' ? PALETTE.gold : '#E5E4E0'}
            roughness={0.25}
          />
        </mesh>
        <mesh position={[0, 0.022, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.028, 0.004, 6, 16]} />
          <meshBasicMaterial color={'#10B981'} />
        </mesh>
      </group>

      {/* ========================================================================= */}
      {/* Project Item 6: MedÆther — Emergency Dispatch Transceiver */}
      {/* ========================================================================= */}
      <group
        position={[0.42, 0.945, -0.04]}
        rotation={[0, -0.4, 0]}
        onPointerOver={(e) => {
          e.stopPropagation();
          document.body.style.cursor = 'pointer';
          setHovered('item-medaether');
        }}
        onPointerOut={(e) => {
          e.stopPropagation();
          document.body.style.cursor = 'default';
          setHovered(null);
        }}
        onClick={(e) => {
          e.stopPropagation();
          openProject(5); // 05 MedAether
        }}
      >
        <mesh position={[0, 0.04, 0]}>
          <boxGeometry args={[0.16, 0.1, 0.16]} />
          <meshBasicMaterial visible={false} />
        </mesh>
        <mesh position={[0, 0.02, 0]}>
          <boxGeometry args={[0.1, 0.035, 0.13]} />
          <meshStandardMaterial
            color={hovered === 'item-medaether' ? PALETTE.gold : '#181E29'}
            roughness={0.4}
            metalness={0.5}
          />
        </mesh>
        <mesh position={[0.025, 0.04, -0.03]}>
          <sphereGeometry args={[0.012, 6, 6]} />
          <meshBasicMaterial color={'#EF4444'} />
        </mesh>
        <mesh position={[-0.035, 0.055, -0.04]}>
          <cylinderGeometry args={[0.003, 0.003, 0.05, 6]} />
          <meshStandardMaterial color={PALETTE.gold} metalness={0.8} />
        </mesh>
      </group>

      {/* ========================================================================= */}
      {/* Master Portfolio Dossier (Red Leather Notebook) */}
      {/* ========================================================================= */}
      <group
        position={[0.08, 0.945, 0.35]}
        rotation={[0, 0.08, 0]}
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
          <boxGeometry args={[0.26, 0.08, 0.22]} />
          <meshBasicMaterial visible={false} />
        </mesh>
        <mesh position={[0, 0.012, 0]}>
          <boxGeometry args={[0.23, 0.024, 0.17]} />
          <meshStandardMaterial
            color={hovered === 'dossier' ? PALETTE.gold : PALETTE.cherry}
            roughness={0.4}
          />
        </mesh>
        <mesh position={[0, 0.012, 0.002]}>
          <boxGeometry args={[0.22, 0.02, 0.16]} />
          <meshStandardMaterial color={PALETTE.paper} roughness={0.8} />
        </mesh>
        <mesh position={[0.06, 0.026, 0.05]} rotation={[0, 0.2, 0]}>
          <boxGeometry args={[0.016, 0.002, 0.1]} />
          <meshBasicMaterial color={PALETTE.gold} />
        </mesh>
      </group>

      {/* Parisian Porcelain Espresso with Golden Crema */}
      <group
        position={[0.38, 0.94, 0.22]}
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
          <cylinderGeometry args={[0.11, 0.11, 0.14, 12]} />
          <meshBasicMaterial visible={false} />
        </mesh>
        <mesh position={[0, 0.008, 0]}>
          <cylinderGeometry args={[0.09, 0.07, 0.014, 16]} />
          <meshStandardMaterial color={PALETTE.ivory} roughness={0.3} />
        </mesh>
        <mesh position={[0, 0.055, 0]}>
          <cylinderGeometry args={[0.05, 0.04, 0.08, 16]} />
          <meshStandardMaterial color={PALETTE.ivory} roughness={0.25} />
        </mesh>
        <mesh position={[0, 0.088, 0]}>
          <cylinderGeometry args={[0.045, 0.045, 0.01, 14]} />
          <meshStandardMaterial color={'#1A1009'} roughness={0.15} />
        </mesh>
      </group>
    </group>
  );
}

export function TerraceScene() {
  const restStage = useWorldStore((s) => s.restStage);

  return (
    <>
      {/* Parisian Dusk Twilight Sky Color */}
      <color attach="background" args={['#231628']} />

      {/* Atmospheric Realistic Linear Fog softening the distant cityscape */}
      <fog attach="fog" args={['#231426', 8, 42]} />

      {/* Warm Golden Twilight Ambient Light */}
      <ambientLight color={'#FFD4B2'} intensity={1.25} />

      {/* Golden Sunset Directional Key Light illuminating Eiffel Tower & City */}
      <directionalLight
        position={[-7.0, 7.0, 3.0]}
        color={'#FFA142'}
        intensity={2.8}
      />

      {/* Backlight Sunset Horizon Sun Key */}
      <directionalLight
        position={[-2.0, 3.5, -16]}
        color={'#FF8822'}
        intensity={2.4}
      />

      {/* Cool Sky Rim Fill Light from opposite side */}
      <directionalLight
        position={[4.0, 5.0, 2.0]}
        color={PALETTE.sky}
        intensity={1.2}
      />

      {/* 3D Atmospheric Paris Sky Dome */}
      <ParisSkyDome />

      {/* 3D Architectural Eiffel Tower */}
      <EiffelTower3D position={[0, -0.4, -18]} scale={1.15} />

      {/* 3D Layered Haussmann Rooftops, Windows, Chimneys & Seine Bridge */}
      <ParisianRooftops3D />

      {/* 3D Real Balcony Floor & Haussmann Wrought-Iron Railing */}
      <BalconyArchitecture />

      {/* Foreground 3D Balcony Potted Plants & Vines */}
      <ForegroundBalconyPlants />

      {/* Carrara Marble Bistro Table with Interactive Project Items */}
      <TerraceTable />

      {/* Backlit Instanced Rain */}
      <InstancedRain restStage={restStage} />
    </>
  );
}
