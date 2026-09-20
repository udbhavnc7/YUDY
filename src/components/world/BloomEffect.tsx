import { useEffect, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { RGBELoader } from 'three-stdlib';
import { EffectComposer } from 'three-stdlib';
import { RenderPass } from 'three-stdlib';
import { UnrealBloomPass } from 'three-stdlib';
import { ShaderPass } from 'three-stdlib';
import { GammaCorrectionShader } from 'three-stdlib';

export function BloomEffect() {
  const { gl, scene, camera } = useThree();
  const composerRef = useRef<EffectComposer | null>(null);
  const bloomPassRef = useRef<UnrealBloomPass | null>(null);

  useEffect(() => {
    const w = window.innerWidth;
    const h = window.innerHeight;

    const composer = new EffectComposer(gl);
    composer.setSize(w, h);
    const renderPass = new RenderPass(scene, camera);
    composer.addPass(renderPass);

    const bloomPass = new UnrealBloomPass(
      new THREE.Vector2(w, h),
      1.0,
      0.4,
      0.85
    );
    composer.addPass(bloomPass);

    const gammaPass = new ShaderPass(GammaCorrectionShader);
    composer.addPass(gammaPass);

    bloomPassRef.current = bloomPass;
    composerRef.current = composer;

    const loader = new RGBELoader();
    loader.load('/hdr/venice_sunset_1k.hdr', (texture) => {
      texture.mapping = THREE.EquirectangularReflectionMapping;
      texture.colorSpace = THREE.SRGBColorSpace;
      scene.environment = texture;
      scene.environmentIntensity = 0.6;
    }, undefined, (err) => {
      console.error('HDRI load failed:', err);
    });

    const onResize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      composer.setSize(w, h);
      const cam = camera as THREE.PerspectiveCamera;
      cam.aspect = w / h;
      cam.updateProjectionMatrix();
    };
    window.addEventListener('resize', onResize);

    return () => {
      window.removeEventListener('resize', onResize);
      composer.dispose();
    };
  }, []);

  useFrame(() => {
    if (!composerRef.current) return;

    if (bloomPassRef.current) {
      const lampPos = new THREE.Vector3(0, 1.52, 0);
      const dist = camera.position.distanceTo(lampPos);
      const strength = Math.max(0, Math.min(1.5 - dist * 0.15, 2.5));
      bloomPassRef.current.strength = strength;
    }

    composerRef.current.render();
  }, 1);

  return null;
}
