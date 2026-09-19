import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { PALETTE } from '../../data/palette';

// High-Fidelity Architectural 3D Eiffel Tower Recreated with Real Proportions
export function EiffelTower3D({ position = [0, -0.6, -16], scale = 2.0 }: { position?: [number, number, number]; scale?: number }) {
  const beaconRef = useRef<THREE.PointLight>(null);
  const lanternRef = useRef<THREE.Mesh>(null);
  const beamRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime * 0.7;
    if (lanternRef.current) {
      lanternRef.current.rotation.y = t;
    }
    if (beamRef.current) {
      beamRef.current.rotation.y = t;
    }
    if (beaconRef.current) {
      beaconRef.current.intensity = 3.8 + Math.sin(t * 3) * 0.8;
    }
  });

  // Structural tiers for the tower's parabolic taper
  // Format: [yStart, yEnd, bottomSpan, topSpan, legRadius]
  const lowerTiers = useMemo(() => [
    { y0: 0.1, y1: 0.5, bSpan: 1.45, tSpan: 1.25, rad: 0.12 },
    { y0: 0.5, y1: 1.0, bSpan: 1.25, tSpan: 1.05, rad: 0.10 },
    { y0: 1.0, y1: 1.5, bSpan: 1.05, tSpan: 0.85, rad: 0.085 },
  ], []);

  const midTiers = useMemo(() => [
    { y0: 1.7, y1: 2.2, bSpan: 0.72, tSpan: 0.58, rad: 0.07 },
    { y0: 2.2, y1: 2.7, bSpan: 0.58, tSpan: 0.46, rad: 0.06 },
    { y0: 2.7, y1: 3.2, bSpan: 0.46, tSpan: 0.36, rad: 0.05 },
  ], []);

  const ironMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#46382E',
        roughness: 0.35,
        metalness: 0.75,
      }),
    []
  );

  const goldTrimMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: PALETTE.gold,
        metalness: 0.9,
        roughness: 0.25,
      }),
    []
  );

  return (
    <group position={position} scale={scale}>
      {/* ========================================================================= */}
      {/* 4 HEAVY MASONRY FOUNDATION BLOCKS */}
      {/* ========================================================================= */}
      {[
        [-1.45, 0, -1.45],
        [1.45, 0, -1.45],
        [-1.45, 0, 1.45],
        [1.45, 0, 1.45],
      ].map(([x, y, z], i) => (
        <mesh key={i} position={[x, y + 0.06, z]}>
          <boxGeometry args={[0.55, 0.12, 0.55]} />
          <meshStandardMaterial color={'#342A22'} roughness={0.9} />
        </mesh>
      ))}

      {/* ========================================================================= */}
      {/* LEVEL 1: 4 CURVED LATTICE CORNER LEGS (Ground to Platform 1) */}
      {/* ========================================================================= */}
      {lowerTiers.map((tier, tidx) => {
        const h = tier.y1 - tier.y0;
        const midY = (tier.y0 + tier.y1) / 2;
        return (
          <group key={`tier-${tidx}`}>
            {[
              [-1, -1],
              [1, -1],
              [-1, 1],
              [1, 1],
            ].map(([sx, sz], li) => {
              const bx = sx * tier.bSpan;
              const bz = sz * tier.bSpan;
              const tx = sx * tier.tSpan;
              const tz = sz * tier.tSpan;
              const cx = (bx + tx) / 2;
              const cz = (bz + tz) / 2;
              const angleX = Math.atan2(tz - bz, h);
              const angleZ = Math.atan2(bx - tx, h);

              return (
                <group key={li} position={[cx, midY, cz]} rotation={[angleX, 0, angleZ]}>
                  {/* Corner Pylon Main Truss Tube */}
                  <mesh>
                    <cylinderGeometry args={[tier.rad * 0.85, tier.rad, h, 8]} />
                    <primitive object={ironMat} />
                  </mesh>
                  {/* Horizontal Lattice Band Ring */}
                  <mesh position={[0, -h * 0.35, 0]}>
                    <boxGeometry args={[tier.rad * 2.2, 0.035, tier.rad * 2.2]} />
                    <primitive object={goldTrimMat} />
                  </mesh>
                  <mesh position={[0, h * 0.35, 0]}>
                    <boxGeometry args={[tier.rad * 2.0, 0.035, tier.rad * 2.0]} />
                    <primitive object={goldTrimMat} />
                  </mesh>
                </group>
              );
            })}
          </group>
        );
      })}

      {/* ========================================================================= */}
      {/* 4 GRAND SEMICIRCULAR BASE ARCHES WITH RADIAL STRUTS */}
      {/* ========================================================================= */}
      {/* Front Arch */}
      <group position={[0, 0.8, 0]}>
        <mesh>
          <torusGeometry args={[0.92, 0.065, 8, 32, Math.PI]} />
          <primitive object={ironMat} />
        </mesh>
        <mesh>
          <torusGeometry args={[0.82, 0.03, 6, 32, Math.PI]} />
          <primitive object={goldTrimMat} />
        </mesh>
        {/* Radial arch struts */}
        {[-0.6, -0.3, 0, 0.3, 0.6].map((angle, k) => (
          <mesh
            key={k}
            position={[Math.sin(angle) * 0.87, Math.cos(angle) * 0.87, 0]}
            rotation={[0, 0, -angle]}
          >
            <cylinderGeometry args={[0.012, 0.012, 0.18, 6]} />
            <primitive object={goldTrimMat} />
          </mesh>
        ))}
      </group>

      {/* Side Arch (90 deg) */}
      <group position={[0, 0.8, 0]} rotation={[0, Math.PI / 2, 0]}>
        <mesh>
          <torusGeometry args={[0.92, 0.065, 8, 32, Math.PI]} />
          <primitive object={ironMat} />
        </mesh>
        <mesh>
          <torusGeometry args={[0.82, 0.03, 6, 32, Math.PI]} />
          <primitive object={goldTrimMat} />
        </mesh>
      </group>

      {/* ========================================================================= */}
      {/* PLATFORM 1: First Observation Gallery (y = 1.55 to 1.7) */}
      {/* ========================================================================= */}
      <group position={[0, 1.58, 0]}>
        {/* Cantilevered Gallery Main Deck */}
        <mesh position={[0, 0.04, 0]}>
          <boxGeometry args={[1.72, 0.08, 1.72]} />
          <primitive object={ironMat} />
        </mesh>
        {/* Lower Arch Frieze Band */}
        <mesh position={[0, -0.04, 0]}>
          <boxGeometry args={[1.65, 0.06, 1.65]} />
          <primitive object={goldTrimMat} />
        </mesh>
        {/* Upper Balustrade Railing */}
        <mesh position={[0, 0.12, 0]}>
          <boxGeometry args={[1.76, 0.06, 1.76]} />
          <primitive object={goldTrimMat} />
        </mesh>
        {/* Warm Architectural Illumination Under Platform 1 */}
        <pointLight position={[0, -0.12, 0]} color={'#FFA842'} intensity={2.8} distance={6} />
      </group>

      {/* ========================================================================= */}
      {/* LEVEL 2: MID-TOWER (Platform 1 to Platform 2) */}
      {/* ========================================================================= */}
      {midTiers.map((tier, midx) => {
        const h = tier.y1 - tier.y0;
        const midY = (tier.y0 + tier.y1) / 2;
        return (
          <group key={`midtier-${midx}`}>
            {[
              [-1, -1],
              [1, -1],
              [-1, 1],
              [1, 1],
            ].map(([sx, sz], li) => {
              const bx = sx * tier.bSpan;
              const bz = sz * tier.bSpan;
              const tx = sx * tier.tSpan;
              const tz = sz * tier.tSpan;
              const cx = (bx + tx) / 2;
              const cz = (bz + tz) / 2;
              const angleX = Math.atan2(tz - bz, h);
              const angleZ = Math.atan2(bx - tx, h);

              return (
                <group key={li} position={[cx, midY, cz]} rotation={[angleX, 0, angleZ]}>
                  <mesh>
                    <cylinderGeometry args={[tier.rad * 0.85, tier.rad, h, 8]} />
                    <primitive object={ironMat} />
                  </mesh>
                  <mesh position={[0, 0, 0]}>
                    <boxGeometry args={[tier.rad * 2.0, 0.03, tier.rad * 2.0]} />
                    <primitive object={goldTrimMat} />
                  </mesh>
                </group>
              );
            })}
          </group>
        );
      })}

      {/* Mid-tower Center Lattice Core & X-Bracing */}
      <group position={[0, 2.45, 0]}>
        <mesh>
          <cylinderGeometry args={[0.26, 0.44, 1.45, 8]} />
          <primitive object={ironMat} />
        </mesh>
        {[-0.45, -0.15, 0.15, 0.45].map((ypos, idx) => (
          <mesh key={idx} position={[0, ypos, 0]}>
            <cylinderGeometry args={[0.29 + (0.45 - ypos) * 0.08, 0.31 + (0.45 - ypos) * 0.08, 0.04, 8]} />
            <primitive object={goldTrimMat} />
          </mesh>
        ))}
      </group>

      {/* ========================================================================= */}
      {/* PLATFORM 2: Second Observation Gallery (y = 3.25) */}
      {/* ========================================================================= */}
      <group position={[0, 3.25, 0]}>
        {/* Main Observation Deck */}
        <mesh position={[0, 0.04, 0]}>
          <boxGeometry args={[1.05, 0.08, 1.05]} />
          <primitive object={ironMat} />
        </mesh>
        <mesh position={[0, 0.1, 0]}>
          <boxGeometry args={[1.08, 0.05, 1.08]} />
          <primitive object={goldTrimMat} />
        </mesh>
        {/* Platform 2 Underlight */}
        <pointLight position={[0, -0.08, 0]} color={'#FFA842'} intensity={2.2} distance={5} />
      </group>

      {/* ========================================================================= */}
      {/* LEVEL 3: UPPER SHAFT, SUMMIT LANTERN & REVOLVING BEACON */}
      {/* ========================================================================= */}
      <group position={[0, 3.3, 0]}>
        {/* Slender Soaring Tapered Spire Pyramid (Height 2.3m) */}
        <mesh position={[0, 1.15, 0]}>
          <coneGeometry args={[0.34, 2.3, 8]} />
          <primitive object={ironMat} />
        </mesh>

        {/* Diagonal Ribs along Spire Edges */}
        {[0.4, 0.9, 1.4, 1.8].map((sy, i) => (
          <mesh key={i} position={[0, sy, 0]}>
            <cylinderGeometry args={[0.1 + (1.8 - sy) * 0.1, 0.12 + (1.8 - sy) * 0.1, 0.035, 8]} />
            <primitive object={goldTrimMat} />
          </mesh>
        ))}

        {/* Third Level Summit Promenade Gallery */}
        <mesh position={[0, 2.32, 0]}>
          <cylinderGeometry args={[0.15, 0.18, 0.12, 12]} />
          <primitive object={ironMat} />
        </mesh>
        <mesh position={[0, 2.4, 0]}>
          <cylinderGeometry args={[0.16, 0.16, 0.035, 12]} />
          <primitive object={goldTrimMat} />
        </mesh>

        {/* Historic Cupola Dome of Eiffel's Laboratory */}
        <mesh position={[0, 2.49, 0]}>
          <sphereGeometry args={[0.12, 16, 8, 0, Math.PI * 2, 0, Math.PI / 2]} />
          <primitive object={ironMat} />
        </mesh>

        {/* Telecommunications Mast & Antenna Needle */}
        <mesh position={[0, 2.88, 0]}>
          <cylinderGeometry args={[0.016, 0.048, 0.75, 8]} />
          <primitive object={goldTrimMat} />
        </mesh>
        <mesh position={[0, 3.4, 0]}>
          <cylinderGeometry args={[0.005, 0.016, 0.55, 6]} />
          <primitive object={goldTrimMat} />
        </mesh>

        {/* Rotating Paris Sunset Summit Lantern Beacon */}
        <mesh ref={lanternRef} position={[0, 2.56, 0]}>
          <sphereGeometry args={[0.09, 12, 12]} />
          <meshStandardMaterial
            color={'#FFE6A3'}
            emissive={'#FFA842'}
            emissiveIntensity={4.2}
            roughness={0.1}
          />
        </mesh>

        {/* Sweeping Sunset Light Beam Group */}
        <group ref={beamRef} position={[0, 2.56, 0]}>
          <pointLight
            ref={beaconRef}
            color={'#FFB54D'}
            intensity={4.5}
            distance={25}
            decay={2}
          />
          {/* Subtle volumetric light cone projecting across dusk sky */}
          <mesh position={[2.5, 0, 0]} rotation={[0, 0, -Math.PI / 2]}>
            <coneGeometry args={[0.8, 5.0, 16, 1, true]} />
            <meshBasicMaterial
              color={'#FFE299'}
              transparent
              opacity={0.12}
              side={THREE.DoubleSide}
              depthWrite={false}
            />
          </mesh>
        </group>
      </group>
    </group>
  );
}

