import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useWorldStore } from '../../app/worldStore';
import { PALETTE } from '../../data/palette';

// Hero Architectural Scale Model for KAWACH (The Resilient Citadel)
function KawachHeroModel({ onClick }: { onClick: () => void }) {
  const hovered = useWorldStore((s) => s.hovered);
  const setHovered = useWorldStore((s) => s.setHovered);
  const heroGroup = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (heroGroup.current) {
      // Gentle vertical float of the architectural model
      heroGroup.current.position.y = 1.04 + Math.sin(state.clock.elapsedTime * 1.0) * 0.012;
    }
  });

  return (
    <group
      ref={heroGroup}
      position={[0, 1.04, 0]}
      onPointerOver={(e) => {
        e.stopPropagation();
        document.body.style.cursor = 'pointer';
        setHovered('project-kawach');
      }}
      onPointerOut={(e) => {
        e.stopPropagation();
        document.body.style.cursor = 'default';
        setHovered(null);
      }}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
    >
      {/* Invisible hit testing box */}
      <mesh position={[0, 0.25, 0]}>
        <boxGeometry args={[0.8, 0.65, 0.65]} />
        <meshBasicMaterial visible={false} />
      </mesh>

      {/* Heavy obsidian pedestal (Law 5: black outside) */}
      <mesh position={[0, -0.05, 0]}>
        <cylinderGeometry args={[0.36, 0.42, 0.1, 24]} />
        <meshStandardMaterial
          color={hovered === 'project-kawach' ? PALETTE.gold : PALETTE.ink}
          roughness={0.3}
          metalness={0.4}
        />
      </mesh>

      {/* Tactile emergency mesh repeater chassis */}
      <mesh position={[0, 0.08, 0]}>
        <boxGeometry args={[0.38, 0.15, 0.26]} />
        <meshStandardMaterial color={'#1A2230'} roughness={0.35} metalness={0.6} />
      </mesh>

      {/* Cherry architectural spine (Law 5: red inside) */}
      <mesh position={[0, 0.17, 0]}>
        <boxGeometry args={[0.4, 0.03, 0.08]} />
        <meshStandardMaterial color={PALETTE.cherry} roughness={0.25} metalness={0.4} />
      </mesh>

      {/* Dual high-gain BLE mesh antennas */}
      <mesh position={[-0.14, 0.28, -0.08]} rotation={[0, 0, -0.15]}>
        <cylinderGeometry args={[0.006, 0.006, 0.28, 8]} />
        <meshStandardMaterial color={PALETTE.gold} metalness={0.9} roughness={0.2} />
      </mesh>
      <mesh position={[0.14, 0.28, -0.08]} rotation={[0, 0, 0.15]}>
        <cylinderGeometry args={[0.006, 0.006, 0.28, 8]} />
        <meshStandardMaterial color={PALETTE.gold} metalness={0.9} roughness={0.2} />
      </mesh>

      {/* Central OLED display screen & emergency beacon */}
      <mesh position={[0, 0.11, 0.132]}>
        <planeGeometry args={[0.2, 0.08]} />
        <meshBasicMaterial color={'#0A192F'} />
      </mesh>
      <mesh position={[0, 0.18, 0.1]}>
        <sphereGeometry args={[0.016, 8, 8]} />
        <meshBasicMaterial color={'#EF4444'} />
      </mesh>

      {/* Hover ring outline */}
      {hovered === 'project-kawach' && (
        <mesh position={[0, -0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.44, 0.46, 32]} />
          <meshBasicMaterial color={PALETTE.gold} />
        </mesh>
      )}
    </group>
  );
}

