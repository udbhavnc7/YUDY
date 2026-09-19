import { useEffect, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useWorldStore } from '../../app/worldStore';
import { RAIL_NODES } from '../../data/rail';

export function CameraRig() {
  const { camera } = useThree();
  const railNode = useWorldStore((s) => s.railNode);
  const phase = useWorldStore((s) => s.phase);
  const setPhase = useWorldStore((s) => s.setPhase);
  const setRailNode = useWorldStore((s) => s.setRailNode);
  const setActiveMoment = useWorldStore((s) => s.setActiveMoment);
  const hovered = useWorldStore((s) => s.hovered);
  const restStage = useWorldStore((s) => s.restStage);
  const reducedMotion = useWorldStore((s) => s.reducedMotion);

  // Motion targets
  const currentPos = useRef(new THREE.Vector3());
  const currentLookAt = useRef(new THREE.Vector3());
  const targetPos = useRef(new THREE.Vector3());
  const targetLookAt = useRef(new THREE.Vector3());
  const pointerOffset = useRef({ x: 0, y: 0 });

  // Pose logging (dev-only on 'K' key)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'k' || e.key === 'K') {
        const p = camera.position;
        const dir = new THREE.Vector3();
        camera.getWorldDirection(dir);
        const lookTarget = p.clone().add(dir.multiplyScalar(2));
        const perspCam = camera as THREE.PerspectiveCamera;

        const shotData = {
          position: [+p.x.toFixed(2), +p.y.toFixed(2), +p.z.toFixed(2)],
          target: [+lookTarget.x.toFixed(2), +lookTarget.y.toFixed(2), +lookTarget.z.toFixed(2)],
          fov: Math.round(perspCam.fov || 45),
          timestamp: new Date().toISOString(),
          railNode,
          phase,
          restStage,
        };

        console.info('[YUDY Rail Shot Recorder]', JSON.stringify(shotData, null, 2));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [camera, railNode, phase, restStage]);

  // Pointer parallax tracking
  useEffect(() => {
    const handlePointerMove = (e: PointerEvent) => {
      if (reducedMotion || phase === 'diving' || phase === 'surfacing') {
        pointerOffset.current = { x: 0, y: 0 };
        return;
      }
      const nx = (e.clientX / window.innerWidth) * 2 - 1;
      const ny = -(e.clientY / window.innerHeight) * 2 + 1;
      pointerOffset.current = {
        x: nx * 0.12,
        y: ny * 0.08,
      };
    };

    window.addEventListener('pointermove', handlePointerMove);
    return () => window.removeEventListener('pointermove', handlePointerMove);
  }, [reducedMotion, phase]);

  // Initial positioning
  useEffect(() => {
    const node = RAIL_NODES[railNode] || RAIL_NODES.terrace;
    const shot = phase === 'dwelling' || phase === 'inside' ? node.rest : node.enter;
    camera.position.set(...shot.position);
    currentPos.current.set(...shot.position);
    currentLookAt.current.set(...shot.target);
    camera.lookAt(...shot.target);
  }, [railNode]); // eslint-disable-line react-hooks/exhaustive-deps

  useFrame((state, delta) => {
    const node = RAIL_NODES[railNode] || RAIL_NODES.terrace;

    // Handle Dive Transition
    if (phase === 'diving') {
      if (reducedMotion) {
        setPhase('inside');
        setRailNode('workshop');
        setActiveMoment('workshop');
        currentPos.current.set(0, 1.2, 1.8);
        currentLookAt.current.set(0, 0.85, 0);
        return;
      }

      // Dolly straight through laptop screen
      targetPos.current.set(0, 1.03, -0.155);
      targetLookAt.current.set(0, 1.03, -0.6);

      const diveFactor = Math.min(delta * 2.2, 1);
      currentPos.current.lerp(targetPos.current, diveFactor);
      currentLookAt.current.lerp(targetLookAt.current, diveFactor);

      camera.position.copy(currentPos.current);
      camera.lookAt(currentLookAt.current);

      const screenDist = currentPos.current.distanceTo(targetPos.current);
      if (screenDist < 0.075) {
        // Complete dive into Workshop
        setPhase('inside');
        setRailNode('workshop');
        setActiveMoment('workshop');
        currentPos.current.set(0, 1.25, 2.1);
        currentLookAt.current.set(0, 0.95, 0);
      }
      return;
    }

    // Handle Surfacing / Rail Forward Travel from Workshop
    if (phase === 'surfacing') {
      targetPos.current.set(0, 1.3, -2.6);
      targetLookAt.current.set(0, 1.1, -6.0);

      const surfFactor = Math.min(delta * 2.4, 1);
      currentPos.current.lerp(targetPos.current, surfFactor);
      currentLookAt.current.lerp(targetLookAt.current, surfFactor);

      camera.position.copy(currentPos.current);
      camera.lookAt(currentLookAt.current);

      if (currentPos.current.z <= -2.4) {
        // Loop back to Terrace
        setRailNode('terrace');
        setActiveMoment('terrace');
        setPhase('dwelling');
        currentPos.current.set(0, 2.0, 3.5);
        currentLookAt.current.set(0, 1.0, 0);
      }
      return;
    }

    // Baseline dwelling / inside state
    const shot = phase === 'inside' || phase === 'dwelling' ? node.rest : node.enter;
    targetPos.current.set(...shot.position);
    targetLookAt.current.set(...shot.target);

    // Rack focus shift on hover
    if (railNode === 'terrace') {
      if (hovered === 'laptop') {
        targetPos.current.add(new THREE.Vector3(0, -0.15, -0.45));
        targetLookAt.current.set(0, 0.98, -0.05);
      } else if (hovered === 'coffee') {
        targetLookAt.current.set(0.35, 0.95, 0.25);
      } else if (hovered === 'map') {
        targetLookAt.current.set(-0.35, 0.92, 0.35);
      }
    } else if (railNode === 'workshop') {
      if (hovered === 'project-observatory') {
        targetPos.current.set(0, 1.08, 1.45);
        targetLookAt.current.set(0.12, 1.02, 0);
      }
    }

    // Breathing float: amplitude 2cm, halved in Rest stage >= 1
    let breathAmp = 0.02;
    if (restStage >= 1) breathAmp = 0.01;
    if (reducedMotion) breathAmp = 0.0;

    const breathOffset = Math.sin(state.clock.elapsedTime * 1.2) * breathAmp;

    // Smooth camera motion
    const desiredX = targetPos.current.x + pointerOffset.current.x;
    const desiredY = targetPos.current.y + pointerOffset.current.y + breathOffset;
    const desiredZ = targetPos.current.z;

    const dampFactor = Math.min(delta * 2.8, 1);
    currentPos.current.lerp(new THREE.Vector3(desiredX, desiredY, desiredZ), dampFactor);
    currentLookAt.current.lerp(targetLookAt.current, dampFactor);

    camera.position.copy(currentPos.current);
    camera.lookAt(currentLookAt.current);
  });

  return null;
}
