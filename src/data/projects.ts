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
    role: 'Lead Architect — Shader pipelines, camera rig, spatial rail streaming',
    stack: ['TypeScript', 'Three.js', 'React Three Fiber', 'GLSL', 'Vite', 'GSAP'],
    year: 2026,
    links: [
      { label: 'Architecture', href: '#architecture' },
    ],
    caseStudy: `### The Problem
Traditional 3D portfolios use free orbit cameras or disjointed modal hops. Both destroy cinematic pacing and incur severe GPU memory leaks on mobile devices.

### The Architectural Move
YUDY replaces free orbit with an authored forward spline. By enforcing a strict one-way rail, GPU memory allocation drops to exactly one active room at any instant. Assets preload ahead and dispose behind.

### Visual & Technical Integrity
- Continuous Paris time sky lighting curve
- Instanced GPU rain particles backlit by directional key
- Inverted idle system: the Rest rewards stillness instead of degrading`,
    featured: true,
  },
  {
    id: 'kochi-monsoons',
    name: 'Kochi Monsoon Alley',
    oneLine: 'Procedural rain simulation and binaural soundscapes across historic coastal architecture.',
    building: 'The Water Pavilion',
    role: 'Creative Technologist — Audio DSP, fluid surface shaders',
    stack: ['WebGL', 'Web Audio API', 'Three.js', 'HLSL / GLSL'],
    year: 2025,
    links: [
      { label: 'Soundscapes', href: '#sound' },
    ],
    caseStudy: `### The Problem
Rain in web experiences is almost universally rendered as flat 2D sprite overlays or repetitive recorded MP3 loops that cause listener fatigue within thirty seconds.

### The Solution
Built a purely synthesized procedural rain engine using filtered pink noise nodes in the Web Audio API coupled with an instanced GPU streak renderer. Droplet density and pitch adjust dynamically with camera orientation.`,
    featured: true,
  },
  {
    id: 'cantilevered-sim',
    name: 'Parametric Cantilever Simulator',
    oneLine: 'Real-time structural stress visualization and finite-element load calculation in the browser.',
    building: 'The Tension Spire',
    role: 'Systems Engineer — WebGPU compute shaders, parametric geometry',
    stack: ['WebGPU', 'TypeScript', 'WGSL', 'Three.js'],
    year: 2025,
    links: [
      { label: 'Simulation', href: '#sim' },
    ],
    caseStudy: `### The Problem
Visualizing structural load transfers in architectural concepts requires heavy desktop CAD software inaccessible to clients and reviewers on the web.

### The Solution
Engineered a WebGPU compute shader pipeline calculating load deflection in real-time at 60 fps, coloring high-stress points in deep cherry and equilibrium zones in slate navy.`,
    featured: false,
  },
  {
    id: 'vellum-ink',
    name: 'Vellum & Ink Shader Pipeline',
    oneLine: 'Non-photorealistic architectural hatching and paper-grain post-processing.',
    building: 'The Lithograph Hall',
    role: 'Graphics Engineer — Post-processing passes, toon ramps',
    stack: ['Three.js', 'Custom GLSL Shaders', 'PostProcessing'],
    year: 2024,
    links: [
      { label: 'Shader Pass', href: '#shaders' },
    ],
    caseStudy: `### The Problem
Standard PBR rendering produces clinical, plastic surfaces that lack the tactile warmth of physical architectural models and hand-drawn blueprint sketches.

### The Solution
Crafted a multi-pass screen-space hatch shader that reads surface normals and luminance to cross-hatch in authentic drawing ink over a procedural cotton-rag paper grain texture.`,
    featured: false,
  },
];
