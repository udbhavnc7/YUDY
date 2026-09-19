import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { PALETTE } from '../../data/palette';

// High-Fidelity Architectural 3D Eiffel Tower with Parabolic Curved Lattice Pylons & Sunset Beacon
export function EiffelTower3D({ position = [0, -0.6, -16], scale = 1.9 }: { position?: [number, number, number]; scale?: number }) {
  const beaconRef = useRef<THREE.PointLight>(null);
  const lanternRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (beaconRef.current && lanternRef.current) {
      const t = state.clock.elapsedTime * 0.6;
      lanternRef.current.rotation.y = t;
      beaconRef.current.intensity = 3.6 + Math.sin(t * 2.8) * 0.8;
    }
  });

  return (
    <group position={position} scale={scale}>
      {/* ========================================================================= */}
      {/* BASE LEVEL: 4 Curved Lattice Pylons & Ground Arches */}
      {/* ========================================================================= */}
      {/* 4 Masonry Foundation Blocks */}
      {[
        [-1.15, 0, -1.15],
        [1.15, 0, -1.15],
        [-1.15, 0, 1.15],
        [1.15, 0, 1.15],
      ].map(([x, y, z], i) => (
        <mesh key={i} position={[x, y + 0.08, z]}>
          <boxGeometry args={[0.52, 0.16, 0.52]} />
          <meshStandardMaterial color={'#322822'} roughness={0.9} />
        </mesh>
      ))}

      {/* 4 Sweeping Parabolic Curved Pylon Legs */}
      {[
        // [baseX, baseZ, topX, topZ]
        [-1.0, -1.0, -0.5, -0.5],
        [1.0, -1.0, 0.5, -0.5],
        [-1.0, 1.0, -0.5, 0.5],
        [1.0, 1.0, 0.5, 0.5],
      ].map(([bx, bz, tx, tz], i) => {
        const midX = (bx + tx) * 0.52;
        const midZ = (bz + tz) * 0.52;
        return (
          <group key={`leg-${i}`}>
            {/* Lower Pylon Section (Ground to Mid-Base) */}
            <mesh position={[(bx + midX) * 0.5, 0.45, (bz + midZ) * 0.5]}>
              <cylinderGeometry args={[0.13, 0.22, 0.85, 8]} />
              <meshStandardMaterial color={'#3C2E24'} metalness={0.7} roughness={0.4} />
            </mesh>
            {/* Upper Pylon Section (Mid-Base to Platform 1) */}
            <mesh position={[(midX + tx) * 0.5, 1.15, (midZ + tz) * 0.5]}>
              <cylinderGeometry args={[0.1, 0.14, 0.7, 8]} />
              <meshStandardMaterial color={'#44352A'} metalness={0.75} roughness={0.35} />
            </mesh>
            {/* Lattice Horizontal Ring Braces */}
            {[0.3, 0.65, 1.0, 1.35].map((ly, j) => (
              <mesh key={j} position={[bx + (tx - bx) * (ly / 1.5), ly, bz + (tz - bz) * (ly / 1.5)]}>
                <boxGeometry args={[0.22, 0.035, 0.22]} />
                <meshStandardMaterial color={PALETTE.gold} metalness={0.85} roughness={0.25} />
              </mesh>
            ))}
          </group>
        );
      })}

      {/* 4 Grand Arches Connecting the Pylons Beneath Platform 1 */}
      {/* Front Arch */}
      <mesh position={[0, 0.75, 0]}>
        <torusGeometry args={[0.74, 0.065, 8, 32, Math.PI]} />
        <meshStandardMaterial color={'#44352A'} metalness={0.7} roughness={0.35} />
      </mesh>
      <mesh position={[0, 0.75, 0]}>
        <torusGeometry args={[0.66, 0.025, 6, 32, Math.PI]} />
        <meshStandardMaterial color={PALETTE.gold} metalness={0.9} roughness={0.2} />
      </mesh>
      {/* Side Cross Arch */}
      <mesh position={[0, 0.75, 0]} rotation={[0, Math.PI / 2, 0]}>
        <torusGeometry args={[0.74, 0.065, 8, 32, Math.PI]} />
        <meshStandardMaterial color={'#44352A'} metalness={0.7} roughness={0.35} />
      </mesh>

      {/* ========================================================================= */}
      {/* PLATFORM 1: First Observation Gallery (y = 1.5) */}
      {/* ========================================================================= */}
      <group position={[0, 1.5, 0]}>
        {/* Gallery Deck Plate */}
        <mesh position={[0, 0.04, 0]}>
          <boxGeometry args={[1.38, 0.08, 1.38]} />
          <meshStandardMaterial color={'#4C3C30'} metalness={0.7} roughness={0.4} />
        </mesh>
        {/* Ornate Gold Railing Frieze */}
        <mesh position={[0, 0.11, 0]}>
          <boxGeometry args={[1.42, 0.06, 1.42]} />
          <meshStandardMaterial color={PALETTE.gold} metalness={0.9} roughness={0.2} />
        </mesh>
        {/* Warm Gallery Architectural Underlight */}
        <pointLight position={[0, -0.08, 0]} color={'#FFA842'} intensity={2.0} distance={5} />
      </group>

      {/* ========================================================================= */}
      {/* MID-TOWER: Platform 1 to Platform 2 (y = 1.55 to 2.9) */}
      {/* ========================================================================= */}
      <group position={[0, 1.55, 0]}>
        {/* 4 Tapered Mid-Pylons */}
        {[
          [-0.45, -0.45, -0.28, -0.28],
          [0.45, -0.45, 0.28, -0.28],
          [-0.45, 0.45, -0.28, 0.28],
          [0.45, 0.45, 0.28, 0.28],
        ].map(([bx, bz, tx, tz], i) => (
          <group key={`midleg-${i}`}>
            <mesh position={[(bx + tx) * 0.5, 0.65, (bz + tz) * 0.5]}>
              <cylinderGeometry args={[0.075, 0.1, 1.3, 8]} />
              <meshStandardMaterial color={'#44352A'} metalness={0.75} roughness={0.35} />
            </mesh>
          </group>
        ))}

        {/* Central Structural Core Cage */}
        <mesh position={[0, 0.65, 0]}>
          <cylinderGeometry args={[0.26, 0.38, 1.3, 8]} />
          <meshStandardMaterial color={'#382C22'} roughness={0.6} metalness={0.6} />
        </mesh>

        {/* Diagonal X-Brace Lattice Belts */}
        {[0.25, 0.65, 1.05].map((my, k) => (
          <mesh key={k} position={[0, my, 0]}>
            <cylinderGeometry args={[0.32 + (1.3 - my) * 0.08, 0.35 + (1.3 - my) * 0.08, 0.04, 8]} />
            <meshStandardMaterial color={PALETTE.gold} metalness={0.85} roughness={0.3} />
          </mesh>
        ))}
      </group>

      {/* ========================================================================= */}
      {/* PLATFORM 2: Second Observation Gallery (y = 2.9) */}
      {/* ========================================================================= */}
      <group position={[0, 2.9, 0]}>
        <mesh position={[0, 0.04, 0]}>
          <boxGeometry args={[0.88, 0.07, 0.88]} />
          <meshStandardMaterial color={'#4C3C30'} metalness={0.75} roughness={0.4} />
        </mesh>
        <mesh position={[0, 0.095, 0]}>
          <boxGeometry args={[0.92, 0.04, 0.92]} />
          <meshStandardMaterial color={PALETTE.gold} metalness={0.9} roughness={0.2} />
        </mesh>
        <pointLight position={[0, -0.06, 0]} color={'#FFA842'} intensity={1.6} distance={4} />
      </group>

      {/* ========================================================================= */}
      {/* UPPER SPIRE & LANTERN: Platform 2 to Summit Needle (y = 2.95 to 5.8) */}
      {/* ========================================================================= */}
      <group position={[0, 2.95, 0]}>
        {/* Slender Soaring Pyramid Shaft */}
        <mesh position={[0, 1.0, 0]}>
          <coneGeometry args={[0.3, 2.0, 8]} />
          <meshStandardMaterial color={'#403228'} roughness={0.5} metalness={0.7} />
        </mesh>

        {/* Summit Observation Chamber (Level 3) */}
        <mesh position={[0, 2.05, 0]}>
          <cylinderGeometry args={[0.13, 0.16, 0.12, 12]} />
          <meshStandardMaterial color={'#4C3C30'} metalness={0.8} />
        </mesh>
        <mesh position={[0, 2.13, 0]}>
          <cylinderGeometry args={[0.14, 0.14, 0.03, 12]} />
          <meshStandardMaterial color={PALETTE.gold} metalness={0.9} />
        </mesh>

        {/* Lantern Cupola Dome */}
        <mesh position={[0, 2.22, 0]}>
          <sphereGeometry args={[0.11, 12, 8, 0, Math.PI * 2, 0, Math.PI / 2]} />
          <meshStandardMaterial color={'#4C3C30'} metalness={0.8} />
        </mesh>

        {/* Telecommunications Mast & Antenna Needle */}
        <mesh position={[0, 2.58, 0]}>
          <cylinderGeometry args={[0.016, 0.045, 0.7, 8]} />
          <meshStandardMaterial color={PALETTE.gold} metalness={0.9} roughness={0.2} />
        </mesh>
        <mesh position={[0, 3.05, 0]}>
          <cylinderGeometry args={[0.005, 0.016, 0.5, 6]} />
          <meshStandardMaterial color={PALETTE.gold} metalness={0.95} />
        </mesh>

        {/* Rotating Paris Sunset Summit Beacon */}
        <mesh ref={lanternRef} position={[0, 2.28, 0]}>
          <sphereGeometry args={[0.08, 12, 12]} />
          <meshStandardMaterial
            color={'#FFE6A3'}
            emissive={'#FFA842'}
            emissiveIntensity={3.8}
            roughness={0.1}
          />
        </mesh>
        <pointLight
          ref={beaconRef}
          position={[0, 2.28, 0]}
          color={'#FFBD59'}
          intensity={4.0}
          distance={20}
          decay={2}
        />
      </group>
    </group>
  );
}

