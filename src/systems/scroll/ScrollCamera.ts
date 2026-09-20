export type Waypoint = {
  id: string;
  position: [number, number, number];
  target: [number, number, number];
  fov?: number;
  easing?: string;
};

export type Zone = {
  id: string;
  range: [number, number];
  waypoints: Waypoint[];
};

export const ZONES: Zone[] = [
  {
    id: 'lamp-intro',
    range: [0.00, 0.10],
    waypoints: [
      {
        id: 'lamp-approach',
        position: [0, 1.2, 2.8],
        target: [0, 1.0, 0],
        fov: 35,
        easing: 'power2.out',
      },
      {
        id: 'lamp-close',
        position: [0, 1.1, 1.6],
        target: [0, 0.95, 0],
        fov: 28,
        easing: 'power1.inOut',
      },
    ],
  },
  {
    id: 'chair-identity',
    range: [0.10, 0.22],
    waypoints: [
      {
        id: 'chair-reveal',
        position: [1.2, 1.0, 1.8],
        target: [0.8, 0.7, 0],
        fov: 35,
        easing: 'power2.out',
      },
      {
        id: 'chair-twirl-end',
        position: [1.5, 0.9, 0.5],
        target: [0.5, 0.6, -0.5],
        fov: 32,
        easing: 'power1.inOut',
      },
    ],
  },
  {
    id: 'sofa-education',
    range: [0.22, 0.32],
    waypoints: [
      {
        id: 'sofa-approach',
        position: [0.5, 0.9, -0.8],
        target: [0, 0.6, -1.2],
        fov: 38,
        easing: 'power2.out',
      },
      {
        id: 'sofa-pillows',
        position: [0, 0.85, -1.0],
        target: [0, 0.55, -1.5],
        fov: 35,
        easing: 'power1.inOut',
      },
    ],
  },
  {
    id: 'posters-achievements',
    range: [0.32, 0.47],
    waypoints: [
      {
        id: 'posters-wide',
        position: [-1.8, 1.2, -1.5],
        target: [-0.5, 1.0, -2.0],
        fov: 45,
        easing: 'power2.out',
      },
      {
        id: 'posters-center',
        position: [0, 1.3, -1.2],
        target: [0, 1.0, -2.5],
        fov: 40,
        easing: 'power1.inOut',
      },
    ],
  },
  {
    id: 'solo-books',
    range: [0.47, 0.62],
    waypoints: [
      {
        id: 'solo-approach',
        position: [-2.0, 1.1, 0.5],
        target: [-1.2, 0.9, 0],
        fov: 38,
        easing: 'power2.out',
      },
      {
        id: 'solo-browse',
        position: [-1.5, 1.0, 0.2],
        target: [-0.8, 0.85, -0.3],
        fov: 35,
        easing: 'power1.inOut',
      },
    ],
  },
  {
    id: 'group-books',
    range: [0.62, 0.74],
    waypoints: [
      {
        id: 'group-approach',
        position: [-0.5, 1.0, 1.2],
        target: [0.2, 0.9, 0.8],
        fov: 38,
        easing: 'power2.out',
      },
      {
        id: 'group-browse',
        position: [0.5, 0.95, 0.8],
        target: [1.0, 0.8, 0.3],
        fov: 35,
        easing: 'power1.inOut',
      },
    ],
  },
  {
    id: 'plants-showcase',
    range: [0.74, 0.87],
    waypoints: [
      {
        id: 'plants-approach',
        position: [1.8, 1.0, -0.5],
        target: [1.2, 0.7, -1.0],
        fov: 40,
        easing: 'power2.out',
      },
      {
        id: 'showcase-items',
        position: [1.5, 0.9, -1.2],
        target: [0.8, 0.6, -1.5],
        fov: 38,
        easing: 'power1.inOut',
      },
    ],
  },
  {
    id: 'final-reveal',
    range: [0.87, 1.00],
    waypoints: [
      {
        id: 'reveal-pullback',
        position: [0, 2.2, 3.5],
        target: [0, 0.8, -0.5],
        fov: 50,
        easing: 'power2.out',
      },
      {
        id: 'reveal-wide',
        position: [0, 2.5, 4.5],
        target: [0, 0.7, -1.0],
        fov: 55,
        easing: 'power1.inOut',
      },
    ],
  },
];

export function getZoneAtProgress(progress: number): Zone | null {
  for (const zone of ZONES) {
    if (progress >= zone.range[0] && progress < zone.range[1]) {
      return zone;
    }
  }
  return ZONES[ZONES.length - 1];
}

export function interpolateWaypoints(zone: Zone, localProgress: number): Waypoint {
  const { waypoints } = zone;
  if (waypoints.length === 1) return waypoints[0];
  if (localProgress <= 0) return waypoints[0];
  if (localProgress >= 1) return waypoints[waypoints.length - 1];

  const segmentCount = waypoints.length - 1;
  const segmentProgress = localProgress * segmentCount;
  const segmentIndex = Math.floor(segmentProgress);
  const t = segmentProgress - segmentIndex;

  const wp1 = waypoints[segmentIndex];
  const wp2 = waypoints[Math.min(segmentIndex + 1, waypoints.length - 1)];

  return {
    id: `${wp1.id}-to-${wp2.id}`,
    position: [
      wp1.position[0] + (wp2.position[0] - wp1.position[0]) * t,
      wp1.position[1] + (wp2.position[1] - wp1.position[1]) * t,
      wp1.position[2] + (wp2.position[2] - wp1.position[2]) * t,
    ] as [number, number, number],
    target: [
      wp1.target[0] + (wp2.target[0] - wp1.target[0]) * t,
      wp1.target[1] + (wp2.target[1] - wp1.target[1]) * t,
      wp1.target[2] + (wp2.target[2] - wp1.target[2]) * t,
    ] as [number, number, number],
    fov: (wp1.fov || 45) + ((wp2.fov || 45) - (wp1.fov || 45)) * t,
    easing: wp1.easing,
  };
}