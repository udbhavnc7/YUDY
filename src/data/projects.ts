export type ProjectType = 'solo' | 'group';

export type Project = {
  id: string;
  title: string;
  type: ProjectType;
  author: 'Udbhav NC' | 'VAPORLOGIC';
  github: string;
  live?: string;
  description: string;
  technologies: string[];
  asset?: string;
};

export const PROJECTS: Project[] = [
  {
    id: 'kawach',
    title: 'KAWACH',
    type: 'solo',
    author: 'Udbhav NC',
    github: 'https://github.com/udbhavnc7/KAWACH',
    description: 'Personal safety & emergency BLE mesh — SOS relay across offline phones. Distress packets hop across BLE nodes when cell towers collapse. Lock-screen tri-tap and accelerometer shake trigger SOS. K-d tree clustering matches victims to nearest volunteer. Gemini AI triages audio streams into structured dispatcher briefs.',
    technologies: ['Flutter', 'Dart', 'BLE Mesh', 'Python', 'Google Gemini AI'],
  },
  {
    id: 'vortex',
    title: 'VORTEX',
    type: 'group',
    author: 'VAPORLOGIC',
    github: 'https://github.com/sharonjoseph12/vortex_reva',
    description: 'Decentralized escrow — Algorand smart contracts with automated verification. Funds locked in immutable Algorand escrow vault on deal initiation. Docker-sandboxed test runner verifies code submissions automatically. Zero-custody instant payout once criteria pass on-chain.',
    technologies: ['Algorand', 'PyTeal', 'Docker', 'Oracle Consensus'],
  },
  {
    id: 'nayana',
    title: 'NAYANA',
    type: 'solo',
    author: 'Udbhav NC',
    github: 'https://github.com/udbhavnc7/Nayana',
    live: 'https://nayana-nine.vercel.app',
    description: 'Eye-gaze clinical AI — webcam-based communication for ALS patients. Commercial eye trackers cost $10k+; NAYANA uses any webcam. Real-time pupil landmark tracking for gaze fixation estimation. Dwell-time word matrix lets patients compose sentences and trigger alerts. WebRTC streams fixations and blink fatigue to caregiver dashboards.',
    technologies: ['Computer Vision', 'Gaze Tracking', 'WebRTC', 'React', 'Next.js'],
  },
  {
    id: 'medaether',
    title: 'MedAether',
    type: 'solo',
    author: 'Udbhav NC',
    github: 'https://github.com/udbhavnc7/MedAether',
    description: 'Hospital coordination intelligence — ICU beds, transfers, blood inventory. Transfers and bed coordination run on phone calls and spreadsheets. Universal legacy adapters translate 30-year-old hospital DBs to FHIR. Real-time capacity forecasting matches transfers with ventilator availability. Immutable audit trails trace every routing decision.',
    technologies: ['TypeScript', 'React', 'Node.js', 'PostgreSQL', 'Supabase'],
  },
  {
    id: 'sanchay',
    title: 'Sanchay',
    type: 'solo',
    author: 'Udbhav NC',
    github: 'https://github.com/udbhavnc7/Sanchay',
    description: 'Local-first Android finance — encrypted, offline, zero telemetry. Finance apps leak banking data to cloud servers; Sanchay stays local. Encrypted SQLite via Room DB, split-transaction tracking, custom categories. Predictive spending velocity computed entirely on-device.',
    technologies: ['Kotlin', 'Android SDK', 'Jetpack Compose', 'Room DB', 'Material 3'],
  },
  {
    id: 'lume',
    title: 'LUME',
    type: 'solo',
    author: 'Udbhav NC',
    github: 'https://github.com/udbhavnc7/LUME',
    live: 'https://lume-1ubt.onrender.com/',
    description: 'Land acquisition delay forecasting — transparent evidence reasoning. Infrastructure projects hit months of unforeseen land acquisition delays. Statistical risk engine computes delay probabilities across milestones. Every risk score links back to specific historical disputes. Compares active projects with historical corridors to project velocity.',
    technologies: ['TypeScript', 'React', 'Node.js', 'PostgreSQL', 'Render'],
  },
  {
    id: 'tattva',
    title: 'TATTVA',
    type: 'solo',
    author: 'Udbhav NC',
    github: 'https://github.com/udbhavnc7/TATTVA',
    description: 'Exam syllabus intelligence — auto-syncs with Google Classroom & Drive. Course materials scattered across Drive folders and Classroom streams. Detects new PDF uploads and syllabus updates via webhooks. Parses and indexes notes with page-level source citations. Static-site revision cards optimized for instant mobile lookup.',
    technologies: ['TypeScript', 'React', 'Python', 'Google Drive API'],
  },
  {
    id: 'prism',
    title: 'PRISM',
    type: 'group',
    author: 'VAPORLOGIC',
    github: 'https://github.com/sharonjoseph12/Vaidya',
    description: 'Contactless health screening — smartphone camera and mic only. ASHA workers lack diagnostic hardware in remote villages. rPPG measures heart rate from facial video, no sensors needed. Acoustic cough analysis screens for respiratory obstruction. ABDM-aligned for direct field deployment.',
    technologies: ['Python', 'Computer Vision', 'Audio ML', 'Flask', 'Android'],
  },
  {
    id: 'smartcart',
    title: 'SmartCart',
    type: 'solo',
    author: 'Udbhav NC',
    github: 'https://github.com/udbhavnc7/SmartCart',
    description: 'AI-powered e-commerce with knapsack budget optimization. Budget-constrained shoppers need optimal basket selection. Knapsack algorithm maximizes utility within spending limits. ML recommendations adapt to browsing behavior in real time.',
    technologies: ['Python', 'React', 'Docker', 'ML'],
  },
  {
    id: 'chatguard',
    title: 'ChatGuard',
    type: 'solo',
    author: 'Udbhav NC',
    github: 'https://github.com/udbhavnc7/ChatGuard',
    description: 'Chat filtering system for safe, moderated conversations. Platforms need real-time moderation at scale. NLP classifier detects harmful content with low latency. Configurable filter rules adapt per community context.',
    technologies: ['Python', 'NLP', 'Docker', 'REST API'],
  },
  {
    id: 'cardioscan',
    title: 'CardioScan',
    type: 'solo',
    author: 'Udbhav NC',
    github: 'https://github.com/udbhavnc7/CardioScan',
    description: 'Cardiac risk ML diagnostics from patient data. Early cardiac risk screening requires fast, accessible diagnostics. ML model trained on patient vitals for binary risk classification. Feature importance analysis surfaces key risk indicators. Lightweight Flask API for integration into clinical workflows.',
    technologies: ['Python', 'Scikit-learn', 'Pandas', 'Flask'],
  },
];