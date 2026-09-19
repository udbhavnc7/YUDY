export type Project = {
  id: string;
  name: string;
  oneLine: string;
  building: string;
  role: string;
  stack: string[];
  year: number;
  links: { label: string; href: string }[];
  caseStudy: string;
  featured: boolean;
};

export const PROJECTS: Project[] = [
  {
    id: 'yudy-engine',
    name: 'YUDY Spatial Engine',
    oneLine: 'A continuous-take authored rail and procedural atmosphere in WebGL.',
    building: 'The Cantilevered Observatory',
    role: 'Architecture, shader pipelines, spatial rail system',
    stack: ['TypeScript', 'Three.js', 'R3F', 'GLSL', 'Vite'],
    year: 2026,
    links: [
      { label: 'Source', href: 'https://github.com/udbhav-nc/yudy' },
    ],
    caseStudy: `### The Problem\nTraditional 3D portfolios use free-roam cameras or disjointed modal hops. Both destroy cinematic pacing and incur heavy memory leaks on mobile.\n\n### The Architectural Move\nYUDY replaces free orbit with an authored forward spline. By locking the camera sequence, memory allocation drops to exactly one active room at any instant.`,
    featured: true,
  },
];
