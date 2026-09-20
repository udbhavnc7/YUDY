import { useEffect, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useWorldStore } from '../../app/worldStore';
import { useScrollStore } from '../../systems/scroll/ScrollStore';
import { getCurrentWaypoint } from '../../systems/scroll/useScrollCamera';

export function CameraRig() {
  const { camera } = useThree();
  const scrollProgress = useScrollStore((s) => s.scrollProgress);
  const restStage = useWorldStore((s) => s.restStage);
  const reducedMotion = useWorldStore((s) => s.reducedMotion);
  const hovered = useWorldStore((s) => s.hovered);

  const currentPos = useRef(new THREE.Vector3());
  const currentLookAt = useRef(new THREE.Vector3());
  const targetPos = useRef(new THREE.Vector3());
  const targetLookAt = useRef(new THREE.Vector3());
  const pointerOffset = useRef({ x: 0, y: 0 });
  const tempVec = useRef(new THREE.Vector3());

  const chairRotation = useRef(0);

  const easeInOutSine = (x: number) => -(Math.cos(Math.PI * x) - 1) / 2;

  useEffect(() => {
    if (scrollProgress >= 0.10 && scrollProgress < 0.22) {
      const zoneProgress = (scrollProgress - 0.10) / (0.22 - 0.10);
      chairRotation.current = easeInOutSine(zoneProgress) * Math.PI * 2;
    } else if (scrollProgress >= 0.22) {
      chairRotation.current = easeInOutSine(1) * Math.PI * 2;
    } else {
      chairRotation.current = 0;
    }
  });

  useEffect(() => {
    const handlePointerMove = (e: PointerEvent) => {
      if (reducedMotion) {
        pointerOffset.current = { x: 0, y: 0 };
        return;
      }
      const nx = (e.clientX / window.innerWidth) * 2 - 1;
      const ny = -(e.clientY / window.innerHeight) * 2 + 1;
      pointerOffset.current = {
        x: nx * 0.08,
        y: ny * 0.05,
      };
    };

    window.addEventListener('pointermove', handlePointerMove);
    return () => window.removeEventListener('pointermove', handlePointerMove);
  }, [reducedMotion]);

  useEffect(() => {
    const waypoint = getCurrentWaypoint(0);
    if (waypoint) {
      camera.position.set(...waypoint.position);
      currentPos.current.set(...waypoint.position);
      currentLookAt.current.set(...waypoint.target);
      camera.lookAt(...waypoint.target);
      if (waypoint.fov) {
        (camera as THREE.PerspectiveCamera).fov = waypoint.fov;
        (camera as THREE.PerspectiveCamera).updateProjectionMatrix();
      }
    }
  }, []);

  useFrame((state, delta) => {
    const waypoint = getCurrentWaypoint(scrollProgress);
    if (!waypoint) return;

    targetPos.current.set(...waypoint.position);
    targetLookAt.current.set(...waypoint.target);

    if (waypoint.fov) {
      const cam = camera as THREE.PerspectiveCamera;
      cam.fov += (waypoint.fov - cam.fov) * Math.min(delta * 3, 1);
      cam.updateProjectionMatrix();
    }

    if (hovered) {
      const hoverOffsets: Record<string, { pos: THREE.Vector3; target: THREE.Vector3 }> = {
        lamp: { pos: new THREE.Vector3(0, 0.1, 0.3), target: new THREE.Vector3(0, 1.0, 0) },
      };
      const offset = hoverOffsets[hovered];
      if (offset) {
        targetPos.current.add(offset.pos);
        targetLookAt.current.copy(offset.target);
      }
    }

    if (scrollProgress >= 0.10 && scrollProgress < 0.22 && chairRotation.current > 0.01) {
      const chairPos = new THREE.Vector3(1.2, 0.5, 1.5);
      const chairDir = new THREE.Vector3(Math.sin(chairRotation.current), 0, -Math.cos(chairRotation.current));
      targetLookAt.current.copy(chairPos).add(chairDir.multiplyScalar(2));
    }

    let breathAmp = 0.015;
    if (restStage >= 1) breathAmp = 0.007;
    if (reducedMotion) breathAmp = 0;

    const breathOffset = Math.sin(state.clock.elapsedTime * 1.0) * breathAmp;

    const desiredX = targetPos.current.x + pointerOffset.current.x;
    const desiredY = targetPos.current.y + pointerOffset.current.y + breathOffset;
    const desiredZ = targetPos.current.z;

    const dampFactor = Math.min(delta * 2.5, 1);
    tempVec.current.set(desiredX, desiredY, desiredZ);
    currentPos.current.lerp(tempVec.current, dampFactor);
    currentLookAt.current.lerp(targetLookAt.current, dampFactor);

    camera.position.copy(currentPos.current);
    camera.lookAt(currentLookAt.current);
  });

  return null;
}