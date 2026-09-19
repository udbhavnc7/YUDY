import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { PALETTE } from '../../data/palette';

// 3D Architectural Eiffel Tower with Curved Lattice Legs, Observation Decks & Sunset Beacon
export function EiffelTower3D({ position = [0, -0.6, -16], scale = 1.8 }: { position?: [number, number, number]; scale?: number }) {
  const beaconRef = useRef<THREE.PointLight>(null);
  const lanternRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (beaconRef.current && lanternRef.current) {
      const t = state.clock.elapsedTime * 0.7;
      lanternRef.current.rotation.y = t;
      beaconRef.current.intensity = 3.2 + Math.sin(t * 2.5) * 0.6;
    }
  });

  return (
    <group position={position} scale={scale}>
      {/* 4 Heavy Stone Foundation Piers */}
      {[
        [-0.9, 0, -0.9],
        [0.9, 0, -0.9],
        [-0.9, 0, 0.9],
        [0.9, 0, 0.9],
      ].map(([x, y, z], i) => (
        <mesh key={i} position={[x, y + 0.1, z]}>
          <boxGeometry args={[0.55, 0.2, 0.55]} />
          <meshStandardMaterial color={'#3B2F28'} roughness={0.9} />
        </mesh>
      ))}

      {/* 4 Sweeping Inward Curved Lattice Legs */}
      {[
        [-0.78, 0.2, -0.78, 0.2, 0.2],
        [0.78, 0.2, -0.78, 0.2, -0.2],
        [-0.78, 0.2, 0.78, -0.2, 0.2],
        [0.78, 0.2, 0.78, -0.2, -0.2],
      ].map(([x, y, z, rotX, rotZ], i) => (
        <group key={i} position={[x, y, z]} rotation={[rotX, 0, rotZ]}>
          <mesh position={[0, 0.75, 0]}>
            <cylinderGeometry args={[0.16, 0.26, 1.5, 8]} />
            <meshStandardMaterial
              color={'#382C24'}
              roughness={0.65}
              metalness={0.6}
            />
          </mesh>
          {/* Iron cross-braces */}
          {[-0.3, 0, 0.3].map((sy, j) => (
            <mesh key={j} position={[0, 0.75 + sy, 0]} rotation={[0.4, 0.4, 0]}>
              <boxGeometry args={[0.24, 0.04, 0.24]} />
              <meshStandardMaterial color={'#281E19'} metalness={0.7} />
            </mesh>
          ))}
        </group>
      ))}

      {/* Monumental Base Arch with Inner Lattice */}
      <mesh position={[0, 0.75, 0]}>
        <torusGeometry args={[0.68, 0.065, 8, 24, Math.PI]} />
        <meshStandardMaterial color={'#45352B'} metalness={0.7} roughness={0.35} />
      </mesh>
      <mesh position={[0, 0.75, 0]}>
        <torusGeometry args={[0.58, 0.025, 6, 24, Math.PI]} />
        <meshStandardMaterial color={PALETTE.gold} metalness={0.85} roughness={0.25} />
      </mesh>

      {/* Platform 1 (First Observation Gallery) */}
      <group position={[0, 1.5, 0]}>
        <mesh position={[0, 0.05, 0]}>
          <boxGeometry args={[1.35, 0.1, 1.35]} />
          <meshStandardMaterial color={'#483A30'} metalness={0.7} roughness={0.4} />
        </mesh>
        {/* Gallery Railing & Golden Architectural Frieze */}
        <mesh position={[0, 0.13, 0]}>
          <boxGeometry args={[1.38, 0.06, 1.38]} />
          <meshStandardMaterial color={PALETTE.gold} metalness={0.85} roughness={0.25} />
        </mesh>
        {/* Under-gallery warm illumination */}
        <pointLight position={[0, -0.1, 0]} color={'#FFA842'} intensity={1.8} distance={5} />
      </group>

      {/* Mid Tower Section with Architectural X-Bracing */}
      <group position={[0, 1.6, 0]}>
        <mesh position={[0, 0.75, 0]}>
          <cylinderGeometry args={[0.42, 0.58, 1.5, 8]} />
          <meshStandardMaterial color={'#3D3028'} roughness={0.55} metalness={0.65} />
        </mesh>
        {/* Lattice decorative bands */}
        {[-0.35, -0.1, 0.15, 0.4].map((ly, k) => (
          <mesh key={k} position={[0, 0.75 + ly, 0]}>
            <cylinderGeometry args={[0.44 + ly * 0.05, 0.47 + ly * 0.05, 0.045, 8]} />
            <meshStandardMaterial color={PALETTE.gold} metalness={0.85} roughness={0.3} />
          </mesh>
        ))}
      </group>

      {/* Platform 2 (Second Observation Deck) */}
      <group position={[0, 3.1, 0]}>
        <mesh position={[0, 0.04, 0]}>
          <boxGeometry args={[0.9, 0.08, 0.9]} />
          <meshStandardMaterial color={'#483A30'} metalness={0.7} roughness={0.4} />
        </mesh>
        <mesh position={[0, 0.1, 0]}>
          <boxGeometry args={[0.92, 0.04, 0.92]} />
          <meshStandardMaterial color={PALETTE.gold} metalness={0.85} roughness={0.25} />
        </mesh>
        <pointLight position={[0, -0.08, 0]} color={'#FFA842'} intensity={1.4} distance={4} />
      </group>

      {/* Upper Spire Needle Reaching into the Sunset Sky */}
      <group position={[0, 3.2, 0]}>
        <mesh position={[0, 1.25, 0]}>
          <coneGeometry args={[0.34, 2.5, 8]} />
          <meshStandardMaterial color={'#382C24'} roughness={0.6} metalness={0.6} />
        </mesh>

        {/* Summit Lantern Gallery */}
        <mesh position={[0, 2.55, 0]}>
          <cylinderGeometry args={[0.15, 0.18, 0.14, 12]} />
          <meshStandardMaterial color={'#483A30'} metalness={0.8} />
        </mesh>

        {/* Antenna Mast */}
        <mesh position={[0, 3.1, 0]}>
          <cylinderGeometry args={[0.02, 0.06, 1.0, 8]} />
          <meshStandardMaterial color={PALETTE.gold} metalness={0.9} roughness={0.2} />
        </mesh>
        <mesh position={[0, 3.65, 0]}>
          <cylinderGeometry args={[0.006, 0.02, 0.6, 6]} />
          <meshStandardMaterial color={PALETTE.gold} metalness={0.9} />
        </mesh>

        {/* Glowing Sunset Lantern Beacon */}
        <mesh ref={lanternRef} position={[0, 2.65, 0]}>
          <sphereGeometry args={[0.1, 12, 12]} />
          <meshStandardMaterial
            color={'#FFE6A3'}
            emissive={'#FFA842'}
            emissiveIntensity={3.0}
            roughness={0.1}
          />
        </mesh>
        <pointLight
          ref={beaconRef}
          position={[0, 2.65, 0]}
          color={'#FFBD59'}
          intensity={3.5}
          distance={18}
          decay={2}
        />
      </group>
    </group>
  );
}