// 3D Parisian Haussmann Rooftops with Authentic Zinc Mansard Roofs & Chimneys
export function ParisianRooftops3D() {
  const leftBuildings = useMemo(() => [
    { x: -4.8, z: -5.2, w: 3.6, h: 2.7, roofH: 1.25, color: '#2E3F54', dormers: 3, chimneys: 3 },
    { x: -2.5, z: -5.8, w: 2.3, h: 2.5, roofH: 1.15, color: '#273648', dormers: 2, chimneys: 2 },
    { x: -6.2, z: -8.8, w: 4.4, h: 2.4, roofH: 1.3, color: '#233040' },
    { x: -3.0, z: -9.8, w: 3.4, h: 2.3, roofH: 1.2, color: '#202C3C' },
  ], []);

  const rightBuildings = useMemo(() => [
    { x: 2.5, z: -5.8, w: 2.3, h: 2.5, roofH: 1.15, color: '#273648', dormers: 2, chimneys: 2 },
    { x: 4.8, z: -5.2, w: 3.6, h: 2.7, roofH: 1.25, color: '#2E3F54', dormers: 3, chimneys: 3 },
    { x: 3.0, z: -9.8, w: 3.4, h: 2.3, roofH: 1.2, color: '#202C3C' },
    { x: 6.2, z: -8.8, w: 4.4, h: 2.4, roofH: 1.3, color: '#233040' },
  ], []);

  return (
    <group>
      {/* ===================================================================== */}
      {/* River Seine Valley (Center Vista) */}
      {/* ===================================================================== */}
      <mesh position={[0, -1.8, -10.0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[30, 6.5]} />
        <meshStandardMaterial
          color={'#362820'}
          roughness={0.12}
          metalness={0.88}
        />
      </mesh>

      {/* Pont d'Iéna Stone Bridge over the Seine */}
      <group position={[0, -1.3, -9.6]}>
        <mesh position={[0, 0.08, 0]}>
          <boxGeometry args={[8.0, 0.16, 0.6]} />
          <meshStandardMaterial color={'#6A5C52'} roughness={0.8} />
        </mesh>
        {[-2.4, 0, 2.4].map((bx, i) => (
          <mesh key={i} position={[bx, -0.22, 0]}>
            <cylinderGeometry args={[0.45, 0.5, 0.45, 12]} />
            <meshStandardMaterial color={'#584C42'} roughness={0.85} />
          </mesh>
        ))}
      </group>

      {/* ===================================================================== */}
      {/* Left Parisian Haussmann Rooftop Blocks */}
      {/* ===================================================================== */}
      {leftBuildings.map((b, i) => {
        const baseY = -3.2;
        return (
          <group key={`left-${i}`} position={[b.x, baseY, b.z]}>
            {/* Stone Wall Body */}
            <mesh position={[0, b.h / 2, 0]}>
              <boxGeometry args={[b.w, b.h, 2.2]} />
              <meshStandardMaterial color={'#5A4E44'} roughness={0.85} />
            </mesh>

            {/* Cornice */}
            <mesh position={[0, b.h + 0.05, 0]}>
              <boxGeometry args={[b.w + 0.12, 0.1, 2.3]} />
              <meshStandardMaterial color={'#74665A'} roughness={0.7} />
            </mesh>

            {/* Sloped Parisian Blue-Grey Zinc Mansard Roof */}
            <mesh position={[0, b.h + b.roofH / 2, 0]}>
              <boxGeometry args={[b.w - 0.06, b.roofH, 2.1]} />
              <meshStandardMaterial color={b.color} roughness={0.4} metalness={0.45} />
            </mesh>

            {/* Lit Dormer Windows (Lucarnes) */}
            {b.dormers && Array.from({ length: b.dormers }).map((_, j) => {
              const dx = ((j - (b.dormers - 1) / 2) * (b.w * 0.65)) / Math.max(b.dormers - 1, 1);
              return (
                <group key={j} position={[dx, b.h + b.roofH * 0.45, 1.08]}>
                  <mesh>
                    <boxGeometry args={[0.3, 0.42, 0.14]} />
                    <meshStandardMaterial color={'#66584E'} roughness={0.7} />
                  </mesh>
                  <mesh position={[0, 0, 0.08]}>
                    <planeGeometry args={[0.2, 0.32]} />
                    <meshBasicMaterial color={'#FFA842'} />
                  </mesh>
                </group>
              );
            })}

            {/* Terracotta Chimney Stacks with Red Clay Pots */}
            {b.chimneys && Array.from({ length: b.chimneys }).map((_, k) => {
              const cx = ((k - (b.chimneys - 1) / 2) * (b.w * 0.7)) / Math.max(b.chimneys - 1, 1);
              return (
                <group key={k} position={[cx, b.h + b.roofH + 0.18, 0.3]}>
                  <mesh>
                    <boxGeometry args={[0.36, 0.36, 0.24]} />
                    <meshStandardMaterial color={'#743B2A'} roughness={0.8} />
                  </mesh>
                  {[-0.1, 0.1].map((px, l) => (
                    <mesh key={l} position={[px, 0.24, 0]}>
                      <cylinderGeometry args={[0.04, 0.048, 0.18, 8]} />
                      <meshStandardMaterial color={'#94472D'} roughness={0.7} />
                    </mesh>
                  ))}
                </group>
              );
            })}
          </group>
        );
      })}

      {/* ===================================================================== */}
      {/* Right Parisian Haussmann Rooftop Blocks */}
      {/* ===================================================================== */}
      {rightBuildings.map((b, i) => {
        const baseY = -3.2;
        return (
          <group key={`right-${i}`} position={[b.x, baseY, b.z]}>
            <mesh position={[0, b.h / 2, 0]}>
              <boxGeometry args={[b.w, b.h, 2.2]} />
              <meshStandardMaterial color={'#5A4E44'} roughness={0.85} />
            </mesh>
            <mesh position={[0, b.h + 0.05, 0]}>
              <boxGeometry args={[b.w + 0.12, 0.1, 2.3]} />
              <meshStandardMaterial color={'#74665A'} roughness={0.7} />
            </mesh>
            <mesh position={[0, b.h + b.roofH / 2, 0]}>
              <boxGeometry args={[b.w - 0.06, b.roofH, 2.1]} />
              <meshStandardMaterial color={b.color} roughness={0.4} metalness={0.45} />
            </mesh>
            {b.dormers && Array.from({ length: b.dormers }).map((_, j) => {
              const dx = ((j - (b.dormers - 1) / 2) * (b.w * 0.65)) / Math.max(b.dormers - 1, 1);
              return (
                <group key={j} position={[dx, b.h + b.roofH * 0.45, 1.08]}>
                  <mesh>
                    <boxGeometry args={[0.3, 0.42, 0.14]} />
                    <meshStandardMaterial color={'#66584E'} roughness={0.7} />
                  </mesh>
                  <mesh position={[0, 0, 0.08]}>
                    <planeGeometry args={[0.2, 0.32]} />
                    <meshBasicMaterial color={'#FFA842'} />
                  </mesh>
                </group>
              );
            })}
          </group>
        );
      })}

      {/* Distant Invalides Gold Dome (East Horizon) */}
      <group position={[6.5, 0.4, -15.0]}>
        <mesh position={[0, 0.5, 0]}>
          <boxGeometry args={[2.5, 1.0, 1.8]} />
          <meshStandardMaterial color={'#221A20'} />
        </mesh>
        <mesh position={[0, 1.3, 0]}>
          <cylinderGeometry args={[0.55, 0.65, 0.8, 12]} />
          <meshStandardMaterial color={'#30262C'} />
        </mesh>
        <mesh position={[0, 1.9, 0]}>
          <coneGeometry args={[0.55, 0.7, 12]} />
          <meshStandardMaterial color={PALETTE.gold} metalness={0.9} roughness={0.2} />
        </mesh>
      </group>
    </group>
  );
}

// 3D Atmospheric Sky Dome with Paris Sunset Color Ramp & Dusk Cloud Strata
export function ParisSkyDome() {
  return (
    <group position={[0, 0, -5]}>
      {/* Sky Sphere Envelope */}
      <mesh>
        <sphereGeometry args={[44, 24, 16]} />
        <meshBasicMaterial
          color={'#180D1E'}
          side={THREE.BackSide}
          depthWrite={false}
        />
      </mesh>

      {/* Deep Twilight Purple Upper Sky Gradient */}
      <mesh position={[0, 6.5, -23]}>
        <planeGeometry args={[72, 22]} />
        <meshBasicMaterial
          color={'#3E1E3D'}
          transparent
          opacity={0.6}
          depthWrite={false}
        />
      </mesh>

      {/* Warm Golden Sunset Horizon Gradient */}
      <mesh position={[0, 3.2, -22]}>
        <planeGeometry args={[70, 18]} />
        <meshBasicMaterial
          color={'#D05822'}
          transparent
          opacity={0.75}
          depthWrite={false}
        />
      </mesh>

      {/* Golden Amber Sunset Core Glow */}
      <mesh position={[0, 1.8, -21.5]}>
        <planeGeometry args={[54, 10]} />
        <meshBasicMaterial
          color={'#F28C32'}
          transparent
          opacity={0.7}
          depthWrite={false}
        />
      </mesh>

      {/* Soft Sunset Dusk Cloud Strata */}
      {[-1.5, 0.8, 3.2, 5.2].map((cy, i) => (
        <mesh key={i} position={[(i % 2 === 0 ? -4 : 4), cy, -20.8 + i * 0.2]}>
          <planeGeometry args={[26 + i * 6, 2.2 + i * 0.4]} />
          <meshBasicMaterial
            color={i < 2 ? '#DC6E2B' : '#60304C'}
            transparent
            opacity={0.35}
            depthWrite={false}
          />
        </mesh>
      ))}
    </group>
  );
}
