import { useLayoutEffect, useMemo, useRef, type MutableRefObject } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { MathUtils, PerspectiveCamera, Vector3 } from 'three';
import { LAMP_POSITION, LAMP_SCALE, PILLOW_ANCHORS } from '../../components/room/layout';
import { POSTER_WIDTH, POSTER_HEIGHT, posterPosition } from '../../components/room/galleryLayout';
import { BOOK_FRONT, PROJECT_SHELVES } from '../../components/room/projectShelves';
import { SHOWCASE_FACING, SHOWCASE_ITEMS } from '../../components/room/showcaseLayout';
import type { ProjectType } from '../../data/projects';
import { projectTarget } from './projectTarget';
import { ACHIEVEMENTS } from '../../data/achievements';
import { roomPath, zoneIndex, zones } from './roomPath';
import { chairAngle } from './chairTurn';
import { REVEAL_ASSETS, ROOM_ASSET, roomAssets } from '../../scenes/MainRoom/roomAssets';

export type RoomView = { chairYaw: number; readyAssets: number };
export type ClosingState = 'loading' | 'ready' | undefined;
type Props = {
  isolated: boolean;
  mobile: boolean;
  view: MutableRefObject<RoomView>;
  onAssetsChange: (assets: number) => void;
  onIntroChange: (intro: boolean) => void;
  onEducationChange: (education: boolean) => void;
  onGalleryChange: (gallery: boolean) => void;
  onShelfChange: (shelf: ProjectType | undefined) => void;
  onShowcaseChange: (showcase: boolean) => void;
  onClosingChange: (closing: ClosingState) => void;
};

export function CameraRig({ isolated, mobile, view, onAssetsChange, onIntroChange, onEducationChange,
  onGalleryChange, onShelfChange, onShowcaseChange, onClosingChange }: Props) {
  const { size, gl, invalidate } = useThree();
  const aspect = size.width / size.height;
  const path = useMemo(() => roomPath(aspect, isolated, mobile), [aspect, isolated, mobile]);
  const requested = useRef(0), current = useRef(0);
  const inIntro = useRef(true);
  const inEducation = useRef(false);
  const inGallery = useRef(false);
  const inShowcase = useRef(false);
  const inClosing = useRef<ClosingState>();
  const currentShelf = useRef<ProjectType>();
  const currentAssets = useRef(0);
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
    const assets = isolated ? 0 : roomAssets(p, dest);
    if (assets !== currentAssets.current) {
      currentAssets.current = assets;
      onAssetsChange(assets);
    }
    view.current.chairYaw = chairAngle(p, motion.matches);
    const fov = path(p, motion.matches, lens.position, look);
    if (lens.fov !== fov) { lens.fov = fov; lens.updateProjectionMatrix(); }
    lens.lookAt(look);
    lens.updateMatrixWorld();
    const host = gl.domElement.closest<HTMLElement>('.exhibit');
    const intro = isolated || p < (motion.matches ? 0.10 : 0.077);
    const zone = zones[zoneIndex(p)][0];
    const ready = view.current.readyAssets;
    const education = zone === 'Sofa' && !!(ready & ROOM_ASSET.sofa);
    const gallery = zone === 'Poster wall' && !!(ready & ROOM_ASSET.posters);
    const showcase = zone === 'Showcase' && !!(ready & ROOM_ASSET.showcase);
    const atReveal = !isolated && zone === 'Room' && (motion.matches || p >= 0.956);
    const closing = atReveal ? ((ready & REVEAL_ASSETS) === REVEAL_ASSETS ? 'ready' : 'loading') : undefined;
    const shelf = ready & ROOM_ASSET.books ? (zone === 'Solo shelf' ? 'solo' : zone === 'Group shelf' ? 'group' : undefined) : undefined;
    if (shelf !== currentShelf.current) {
      currentShelf.current = shelf;
      onShelfChange(shelf);
    }
    if (gallery !== inGallery.current) {
      inGallery.current = gallery;
      onGalleryChange(gallery);
    }
    if (education !== inEducation.current) {
      inEducation.current = education;
      onEducationChange(education);
    }
    if (showcase !== inShowcase.current) {
      inShowcase.current = showcase;
      onShowcaseChange(showcase);
    }
    if (closing !== inClosing.current) {
      inClosing.current = closing;
      onClosingChange(closing);
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
      posterCenters.forEach(([x, y, z], index) =>
        projectTarget(host, '--poster-' + index, lens, anchor, x, y, z, POSTER_WIDTH, POSTER_HEIGHT));
    }
    if (shelf && host) {
      PROJECT_SHELVES[shelf].forEach((book, index) => projectTarget(host, '--book-' + index, lens, anchor,
        book.x, book.floor + book.height / 2, BOOK_FRONT, book.faceOut ? book.depth : book.thickness, book.height));
    }
    if (showcase && host) {
      SHOWCASE_ITEMS.forEach(({ anchor: item }, index) =>
        projectTarget(host, '--hobby-' + index, lens, anchor, ...item, SHOWCASE_FACING));
    }
    if (p !== dest) invalidate();
  }, -1);
  return null;
}