// 3D Parisian Haussmann Rooftops at True Penthouse Elevation
export function ParisianRooftops3D() {
  // Street level is at y = -3.2, so rooftop ridges sit at y = -0.2 to 0.4 below eye-level!
  // Center is left open for clear vista of the Seine and Eiffel Tower!
  const leftBuildings = useMemo(() => [
    { x: -4.5, z: -5.0, w: 3.4, h: 2.6, roofH: 1.2, color: '#324458', dormers: 3, chimneys: 3 },
    { x: -2.4, z: -5.6, w: 2.2, h: 2.5, roofH: 1.1, color: '#2B394A', dormers: 2, chimneys: 2 },
    { x: -5.8, z: -8.5, w: 4.2, h: 2.4, roofH: 1.3, color: '#283444' },
    { x: -2.8, z: -9.5, w: 3.2, h: 2.3, roofH: 1.2, color: '#242F3E' },
  ], []);

  const rightBuildings = useMemo(() => [
    { x: 2.4, z: -5.6, w: 2.2, h: 2.5, roofH: 1.1, color: '#2B394A', dormers: 2, chimneys: 2 },
    { x: 4.5, z: -5.0, w: 3.4, h: 2.6, roofH: 1.2, color: '#324458', dormers: 3, chimneys: 3 },
    { x: 2.8, z: -9.5, w: 3.2, h: 2.3, roofH: 1.2, color: '#242F3E' },
    { x: 5.8, z: -8.5, w: 4.2, h: 2.4, roofH: 1.3, color: '#283444' },
  ], []);

  return (
    <group>
      {/* ===================================================================== */}
      {/* River Seine Valley (Center Vista) */}
      {/* ===================================================================== */}
      <mesh position={[0, -1.8, -10.0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[28, 6.0]} />
        <meshStandardMaterial
          color={'#3A2C26'}
          roughness={0.15}
          metalness={0.85}
        />
      </mesh>

      {/* Arched Stone Parisian Bridge (Pont d'Iéna style over the Seine) */}
      <group position={[0, -1.3, -9.6]}>
        <mesh position={[0, 0.08, 0]}>
          <boxGeometry args={[7.5, 0.16, 0.6]} />
          <meshStandardMaterial color={'#6E6056'} roughness={0.8} />
        </mesh>
        {[-2.2, 0, 2.2].map((bx, i) => (
          <mesh key={i} position={[bx, -0.22, 0]}>
            <cylinderGeometry args={[0.45, 0.5, 0.45, 12]} />
            <meshStandardMaterial color={'#5C5046'} roughness={0.85} />
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
              <meshStandardMaterial color={'#5E5248'} roughness={0.85} />
            </mesh>

            {/* Cornice */}
            <mesh position={[0, b.h + 0.05, 0]}>
              <boxGeometry args={[b.w + 0.12, 0.1, 2.3]} />
              <meshStandardMaterial color={'#786A5E'} roughness={0.7} />
            </mesh>

            {/* Sloped Zinc Mansard Roof */}
            <mesh position={[0, b.h + b.roofH / 2, 0]}>
              <boxGeometry args={[b.w - 0.06, b.roofH, 2.1]} />
              <meshStandardMaterial color={b.color} roughness={0.4} metalness={0.45} />
            </mesh>

            {/* Lit Dormers */}
            {b.dormers && Array.from({ length: b.dormers }).map((_, j) => {
              const dx = ((j - (b.dormers - 1) / 2) * (b.w * 0.65)) / Math.max(b.dormers - 1, 1);
              return (
                <group key={j} position={[dx, b.h + b.roofH * 0.45, 1.08]}>
                  <mesh>
                    <boxGeometry args={[0.3, 0.42, 0.14]} />
                    <meshStandardMaterial color={'#6A5C52'} roughness={0.7} />
                  </mesh>
                  <mesh position={[0, 0, 0.08]}>
                    <planeGeometry args={[0.2, 0.32]} />
                    <meshBasicMaterial color={'#FFA842'} />
                  </mesh>
                </group>
              );
            })}

            {/* Chimney Stacks */}
            {b.chimneys && Array.from({ length: b.chimneys }).map((_, k) => {
              const cx = ((k - (b.chimneys - 1) / 2) * (b.w * 0.7)) / Math.max(b.chimneys - 1, 1);
              return (
                <group key={k} position={[cx, b.h + b.roofH + 0.18, 0.3]}>
                  <mesh>
                    <boxGeometry args={[0.36, 0.36, 0.24]} />
                    <meshStandardMaterial color={'#7A3F2C'} roughness={0.8} />
                  </mesh>
                  {[-0.1, 0.1].map((px, l) => (
                    <mesh key={l} position={[px, 0.24, 0]}>
                      <cylinderGeometry args={[0.04, 0.048, 0.18, 8]} />
                      <meshStandardMaterial color={'#9C4C30'} roughness={0.7} />
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
              <meshStandardMaterial color={'#5E5248'} roughness={0.85} />
            </mesh>
            <mesh position={[0, b.h + 0.05, 0]}>
              <boxGeometry args={[b.w + 0.12, 0.1, 2.3]} />
              <meshStandardMaterial color={'#786A5E'} roughness={0.7} />
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
                    <meshStandardMaterial color={'#6A5C52'} roughness={0.7} />
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

      {/* Distant Invalides Gold Cupola Dome (East Horizon) */}
      <group position={[6.5, 0.4, -15.0]}>
        <mesh position={[0, 0.5, 0]}>
          <boxGeometry args={[2.5, 1.0, 1.8]} />
          <meshStandardMaterial color={'#241C22'} />
        </mesh>
        <mesh position={[0, 1.3, 0]}>
          <cylinderGeometry args={[0.55, 0.65, 0.8, 12]} />
          <meshStandardMaterial color={'#342A30'} />
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
          color={'#1B0F22'}
          side={THREE.BackSide}
          depthWrite={false}
        />
      </mesh>

      {/* Deep Violet Upper Sky Gradient */}
      <mesh position={[0, 6.0, -23]}>
        <planeGeometry args={[70, 22]} />
        <meshBasicMaterial
          color={'#432342'}
          transparent
          opacity={0.55}
          depthWrite={false}
        />
      </mesh>

      {/* Warm Golden Apricot Horizon Sunset Gradient */}
      <mesh position={[0, 3.2, -22]}>
        <planeGeometry args={[68, 18]} />
        <meshBasicMaterial
          color={'#D4612A'}
          transparent
          opacity={0.7}
          depthWrite={false}
        />
      </mesh>

      {/* Golden Amber Sunset Core Glow */}
      <mesh position={[0, 1.8, -21.5]}>
        <planeGeometry args={[52, 10]} />
        <meshBasicMaterial
          color={'#F59438'}
          transparent
          opacity={0.65}
          depthWrite={false}
        />
      </mesh>

      {/* Soft Sunset Dusk Cloud Strata */}
      {[-1.5, 0.8, 3.2, 5.0].map((cy, i) => (
        <mesh key={i} position={[(i % 2 === 0 ? -4 : 4), cy, -20.8 + i * 0.2]}>
          <planeGeometry args={[26 + i * 6, 2.2 + i * 0.4]} />
          <meshBasicMaterial
            color={i < 2 ? '#E07532' : '#683652'}
            transparent
            opacity={0.32}
            depthWrite={false}
          />
        </mesh>
      ))}
    </group>
  );
}
