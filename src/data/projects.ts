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
  metrics?: { label: string; value: string }[];
};

export const PROJECTS: Project[] = [
  {
    id: 'kawach',
    name: 'KAWACH — Personal Safety & Emergency BLE Mesh',
    oneLine: 'Always-ready disaster & personal safety system blending real-time SOS, Google Gemini AI triage, and offline-first BLE mesh resilience.',
    building: 'The Resilient Citadel',
    role: 'Lead Architect & Mobile Engineer — Flutter app, BLE peer-to-peer relay, geospatial clustering, Gemini AI context triage',
    stack: ['Flutter', 'Dart', 'BLE Mesh', 'Python', 'Google Gemini AI', 'Geospatial Analytics'],
    year: 2026,
    award: 'Best Startup Award — AAKRITHI 2026 / AETHERION',
    metrics: [
      { label: 'DISPATCH OVERHEAD', value: '-41.8%' },
      { label: 'OFFLINE LATENCY', value: '< 14ms' },
      { label: 'RELAY HOPS', value: 'Multi-hop BLE' },
    ],
    links: [
      { label: 'GitHub Repository', href: 'https://github.com/udbhavnc7/KAWACH' },
      { label: 'Team Repo (Kawach New)', href: 'https://github.com/sharonjoseph12/Kawach_new' },
    ],
    caseStudy: `### The Problem
Traditional SOS applications fail when cellular towers collapse in natural disasters, remote dead zones, or crowded emergency situations. Victims require an immediate, lock-screen gesture trigger that broadcasts distress signals across peer devices with zero internet connectivity.

### The Architectural Move
KAWACH converts everyday consumer smartphones into an autonomous, distributed guardian mesh:
- **Discreet Lock-Screen Triggers**: Tri-tap power button sequence, high-G accelerometer shake gestures, and voice keyword activation from a sleeping lock screen.
- **Offline BLE Multi-Hop Relay**: Distress packets hop across neighboring Bluetooth Low Energy nodes until encountering an internet-connected gateway.
- **Geospatial Density Clustering**: Real-time k-d tree spatial partitioning matches victims to the nearest registered civilian volunteer or emergency response unit.
- **Google Gemini AI Triage**: Automated NLP contextual analysis parses audio distress streams to extract severity, medical preconditions, and structured dispatcher briefs.`,
    featured: true,
  },
  {
    id: 'vortex',
    name: 'VORTEX — Algorand Smart Contract Escrow Platform',
    oneLine: 'Decentralized peer-to-peer escrow system locking contract funds in Algorand ARC4 smart contracts with automated Docker sandboxed verification.',
    building: 'The Cryptographic Sanctuary',
    role: 'Smart Contract & Systems Engineer — Algorand ARC4 smart contract, Docker verification sandbox, oracle consensus',
    stack: ['Algorand', 'Python / PyTeal', 'Smart Contracts', 'Docker Sandbox', 'Oracle Consensus'],
    year: 2025,
    award: 'Winner ($350 Cash Prize) — REVA RIFT HACK.ALGO',
    metrics: [
      { label: 'PRIZE WON', value: '$350 USD' },
      { label: 'CONTRACT VERIFY', value: '100% On-Chain' },
      { label: 'ARBITRATION', value: 'Zero Middleman' },
    ],
    links: [
      { label: 'GitHub Repository', href: 'https://github.com/sharonjoseph12/vortex_reva' },
    ],
    caseStudy: `### The Problem
Traditional freelance and escrow platforms suffer from exorbitant platform fees (10–20%), centralized escrow bias, and slow dispute resolution.

### The Architectural Move
VORTEX moves escrow arbitration entirely onto deterministic, verifiable on-chain logic:
- **ARC4 Algorand Smart Contract**: Funds are locked cryptographically in an immutable Algorand escrow vault upon deal initiation.
- **Docker-Sandboxed Test Runner**: Automated test verification containers execute code submissions against buyer-defined test suites in isolated sandboxes.
- **Zero-Custody Automated Payout**: Instantaneous settlement and collateral distribution executed on-chain once verifiable criteria pass.`,
    featured: true,
  },
  {
    id: 'nayana',
    name: 'NAYANA — Eye-Gaze Clinical AI Platform',
    oneLine: 'High-fidelity gaze-tracking AI enabling patients with ALS and motor impairments to communicate through computer vision eye fixations.',
    building: 'The Optical Observatory',
    role: 'Computer Vision & Full Stack Developer — Gaze estimation algorithms, virtual communication keyboard, WebRTC telemetry stream',
    stack: ['Computer Vision', 'Gaze Tracking AI', 'WebRTC', 'React', 'Next.js', 'Vercel'],
    year: 2025,
    metrics: [
      { label: 'CALIBRATION TIME', value: '< 2.5s' },
      { label: 'STREAM LATENCY', value: 'sub-80ms WebRTC' },
      { label: 'HARDWARE COST', value: '$0 (Webcam)' },
    ],
    links: [
      { label: 'Live Application', href: 'https://nayana-nine.vercel.app' },
      { label: 'GitHub Repository', href: 'https://github.com/udbhavnc7/Nayana' },
    ],
    caseStudy: `### The Problem
Patients suffering from ALS, locked-in syndrome, or severe brain trauma lose voluntary motor control and speech. Commercial eye trackers cost upwards of $10,000, creating an insurmountable financial wall for public hospitals and families.

### The Architectural Move
NAYANA provides high-precision clinical gaze communication using ordinary smartphone or laptop webcams:
- **Fast Landmark Inference**: Real-time convolutional pupil landmark tracking estimating gaze fixations with zero expensive hardware.
- **Dwell-Time Word Matrix**: Dynamic virtual communication interface allowing patients to compose sentences, trigger alerts, and communicate symptoms.
- **WebRTC Clinician Telemetry**: Real-time telemetry channels streaming patient fixations, blink fatigue, and alerts to caregiver dashboards.`,
    featured: true,
  },
  {
    id: 'sanchay',
    name: 'Sanchay — Local-First Android Personal Finance Engine',
    oneLine: 'Open-source Android personal finance application with encrypted SQLite storage, custom budget categories, and offline privacy.',
    building: 'The Minted Ledger',
    role: 'Android Engineer — Kotlin architecture, Room SQLite database, custom budget tracking, visual analytics',
    stack: ['Kotlin', 'Android SDK', 'Jetpack Compose', 'Room DB', 'Material 3'],
    year: 2026,
    metrics: [
      { label: 'DATA PRIVACY', value: '100% Offline' },
      { label: 'QUERY SPEED', value: '< 4ms Room DB' },
      { label: 'TELEMETRY', value: '0 bytes sent' },
    ],
    links: [
      { label: 'GitHub Repository', href: 'https://github.com/udbhavnc7/Sanchay' },
    ],
    caseStudy: `### The Problem
Most personal finance applications require intrusive cloud subscriptions, upload sensitive banking statements to remote third-party servers, and clutter simple budgeting with bloated crypto integrations.

### The Architectural Move
Sanchay is architected on complete data sovereignty and local-first autonomy:
- **100% Offline Architecture**: Encrypted local SQLite storage via Android Jetpack Room DB.
- **Dynamic Multi-Account Ledger**: Flexible split-transaction tracking, scheduled recurring expenses, and custom hierarchical categories.
- **Predictive Spending Velocity**: Visual burn-down indicators and cash-flow trajectories computed entirely on-device.`,
    featured: true,
  },
  {
    id: 'medaether',
    name: 'MedÆther — Hospital Coordination Intelligence',
    oneLine: 'Hospital coordination intelligence layer transforming fragmented ICU bed telemetry, transfers, and blood inventory into a failure-resistant network.',
    building: 'The Lifeline Network',
    role: 'Systems Architect — Distributed data integration, legacy healthcare adapters, real-time emergency dispatch',
    stack: ['TypeScript', 'React', 'Node.js', 'PostgreSQL', 'Supabase', 'REST / FHIR'],
    year: 2025,
    metrics: [
      { label: 'BED DISPATCH TIME', value: '-65%' },
      { label: 'LEGACY COMPAT', value: 'FHIR / REST' },
      { label: 'AUDITABILITY', value: 'Cryptographic log' },
    ],
    links: [
      { label: 'GitHub Repository', href: 'https://github.com/udbhavnc7/MedAether' },
    ],
    caseStudy: `### The Problem
Inter-hospital transfers and critical care coordination rely on disconnected phone calls and manual spreadsheets, leading to tragic delays in locating ICU beds and compatible rare blood units.

### The Architectural Move
MedÆther sits atop legacy hospital information systems to form an automated coordination grid:
- **Universal Legacy Adapters**: Translates fragmented 30-year-old hospital database formats into structured FHIR-compliant payloads.
- **Predictive ICU Allocation**: Real-time capacity forecasting matches inbound transfer requests with available ventilator and specialist resources.
- **Immutable Transfer Audit Trails**: Secure audit logs trace patient routing decisions and emergency transport timelines.`,
    featured: true,
  },
  {
    id: 'lume',
    name: 'LUME — Land Acquisition Predictive Intelligence',
    oneLine: 'Predictive intelligence layer analyzing infrastructure project records to forecast land acquisition milestone delays with transparent evidence reasoning.',
    building: 'The Geospatial Observatory',
    role: 'Full Stack & Predictive Systems Developer — Delay risk forecasting, comparative project analytics, evidence audit UI',
    stack: ['TypeScript', 'React', 'Node.js', 'PostgreSQL', 'Predictive Modeling', 'Render'],
    year: 2026,
    metrics: [
      { label: 'DELAY FORECAST', value: '3-6 Mo Horizon' },
      { label: 'EVIDENCE AUDIT', value: 'Parcel-level' },
    ],
    links: [
      { label: 'Live Platform', href: 'https://lume-1ubt.onrender.com/' },
      { label: 'GitHub Repository', href: 'https://github.com/udbhavnc7/LUME' },
    ],
    caseStudy: `### The Problem
Government infrastructure projects routinely experience months or years of unforeseen delays due to opaque land acquisition title hurdles, administrative backlogs, and contested compensation.

### The Architectural Move
LUME is an proactive foresight platform transforming static project registries into actionable intelligence:
- **Milestone Delay Forecasting**: Statistical risk engine computing delay probabilities across survey, title clearance, and award milestones.
- **Transparent Evidence Reasoning**: Every risk score links back to specific historical parcel disputes, administrative bottlenecks, and regulatory friction.
- **Comparative Project Benchmarking**: Matches active infrastructure projects with comparable historical corridors to project velocity.`,
    featured: true,
  },
  {
    id: 'tattva',
    name: 'TATTVA — Automated Exam Syllabus Intelligence',
    oneLine: 'Living notes and syllabus platform continuously synchronizing with Google Classroom & Drive, parsing PDFs into structured, exam-ready notes.',
    building: 'The Living Archive',
    role: 'Full Stack Engineer — Automated ingestion pipeline, document parsing, structured notes site',
    stack: ['TypeScript', 'React', 'Python', 'Google Drive API', 'PDF Extraction', 'Markdown'],
    year: 2025,
    metrics: [
      { label: 'SYNC LATENCY', value: 'Real-time webhook' },
      { label: 'TRACEABILITY', value: '100% Page-verified' },
    ],
    links: [
      { label: 'GitHub Repository', href: 'https://github.com/udbhavnc7/TATTVA' },
    ],
    caseStudy: `### The Problem
Course materials, lecture slides, and curriculum updates are scattered across disparate Google Drive folders and Classroom streams, leaving students with fragmented study material before exams.

### The Architectural Move
TATTVA continuously monitors university class streams and synthesizes a living textbook:
- **Incremental Drive Ingestion**: Detects new PDF uploads and syllabus updates immediately.
- **Structured Knowledge Extraction**: Cleans, outlines, and indexes lecture notes with citation markers referencing the exact source page.
- **Fast Search & Revision Cards**: Static-site generated revision modules optimized for instant mobile lookup.`,
    featured: false,
  },
  {
    id: 'prism',
    name: 'PRISM — Contactless Multimodal Health Screening AI',
    oneLine: '100% contactless preventative health screening AI using only a smartphone camera and microphone to screen respiratory and biometric risk in under 30 seconds.',
    building: 'The Diagnostic Beam',
    role: 'Computer Vision & Audio ML Developer — Photoplethysmography (rPPG), acoustic respiratory analysis, mobile edge inference',
    stack: ['Python', 'Computer Vision', 'rPPG Biometrics', 'Audio ML', 'Flask', 'Android'],
    year: 2025,
    metrics: [
      { label: 'SCAN TIME', value: '< 30 seconds' },
      { label: 'HARDWARE NEEDED', value: '0 External Sensors' },
      { label: 'TARGET SCREENING', value: '50+ patients/day' },
    ],
    links: [
      { label: 'GitHub Repository', href: 'https://github.com/sharonjoseph12/Vaidya' },
    ],
    caseStudy: `### The Problem
Rural healthcare workers (ASHA workers) lack portable diagnostic hardware to detect early respiratory vulnerability and cardiovascular stress in remote Indian villages.

### The Architectural Move
PRISM turns any standard budget Android smartphone into a complete contactless clinic:
- **Remote Photoplethysmography (rPPG)**: Measures micro-vascular blood flow fluctuations from facial video to estimate heart rate and heart rate variability (HRV).
- **Acoustic Breath Analysis**: Evaluates audio spectrum coughing patterns to screen for respiratory obstruction.
- **Ayushman Bharat Digital Mission (ABDM) Alignment**: Designed for direct field deployment with zero external peripheral costs.`,
    featured: false,
  },
];
