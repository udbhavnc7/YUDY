import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useWorldStore } from '../../app/worldStore';
import { PALETTE } from '../../data/palette';

// KAWACH & VORTEX (Featured award-winning engineering projects)
function ScaleModel({ onClick }: { onClick: () => void }) {
  const hovered = useWorldStore((s) => s.hovered);
  const setHovered = useWorldStore((s) => s.setHovered);
  const modelGroup = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (modelGroup.current) {
      // Gentle floating animation of cantilevered mesh antenna
      modelGroup.current.position.y = 1.05 + Math.sin(state.clock.elapsedTime * 0.8) * 0.015;
    }
  });

  return (
    <group
      ref={modelGroup}
      position={[0, 1.05, 0]}
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
        <boxGeometry args={[0.9, 0.7, 0.7]} />
        <meshBasicMaterial visible={false} />
      </mesh>

      {/* Heavy obsidian pedestal */}
      <mesh position={[0, -0.05, 0]}>
        <cylinderGeometry args={[0.38, 0.44, 0.12, 24]} />
        <meshStandardMaterial color={PALETTE.ink} roughness={0.4} metalness={0.2} />
      </mesh>

      {/* Cantilevered base beam */}
      <mesh position={[-0.15, 0.1, 0]}>
        <boxGeometry args={[0.45, 0.04, 0.18]} />
        <meshStandardMaterial color={PALETTE.slate} roughness={0.3} />
      </mesh>

      {/* Cherry architectural spine (Law 5: red inside) */}
      <mesh position={[0.08, 0.22, 0]} rotation={[0, 0, -0.28]}>
        <boxGeometry args={[0.55, 0.035, 0.14]} />
        <meshStandardMaterial
          color={PALETTE.cherry}
          roughness={0.25}
          metalness={0.3}
        />
      </mesh>

      {/* Floating observatory glass chamber (blush tinted) */}
      <mesh position={[0.26, 0.32, 0]}>
        <boxGeometry args={[0.28, 0.22, 0.24]} />
        <meshStandardMaterial
          color={PALETTE.blush}
          transparent
          opacity={0.75}
          roughness={0.1}
          metalness={0.1}
        />
      </mesh>

      {/* Interior core beacon inside the chamber */}
      <mesh position={[0.26, 0.32, 0]}>
        <octahedronGeometry args={[0.06]} />
        <meshBasicMaterial color={PALETTE.gold} />
      </mesh>

      {/* Fine brass support struts */}
      <mesh position={[0.18, 0.12, 0.08]} rotation={[0.4, 0, 0]}>
        <cylinderGeometry args={[0.006, 0.006, 0.24, 8]} />
        <meshStandardMaterial color={PALETTE.gold} metalness={0.8} roughness={0.2} />
      </mesh>
      <mesh position={[0.18, 0.12, -0.08]} rotation={[-0.4, 0, 0]}>
        <cylinderGeometry args={[0.006, 0.006, 0.24, 8]} />
        <meshStandardMaterial color={PALETTE.gold} metalness={0.8} roughness={0.2} />
      </mesh>

      {/* Hover ring outline */}
      {hovered === 'project-kawach' && (
        <mesh position={[0, -0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.48, 0.5, 32]} />
          <meshBasicMaterial color={PALETTE.gold} />
        </mesh>
      )}
    </group>
  );
}

// Workshop Interior Studio Architecture
export function WorkshopScene({ insidePortal = false }: { insidePortal?: boolean }) {
  const setActivePanel = useWorldStore((s) => s.setActivePanel);

  return (
    <group position={[0, 0, insidePortal ? 0 : 0]}>
      {/* Interior Ambient & Incandescent Table Lighting */}
      <ambientLight color={PALETTE.navy} intensity={0.4} />

      {/* Warm Incandescent Desk Lamp */}
      <pointLight
        position={[0.4, 1.8, 0.3]}
        color={PALETTE.gold}
        intensity={2.8}
        distance={6}
        decay={2}
      />
      {/* Cool cherry rim fill */}
      <directionalLight
        position={[-2, 1.5, 1]}
        color={PALETTE.cherry}
        intensity={0.6}
      />

      {/* Studio Walls */}
      {/* Back Wall */}
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
        <boxGeometry args={[1.8, 0.08, 1.1]} />
        <meshStandardMaterial color={PALETTE.navy} roughness={0.6} />
      </mesh>
      {/* Table Legs */}
      {[-0.8, 0.8].map((x) =>
        [-0.45, 0.45].map((z) => (
          <mesh key={`${x}-${z}`} position={[x, 0.44, z]}>
            <boxGeometry args={[0.06, 0.88, 0.06]} />
            <meshStandardMaterial color={PALETTE.ink} roughness={0.7} />
          </mesh>
        ))
      )}

      {/* Cream Blueprint sheets on table */}
      <mesh position={[-0.45, 0.93, 0.1]} rotation={[-Math.PI / 2, 0, 0.12]}>
        <planeGeometry args={[0.55, 0.38]} />
        <meshStandardMaterial color={PALETTE.paper} roughness={0.9} />
      </mesh>

      {/* Hero Scale Model */}
      <ScaleModel onClick={() => setActivePanel('receipt')} />

      {/* Desk lamp physical body */}
      <group position={[0.65, 0.92, 0.35]}>
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

      {/* Studio Horizon Window at back (leads onward on the rail) */}
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