// 3D Parisian Haussmann Rooftops with Authentic Zinc Mansard Roofs & Chimneys
export function ParisianRooftops3D() {
  const leftBuildings = useMemo(() => [
    { x: -5.0, z: -5.2, w: 3.8, h: 2.7, roofH: 1.25, color: '#2E3F54', dormers: 3, chimneys: 3 },
    { x: -2.6, z: -5.8, w: 2.4, h: 2.5, roofH: 1.15, color: '#273648', dormers: 2, chimneys: 2 },
    { x: -6.4, z: -8.8, w: 4.5, h: 2.4, roofH: 1.3, color: '#233040' },
    { x: -3.2, z: -9.8, w: 3.5, h: 2.3, roofH: 1.2, color: '#202C3C' },
  ], []);

  const rightBuildings = useMemo(() => [
    { x: 2.6, z: -5.8, w: 2.4, h: 2.5, roofH: 1.15, color: '#273648', dormers: 2, chimneys: 2 },
    { x: 5.0, z: -5.2, w: 3.8, h: 2.7, roofH: 1.25, color: '#2E3F54', dormers: 3, chimneys: 3 },
    { x: 3.2, z: -9.8, w: 3.5, h: 2.3, roofH: 1.2, color: '#202C3C' },
    { x: 6.4, z: -8.8, w: 4.5, h: 2.4, roofH: 1.3, color: '#233040' },
  ], []);

  return (
    <group>
      {/* ===================================================================== */}
      {/* River Seine Valley (Center Vista) */}
      {/* ===================================================================== */}
      <mesh position={[0, -1.8, -10.0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[32, 7.0]} />
        <meshStandardMaterial
          color={'#34261F'}
          roughness={0.1}
          metalness={0.9}
        />
      </mesh>

      {/* Pont d'Iéna Stone Bridge over the Seine */}
      <group position={[0, -1.3, -9.6]}>
        <mesh position={[0, 0.08, 0]}>
          <boxGeometry args={[8.2, 0.16, 0.6]} />
          <meshStandardMaterial color={'#66584E'} roughness={0.8} />
        </mesh>
        {[-2.5, 0, 2.5].map((bx, i) => (
          <mesh key={i} position={[bx, -0.22, 0]}>
            <cylinderGeometry args={[0.45, 0.5, 0.45, 12]} />
            <meshStandardMaterial color={'#54483E'} roughness={0.85} />
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
