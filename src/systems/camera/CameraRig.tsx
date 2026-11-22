import { useLayoutEffect, useMemo, useRef, type MutableRefObject } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { MathUtils, PerspectiveCamera, Vector3 } from 'three';
import { LAMP_POSITION, LAMP_SCALE, PILLOW_ANCHORS } from '../../components/room/layout';
import { POSTER_WIDTH, POSTER_HEIGHT, posterPosition } from '../../components/room/galleryLayout';
import { ACHIEVEMENTS } from '../../data/achievements';
import { roomPath, zoneIndex, zones } from './roomPath';
import { chairAngle } from './chairTurn';

export type RoomView = { chairYaw: number };
type Props = {
  isolated: boolean;
  view: MutableRefObject<RoomView>;
  onIntroChange: (intro: boolean) => void;
  onEducationChange: (education: boolean) => void;
  onGalleryChange: (gallery: boolean) => void;
};

export function CameraRig({ isolated, view, onIntroChange, onEducationChange, onGalleryChange }: Props) {
  const { size, gl, invalidate } = useThree();
  const aspect = size.width / size.height;
  const path = useMemo(() => roomPath(aspect, isolated), [aspect, isolated]);
  const requested = useRef(0), current = useRef(0);
  const inIntro = useRef(true);
  const inEducation = useRef(false);
  const inGallery = useRef(false);
  const look = useMemo(() => new Vector3(), []);
  const anchor = useMemo(() => new Vector3(), []);
  const posterCenters = useMemo(() => ACHIEVEMENTS.map((_, index) => posterPosition(index)), []);
  const lamp = useMemo(() => new Vector3(...LAMP_POSITION), []);
  const motion = useMemo(() => matchMedia('(prefers-reduced-motion: reduce)'), []);
  useLayoutEffect(() => {
    const readScroll = () => {
      const total = document.documentElement.scrollHeight - window.innerHeight;
      requested.current = isolated || total <= 0 ? 0 : MathUtils.clamp(window.scrollY / total, 0, 1);
      invalidate();
    };
    readScroll();
    current.current = requested.current;
    window.addEventListener('scroll', readScroll, { passive: true });
    window.addEventListener('resize', readScroll);
    motion.addEventListener('change', readScroll);
    return () => {
      window.removeEventListener('scroll', readScroll);
      window.removeEventListener('resize', readScroll);
      motion.removeEventListener('change', readScroll);
    };
  }, [isolated, invalidate, motion]);

  useFrame(({ camera }, delta) => {
    const lens = camera as PerspectiveCamera;
    const dest = requested.current;
    current.current = motion.matches || Math.abs(current.current - dest) < 0.00015 ? dest :
      MathUtils.damp(current.current, dest, 9, Math.min(delta, 0.1));
    const p = current.current;
    view.current.chairYaw = chairAngle(p, motion.matches);
    const fov = path(p, motion.matches, lens.position, look);
    if (lens.fov !== fov) { lens.fov = fov; lens.updateProjectionMatrix(); }
    lens.lookAt(look);
    lens.updateMatrixWorld();
    const host = gl.domElement.closest<HTMLElement>('.exhibit');
    const intro = isolated || p < (motion.matches ? 0.10 : 0.077);
    const zone = zones[zoneIndex(p)][0];
    const education = !isolated && zone === 'Sofa';
    const gallery = !isolated && zone === 'Poster wall';
    if (gallery !== inGallery.current) {
      inGallery.current = gallery;
      onGalleryChange(gallery);
    }
    if (education !== inEducation.current) {
      inEducation.current = education;
      onEducationChange(education);
    }
    if (intro !== inIntro.current) { inIntro.current = intro; onIntroChange(intro); }
    if (intro) {
      if (aspect < 1.14) anchor.set(-0.82, 0, 0.2);
      else anchor.set(isolated ? -1.3 : -1.05, 1.02, 0);
      if (!isolated) anchor.multiplyScalar(LAMP_SCALE).add(lamp);
      anchor.project(lens);
      const headingOpacity = isolated || motion.matches ? 1 : 1 - MathUtils.smoothstep(p, 0.023, 0.077);
      host?.style.setProperty('--intro-opacity', String(headingOpacity));
      host?.style.setProperty('--label-x', (1 + anchor.x) * 50 + '%');
      host?.style.setProperty('--label-y', (1 - anchor.y) * 50 + '%');
    }
    if (education && host) {
      for (const pillow of PILLOW_ANCHORS) {
        anchor.set(pillow.x, pillow.y, pillow.z).project(lens);
        host.style.setProperty('--' + pillow.key + '-x', (1 + anchor.x) * 50 + '%');
        host.style.setProperty('--' + pillow.key + '-y', (1 - anchor.y) * 50 + '%');
      }
    }
    if (gallery && host) {
      posterCenters.forEach(([x, y, z], index) => {
        const leftTop = anchor.set(x - POSTER_WIDTH / 2, y + POSTER_HEIGHT / 2, z).project(lens);
        const left = (1 + leftTop.x) * 50;
        const top = (1 - leftTop.y) * 50;
        const rightBottom = anchor.set(x + POSTER_WIDTH / 2, y - POSTER_HEIGHT / 2, z).project(lens);
        const right = (1 + rightBottom.x) * 50;
        const bottom = (1 - rightBottom.y) * 50;
        const visible = left >= 0 && right <= 100 && top >= 0 && bottom <= 100;
        const prefix = '--poster-' + index;
        host.style.setProperty(prefix + '-left', left + '%');
        host.style.setProperty(prefix + '-top', top + '%');
        host.style.setProperty(prefix + '-width', (right - left) + '%');
        host.style.setProperty(prefix + '-height', (bottom - top) + '%');
        host.style.setProperty(prefix + '-visibility', visible ? 'visible' : 'hidden');
      });
    }
    if (p !== dest) invalidate();
  }, -1);
  return null;
}
