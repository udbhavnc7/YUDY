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
  award?: string;
};

export const PROJECTS: Project[] = [
  {
    id: 'kawach',
    name: 'KAWACH — Disaster Emergency Mesh',
    oneLine: 'Offline-first emergency response system over phone-to-phone BLE mesh networking with Gemini AI triage.',
    building: 'The Resilient Citadel',
    role: 'Full Stack & Systems Developer — BLE mesh relay, geospatial clustering, Gemini AI summarization',
    stack: ['BLE Mesh', 'Python', 'Geospatial Analytics', 'Google Gemini AI', 'Cloud Sync'],
    year: 2026,
    award: 'Best Startup Award — AAKRITHI / AETHERION',
    links: [
      { label: 'GitHub', href: 'https://github.com/udbhavnc7/kawach' },
      { label: 'New Version', href: 'https://github.com/sharonjoseph12/Kawach_new' },
    ],
    caseStudy: `### The Problem
During catastrophic natural disasters, cellular towers and power grids collapse within minutes. Stranded victims cannot dispatch SOS distress signals, and first responders operate blind without location telemetry or triage data.

### The Architectural Move
Engineered an offline-first decentralized relay network over Bluetooth Low Energy (BLE). Distress packets hop peer-to-peer across phones in the disaster zone until encountering any device with connectivity. 

### Core Systems
- Automated multi-hop packet propagation with packet deduplication and TTL bounding
- Geospatial clustering algorithms mapping SOS clusters to optimal dispatch coordinates
- Gemini AI context summarizer generating structured medical triage summaries for rescue teams
- Real-time safety heatmaps and lock-screen SOS triggers (power button tap / phone shake)`,
    featured: true,
  },
  {
    id: 'vortex',
    name: 'VORTEX — Algorand Smart Contract Escrow',
    oneLine: 'Decentralized freelancing escrow with automated Docker sandbox verification and AI jury auditing.',
    building: 'The Cryptographic Vault',
    role: 'Smart Contract & Systems Developer — Algorand ARC-4 contract logic, Docker verification node',
    stack: ['Algorand', 'Python / PyTeal', 'Smart Contracts', 'Docker', 'Oracle Consensus'],
    year: 2025,
    award: 'Winners ($350 Cash Prize) — REVA RIFT HACK.ALGO',
    links: [
      { label: 'GitHub', href: 'https://github.com/sharonjoseph12/vortex_reva' },
    ],
    caseStudy: `### The Problem
Traditional freelancing and peer-to-peer bounty platforms extract heavy 20% mediator fees while suffering from subjective dispute resolution and payment delays.

### The Architectural Move
VORTEX moves trust into transparent on-chain logic:
1. Buyer locks bounty funds into an immutable Algorand ARC-4 escrow smart contract.
2. Solver submits code artifacts executed inside ephemeral Docker sandboxes running automated unit tests.
3. A Gemini Flash AI jury audits code quality and compliance with adversarial prompt filtering.
4. Smart contract auto-releases payments upon verified cryptographic consensus without human gatekeepers.`,
    featured: true,
  },
  {
    id: 'nayana',
    name: 'NAYANA — Eye-Gaze Communication Platform',
    oneLine: 'Gaze-tracking AI communication tool translating eye movements into live speech and caregiver telemetry.',
    building: 'The Optical Sanctuary',
    role: 'Computer Vision & Full Stack Developer — Real-time eye gaze estimation, WebRTC telemetry dashboard',
    stack: ['Computer Vision', 'Gaze Tracking AI', 'WebRTC', 'React', 'Next.js', 'Vercel'],
    year: 2025,
    links: [
      { label: 'Live App', href: 'https://nayana-nine.vercel.app' },
    ],
    caseStudy: `### The Problem
Patients suffering from ALS, locked-in syndrome, or severe motor impairments lose the ability to speak or gesture, while proprietary eye-tracking hardware costs upwards of $10,000.

### The Architectural Move
Built an accessible, web-native gaze-tracking interface that operates on any standard webcam:
- Deep convolutional facial landmark tracking estimating pupil gaze vector in real-time
- Intuitive dwell-selection communication keyboard translating gaze fixations into synthesized speech
- Real-time low-latency WebRTC data channel streaming patient status and telemetry to a remote caregiver dashboard`,
    featured: true,
  },
  {
    id: 'medaether',
    name: 'MedÆther — Hospital Coordination Intelligence',
    oneLine: 'Resilient hospital emergency intelligence layer synchronizing ICU bed availability, transfer workflows, and blood banks.',
    building: 'The Lifeline Matrix',
    role: 'Systems Architect — Distributed data integration, legacy health system adapters, audit pipeline',
    stack: ['TypeScript', 'React', 'Node.js', 'PostgreSQL', 'Supabase', 'REST / FHIR'],
    year: 2025,
    links: [
      { label: 'GitHub', href: 'https://github.com/udbhavnc7/MedAether' },
    ],
    caseStudy: `### The Problem
Hospital systems across regional healthcare networks run siloed, decades-old software. Bed availability, emergency transfers, and rare blood requests are coordinated via frantic phone calls and paper logs.

### The Architectural Move
MedÆther deploys a zero-disruption integration layer that sits atop legacy infrastructure:
- Real-time predictive ICU and ventilator capacity modeling
- Automated multi-hospital patient transfer routing with medical audit trails
- Emergency blood request broadcasting with automated compatibility verification and cold-chain tracking`,
    featured: false,
  },
  {
    id: 'prism',
    name: 'PRISM — Contactless Health Screening AI',
    oneLine: '100% contactless preventative health screening in under 30s using smartphone camera & microphone for ASHA workers.',
    building: 'The Spectrum Diagnostic',
    role: 'Mobile & AI Developer — Photoplethysmography (rPPG), acoustic respiratory analysis',
    stack: ['Flutter', 'Python', 'Computer Vision', 'Acoustic Signal Processing', 'ABDM Standards'],
    year: 2025,
    award: 'Designed for rural India & Ayushman Bharat Digital Mission (ABDM)',
    links: [
      { label: 'GitHub', href: 'https://github.com/sharonjoseph12/Vaidya' },
    ],
    caseStudy: `### The Problem
Primary healthcare in rural India lacks expensive medical diagnostic equipment. Community ASHA workers need rapid, non-invasive tools to triage dozens of patients daily.

### The Architectural Move
PRISM requires zero external hardware:
- Remote photoplethysmography (rPPG) measuring heart rate and oxygenation through facial micro-capillary pulse waves
- Acoustic vocal and cough spectrogram analysis screening for early respiratory distress
- Screens 50+ villagers per day in under 30 seconds, exporting structured FHIR records directly to ABDM health accounts`,
    featured: false,
  },
  {
    id: 'tattva',
    name: 'TATTVA — Autonomous Exam Notes Intelligence',
    oneLine: 'Incremental syllabus compiler syncing Google Drive/Classroom into living exam notes with page traceability.',
    building: 'The Living Scriptorium',
    role: 'Full Stack Engineer — Document parsing pipeline, automated indexing, markdown generation',
    stack: ['Next.js', 'TypeScript', 'Google Drive API', 'PDF Processing', 'TailwindCSS'],
    year: 2025,
    links: [
      { label: 'GitHub', href: 'https://github.com/udbhavnc7/TATTVA' },
    ],
    caseStudy: `### The Problem
University coursework materials are scattered across dozens of unorganized Google Drive folders and Classroom announcements, making exam prep chaotic and disconnected.

### The Architectural Move
TATTVA watches course repositories and instantly processes newly uploaded lecture slides and reference books:
- Incremental text and diagram extraction with semantic topic hierarchy
- Generates clean, exam-structured revision guides where every formula and claim is directly clickable back to the exact source PDF page`,
    featured: false,
  },
];
