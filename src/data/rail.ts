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
      position: [0, 2.2, 3.8],
      target: [0, 1.1, 0],
      fov: 42,
      duration: 2.4,
      easing: 'power2.out',
    },
    rest: {
      position: [0, 1.8, 3.2],
      target: [0, 1.0, 0],
      fov: 40,
      duration: 3.0,
      easing: 'power1.inOut',
    },
    exit: {
      position: [0, 1.25, 1.1],
      target: [-0.15, 0.96, 0.2],
      fov: 34,
      duration: 1.8,
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
      position: [0, 1.2, 2.0],
      target: [0, 0.9, 0],
      fov: 45,
      duration: 2.0,
      easing: 'power2.out',
    },
    rest: {
      position: [0, 1.1, 1.8],
      target: [0, 0.85, 0],
      fov: 45,
      duration: 2.5,
      easing: 'power1.inOut',
    },
    exit: {
      position: [0, 1.5, -2.0],
      target: [0, 1.0, -5.0],
      fov: 45,
      duration: 2.0,
      easing: 'power2.in',
    },
    next: ['terrace'],
    preloadAhead: ['terrace'],
    disposeBehind: ['terrace'],
  },
};
