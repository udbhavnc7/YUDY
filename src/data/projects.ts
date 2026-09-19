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
  itemOnTable: string;
};

export const PROJECTS: Project[] = [
  {
    id: 'kawach',
    name: 'KAWACH — Personal Safety & Emergency Mesh',
    oneLine: 'Always-ready women & personal safety system blending real-time SOS, proactive risk prediction, and offline-first BLE mesh resilience.',
    building: 'The Resilient Citadel',
    role: 'Lead Architect & Mobile Engineer — Flutter app, BLE peer-to-peer relay, geospatial clustering, Gemini AI context triage',
    stack: ['Flutter', 'Dart', 'BLE Mesh', 'Python', 'Google Gemini AI', 'Geospatial Analytics'],
    year: 2026,
    award: 'Best Startup Award — AAKRITHI / AETHERION',
    itemOnTable: 'The Laptop (Portal to Workshop)',
    links: [
      { label: 'Live App', href: 'https://kawach-safety.netlify.app' },
      { label: 'GitHub', href: 'https://github.com/udbhavnc7/KAWACH' },
    ],
    caseStudy: `### The Problem
Traditional SOS apps fail when cell towers collapse or in dead zones with zero cellular connectivity. Women and emergency victims need an instantaneous, lock-screen trigger that works without internet.

### The Architectural Move
KAWACH turns an everyday smartphone into an always-ready guardian:
- Triggers discreet SOS alerts via triple power-button taps, shake gestures, or voice keywords directly from the lock screen.
- Employs device-to-device Bluetooth Low Energy (BLE) multi-hop mesh relays, hopping distress packets across nearby devices until reaching a connected node.
- Real-time geospatial clustering routes incidents to the nearest registered volunteer or responder.
- Google Gemini AI analyzes distress audio/text to generate structured medical triage summaries for dispatchers.`,
    featured: true,
  },
  {
    id: 'lume',
    name: 'LUME — Land Acquisition Predictive Intelligence',
    oneLine: 'Predictive intelligence layer analyzing project records to forecast land acquisition milestone delays with transparent evidence reasoning.',
    building: 'The Geospatial Observatory',
    role: 'Full Stack & Predictive Systems Developer — Delay risk forecasting, comparative project analytics, evidence audit UI',
    stack: ['TypeScript', 'React', 'Node.js', 'PostgreSQL', 'Predictive Modeling', 'Render'],
    year: 2026,
    itemOnTable: 'Survey Crystal Prism',
    links: [
      { label: 'Live Platform', href: 'https://lume-1ubt.onrender.com/' },
      { label: 'GitHub', href: 'https://github.com/udbhavnc7/LUME' },
    ],
    caseStudy: `### The Problem
Government infrastructure systems only record what has already happened, leaving administrative officers blind to bottleneck risks until projects are already months behind schedule.

### The Architectural Move
LUME is an proactive intelligence layer that transforms raw acquisition data into actionable foresight:
- Forecasts the statistical likelihood of upcoming milestone delays across compensation, survey, and title clearances.
- Explains the exact historical evidence, land-parcel friction, and administrative backlog driving each risk score.
- Discovers comparable historical infrastructure projects to benchmark velocity and suggest proactive intervention paths.`,
    featured: true,
  },
  {
    id: 'nayana',
    name: 'NAYANA — Eye-Gaze Communication Platform',
    oneLine: 'Accessible clinical gaze-tracking AI transforming eye fixations into real-time speech and remote caregiver telemetry.',
    building: 'The Optical Sanctuary',
    role: 'Computer Vision & Full Stack Developer — Gaze estimation algorithms, virtual communication keyboard, WebRTC telemetry stream',
    stack: ['Computer Vision', 'Gaze Tracking AI', 'WebRTC', 'React', 'Next.js', 'Vercel'],
    year: 2025,
    itemOnTable: 'Optical Gaze Sensor',
    links: [
      { label: 'Live App', href: 'https://nayana-nine.vercel.app' },
      { label: 'GitHub', href: 'https://github.com/udbhavnc7/Nayana' },
    ],
    caseStudy: `### The Problem
Patients suffering from ALS, locked-in syndrome, or acute paralysis lose motor speech while commercial hardware trackers cost upwards of $10,000, creating an insurmountable accessibility barrier.

### The Architectural Move
NAYANA provides high-fidelity gaze communication through standard browser webcams:
- Convolutional eye-landmark tracking estimating gaze coordinates with zero calibration lag.
- Dwell-time selection matrix enabling patients to compose sentences, trigger alerts, and express pain levels.
- Low-latency WebRTC data channels streaming real-time patient status and telemetry to clinicians and remote caregivers.`,
    featured: true,
  },
  {
    id: 'sanchay',
    name: 'Sanchay — Personal Finance Engine',
    oneLine: 'Open-source Android personal finance engine for intuitive, customizable expense tracking, budgets, and financial goals.',
    building: 'The Minted Ledger',
    role: 'Android Engineer — Kotlin architecture, Room SQLite database, custom budget tracking, visual analytics',
    stack: ['Kotlin', 'Android SDK', 'Jetpack Compose', 'Room DB', 'Material 3'],
    year: 2026,
    itemOnTable: 'Vintage Leather Ledger',
    links: [
      { label: 'GitHub', href: 'https://github.com/udbhavnc7/Sanchay' },
    ],
    caseStudy: `### The Problem
Most personal finance applications require intrusive cloud subscriptions, upload sensitive banking data to third-party servers, and clutter simple budgeting with bloated crypto integrations.

### The Architectural Move
Sanchay is built on complete privacy and local-first autonomy:
- 100% offline local database architecture with encrypted SQLite storage.
- Flexible multi-account tracking supporting split transactions, recurring scheduled bills, and custom category hierarchies.
- Real-time visual spending velocity curves and predictive budget burn-down indicators.`,
    featured: false,
  },
  {
    id: 'saathi',
    name: 'SAATHI — Multilingual Health Companion',
    oneLine: 'Adaptive, voice-first, multilingual personal health companion managing prescriptions, appointments, and everyday medical care.',
    building: 'The Healing Pavilion',
    role: 'Full Stack & Voice AI Developer — Speech recognition, multilingual medical NLP, medication schedules',
    stack: ['TypeScript', 'React', 'Web Speech API', 'Node.js', 'Express', 'Railway'],
    year: 2026,
    itemOnTable: 'Voice Companion Capsule',
    links: [
      { label: 'Live Platform', href: 'https://saathi-production-7faa.up.railway.app' },
      { label: 'GitHub', href: 'https://github.com/udbhavnc7/SAATHI' },
    ],
    caseStudy: `### The Problem
Healthcare management is disjointed outside hospitals. Elderly patients and regional language speakers struggle to parse complex prescription dosages, discharge instructions, and follow-up schedules.

### The Architectural Move
SAATHI acts as a 24/7 personal health guardian:
- Conversational voice-first interface fluent in multiple Indian regional languages.
- Smart OCR and transcription turning physical prescriptions into scheduled medication alarms and refill notices.
- Plain-language explanations of medical contraindications and post-operative recovery instructions.`,
    featured: false,
  },
  {
    id: 'medaether',
    name: 'MedÆther — Hospital Coordination Intelligence',
    oneLine: 'Secure hospital coordination intelligence layer synchronizing fragmented ICU bed data, transfer workflows, and rare blood requests.',
    building: 'The Lifeline Network',
    role: 'Systems Architect — Distributed data integration, legacy healthcare adapters, secure audit logging',
    stack: ['TypeScript', 'React', 'Node.js', 'PostgreSQL', 'Supabase', 'REST / FHIR'],
    year: 2025,
    itemOnTable: 'Emergency Dispatch Transceiver',
    links: [
      { label: 'GitHub', href: 'https://github.com/udbhavnc7/MedAether' },
    ],
    caseStudy: `### The Problem
Hospitals operate in silos using mismatched, legacy proprietary software. Urgent ICU transfers and blood requests require frantic phone calls and unrecorded manual paperwork.

### The Architectural Move
MedÆther sits seamlessly on top of legacy infrastructure without requiring system replacements:
- Real-time predictive ICU bed and ventilator availability tracker with automated failover routing.
- Auditable patient transfer coordination pipeline with clinical sign-off workflows.
- Emergency blood bank dispatch network matching rare donor groups with cold-chain transit tracking.`,
    featured: false,
  },
  {
    id: 'vortex',
    name: 'VORTEX — Algorand Smart Contract Escrow',
    oneLine: 'Decentralized freelancing escrow with automated Docker sandbox verification and Gemini AI jury auditing.',
    building: 'The Cryptographic Vault',
    role: 'Smart Contract & Systems Developer — Algorand ARC-4 contract logic, Docker verification node',
    stack: ['Algorand', 'Python / PyTeal', 'Smart Contracts', 'Docker', 'Oracle Consensus'],
    year: 2025,
    award: 'Winners ($350 Cash Prize) — REVA RIFT HACK.ALGO',
    itemOnTable: 'Cryptographic Token Coin',
    links: [
      { label: 'GitHub', href: 'https://github.com/sharonjoseph12/vortex_reva' },
    ],
    caseStudy: `### The Problem
Centralized freelancing platforms take up to 20% mediator cuts while suffering from biased human disputes and delayed payment releases.

### The Architectural Move
VORTEX moves trust into transparent on-chain logic:
- Buyer locks bounty funds into an immutable Algorand ARC-4 escrow smart contract.
- Solver submissions run inside Docker sandboxes against automated unit test suites.
- Gemini Flash AI jury audits code compliance with prompt-injection defense firewalls.
- Smart contract auto-releases payments upon verified cryptographic consensus without human gatekeepers.`,
    featured: false,
  },
];
