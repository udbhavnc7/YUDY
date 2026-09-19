import { MomentId, Shot } from './moments';

export type RailNode = {
  id: string;
  momentId: MomentId | null;
  enter: Shot;
  rest: Shot;
  exit: Shot;
  next: string[];
  preloadAhead: string[];
  disposeBehind: string[];
};

export const RAIL_NODES: Record<string, RailNode> = {
  terrace: {
    id: 'terrace',
    momentId: 'terrace',
    enter: {
      position: [0, 1.6, 2.8],
      target: [0, 1.35, -5.0],
      fov: 45,
      duration: 2.2,
      easing: 'power2.out',
    },
    rest: {
      position: [0, 1.42, 2.2],
      target: [0, 1.32, -5.0],
      fov: 44,
      duration: 2.5,
      easing: 'power1.inOut',
    },
    exit: {
      position: [0.15, 1.05, 0.62],
      target: [0.15, 1.05, 0.1],
      fov: 40,
      duration: 1.6,
      easing: 'power2.in',
    },
    next: ['workshop'],
    preloadAhead: ['workshop'],
    disposeBehind: [],
  },
  workshop: {
    id: 'workshop',
    momentId: 'workshop',
    enter: {
      position: [0, 1.25, 2.1],
      target: [0, 0.95, 0],
      fov: 45,
      duration: 2.0,
      easing: 'power2.out',
    },
    rest: {
      position: [0, 1.15, 1.75],
      target: [0, 0.9, 0],
      fov: 44,
      duration: 2.5,
      easing: 'power1.inOut',
    },
    exit: {
      position: [0, 1.3, -2.5],
      target: [0, 1.1, -6.0],
      fov: 44,
      duration: 2.0,
      easing: 'power2.in',
    },
    next: ['terrace'],
    preloadAhead: ['terrace'],
    disposeBehind: ['terrace'],
  },
};
