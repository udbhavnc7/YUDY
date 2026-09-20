export type AchievementStatus = 'winner' | 'top' | 'participated';

export type Achievement = {
  id: string;
  title: string;
  event: string;
  year: number;
  status: AchievementStatus;
  description?: string;
  link?: string;
  poster?: string;
};

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'kawach-startup',
    title: 'Best Startup Award',
    event: 'AAKRITHI / AETHERION',
    year: 2026,
    status: 'winner',
    description: 'KAWACH — Personal safety & emergency BLE mesh',
    link: 'https://github.com/udbhavnc7/KAWACH',
  },
  {
    id: 'vortex-winner',
    title: 'Winner $350',
    event: 'REVA RIFT HACK.ALGO',
    year: 2025,
    status: 'winner',
    description: 'VORTEX — Decentralized escrow on Algorand',
    link: 'https://github.com/sharonjoseph12/vortex_reva',
  },
  {
    id: 'build-for-bengaluru',
    title: 'Top 30 / 2000',
    event: 'Build For Bengaluru Hackathon',
    year: 2025,
    status: 'top',
    description: 'Project: TBD',
  },
  {
    id: 'coastal-india',
    title: 'Top 30 / 800',
    event: 'Coastal India Hackathon',
    year: 2025,
    status: 'top',
    description: 'Project: TBD',
  },
  {
    id: 'synergia',
    title: 'Top 30 / 1500',
    event: 'SYNERGIA Hackathon',
    year: 2025,
    status: 'top',
    description: 'Project: TBD',
  },
  {
    id: 'sambhram',
    title: '2nd Place',
    event: 'Sambhram Line Quest',
    year: 2025,
    status: 'top',
    description: 'Project: TBD',
  },
];