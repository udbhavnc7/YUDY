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
    description: 'A gaze-tracking communication tool for people with limited mobility or speech, with a monitoring dashboard for caregivers.',
    technologies: ['Gaze tracking', 'JavaScript'],
  },
  {
    id: 'medaether',
    title: 'MedAether',
    type: 'solo',
    author: 'Udbhav NC',
    github: 'https://github.com/udbhavnc7/MedAether',
    description: 'A hospital coordination project that brings bed availability, patient transfers and blood requests into a shared view.',
    technologies: ['TypeScript', 'Supabase', 'Python'],
  },
  {
    id: 'sanchay',
    title: 'Sanchay',
    type: 'solo',
    author: 'Udbhav NC',
    github: 'https://github.com/udbhavnc7/Sanchay',
    live: 'https://sanchay-raib.onrender.com/',
    description: 'An open-source Android app for tracking income, expenses, budgets, planned payments and financial goals.',
    technologies: ['Kotlin', 'Android'],
  },
  {
    id: 'lume',
    title: 'LUME',
    type: 'solo',
    author: 'Udbhav NC',
    github: 'https://github.com/udbhavnc7/LUME',
    live: 'https://lume-0n9h.onrender.com/',
    description: 'A land-acquisition tool that estimates milestone delay risk and explains the evidence behind each prediction.',
    technologies: ['TypeScript', 'Next.js'],
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
    description: 'An e-commerce project with an AI assistant, a budget-aware bundle builder using the knapsack algorithm, and an admin dashboard.',
    technologies: ['Next.js', 'TypeScript', 'Express'],
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

// This shelf uses the projects with reachable public repositories and solo credits.
const soloShelfOrder = ['nayana', 'lume', 'medaether', 'sanchay', 'smartcart'];
export const SOLO_PROJECTS = soloShelfOrder.flatMap(id => PROJECTS.filter(project => project.type === 'solo' && project.id === id));