// Workshop Interior Studio Architecture
export function WorkshopScene({ insidePortal = false }: { insidePortal?: boolean }) {
  const setActivePanel = useWorldStore((s) => s.setActivePanel);
  const setActiveProjectIndex = useWorldStore((s) => s.setActiveProjectIndex);

  const openKawachCaseStudy = () => {
    setActiveProjectIndex(0); // 00 KAWACH
    setActivePanel('receipt');
  };

  return (
    <group position={[0, 0, insidePortal ? 0 : 0]}>
      {/* Interior Ambient Lighting */}
      <ambientLight color={PALETTE.navy} intensity={0.45} />

      {/* Warm Incandescent Desk Lamp */}
      <pointLight
        position={[0.4, 1.8, 0.3]}
        color={PALETTE.gold}
        intensity={3.2}
        distance={6}
        decay={2}
      />
      {/* Cool cherry rim fill (Law 5: red inside) */}
      <directionalLight
        position={[-2, 1.5, 1]}
        color={PALETTE.cherry}
        intensity={0.7}
      />

      {/* Studio Architecture: Back Wall */}
      <mesh position={[0, 1.5, -2.5]}>
        <planeGeometry args={[7, 4]} />
        <meshStandardMaterial color={PALETTE.ink} roughness={0.9} />
      </mesh>
      {/* Left Wall */}
      <mesh position={[-3.5, 1.5, 0]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[6, 4]} />
        <meshStandardMaterial color={PALETTE.navy} roughness={0.9} />
      </mesh>
      {/* Right Wall */}
      <mesh position={[3.5, 1.5, 0]} rotation={[0, -Math.PI / 2, 0]}>
        <planeGeometry args={[6, 4]} />
        <meshStandardMaterial color={PALETTE.navy} roughness={0.9} />
      </mesh>
      {/* Studio Floor */}
      <mesh position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[7, 6]} />
        <meshStandardMaterial color={PALETTE.slate} roughness={0.5} metalness={0.1} />
      </mesh>

      {/* Central Drafting Workbench */}
      <mesh position={[0, 0.88, 0]}>
        <boxGeometry args={[1.9, 0.08, 1.1]} />
        <meshStandardMaterial color={PALETTE.navy} roughness={0.6} />
      </mesh>
      {/* Workbench Legs */}
      {[-0.85, 0.85].map((x) =>
        [-0.45, 0.45].map((z) => (
          <mesh key={`${x}-${z}`} position={[x, 0.44, z]}>
            <boxGeometry args={[0.06, 0.88, 0.06]} />
            <meshStandardMaterial color={PALETTE.ink} roughness={0.7} />
          </mesh>
        ))
      )}

      {/* Cream Blueprint architectural sheets for KAWACH topology */}
      <mesh position={[-0.45, 0.93, 0.1]} rotation={[-Math.PI / 2, 0, 0.12]}>
        <planeGeometry args={[0.55, 0.38]} />
        <meshStandardMaterial color={PALETTE.paper} roughness={0.9} />
      </mesh>
      {/* Blueprint grid linework */}
      <mesh position={[-0.45, 0.932, 0.1]} rotation={[-Math.PI / 2, 0, 0.12]}>
        <planeGeometry args={[0.48, 0.32]} />
        <meshBasicMaterial color={'#C8BEAC'} />
      </mesh>

      {/* Brass Drafting Calipers */}
      <mesh position={[-0.55, 0.935, -0.22]} rotation={[0, 0.4, 0]}>
        <boxGeometry args={[0.14, 0.006, 0.012]} />
        <meshStandardMaterial color={PALETTE.gold} metalness={0.85} roughness={0.2} />
      </mesh>

      {/* Hero Architectural Prototype: KAWACH */}
      <KawachHeroModel onClick={openKawachCaseStudy} />

      {/* Desk lamp physical body */}
      <group position={[0.72, 0.92, 0.35]}>
        <mesh position={[0, 0.02, 0]}>
          <cylinderGeometry args={[0.08, 0.09, 0.04, 16]} />
          <meshStandardMaterial color={PALETTE.ink} roughness={0.4} />
        </mesh>
        <mesh position={[0, 0.3, 0]} rotation={[0, 0, -0.2]}>
          <cylinderGeometry args={[0.012, 0.012, 0.6, 8]} />
          <meshStandardMaterial color={PALETTE.gold} metalness={0.7} roughness={0.3} />
        </mesh>
        <mesh position={[-0.12, 0.58, 0]} rotation={[0, 0, -0.6]}>
          <coneGeometry args={[0.12, 0.18, 16]} />
          <meshStandardMaterial color={PALETTE.ink} roughness={0.4} />
        </mesh>
        <mesh position={[-0.12, 0.52, 0]}>
          <sphereGeometry args={[0.04, 8, 8]} />
          <meshBasicMaterial color={PALETTE.gold} />
        </mesh>
      </group>

      {/* Studio Horizon Window at back (leads forward along the rail loop) */}
      <mesh position={[0, 1.8, -2.48]}>
        <planeGeometry args={[2.2, 1.6]} />
        <meshBasicMaterial color={PALETTE.navy} />
      </mesh>
      <mesh position={[0, 1.8, -2.47]} rotation={[0, 0, Math.PI / 4]}>
        <ringGeometry args={[1.05, 1.1, 4]} />
        <meshBasicMaterial color={PALETTE.ink} />
      </mesh>
    </group>
  );
}
