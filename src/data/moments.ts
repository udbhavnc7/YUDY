export type MomentId = string;
export type MomentStatus = 'painted' | 'sketch';

export type Verb =
  | 'build' | 'rise' | 'sit' | 'listen'
  | 'send' | 'read' | 'lie-back' | 'take-the-odd-road';

export type Shot = {
  position: [number, number, number];
  target: [number, number, number];
  fov: number;
  duration: number;            // seconds
  easing?: string;             // gsap easing string
};

export type DoorStyle =
  | 'london-panel' | 'kochi-shutter'
  | 'rajasthani-arch' | 'hampi-lintel';

export type Moment = {
  id: MomentId;
  title: string;
  status: MomentStatus;
  verb: Verb;
  portalObject: string;
  signatureLight: string;
  interiorPalette: string[];
  doorStyle?: DoorStyle;
  opensOn?: string;
  private?: boolean;
};

export const MOMENTS: Record<string, Moment> = {
  terrace: {
    id: 'terrace',
    title: 'Terrace at Dusk',
    status: 'painted',
    verb: 'sit',
    portalObject: 'table',
    signatureLight: 'Golden hour backlit rain over wet zinc rooftops',
    interiorPalette: ['#16233A', '#FBF6EC'],
  },
  workshop: {
    id: 'workshop',
    title: 'The Workshop',
    status: 'painted',
    verb: 'build',
    portalObject: 'laptop',
    signatureLight: 'Warm incandescent table lamp in quiet darkness',
    interiorPalette: ['#C9424B', '#E3B25C'],
  },
};
