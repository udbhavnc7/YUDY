export type AchievementStatus = 'winner' | 'top' | 'participated';

export type Achievement = {
  id: string;
  title: string;
  event: string;
  year?: number;
  status: AchievementStatus;
  description?: string;
  link?: string;
};

// Placements and participation come from the portfolio recruitment form.
// REVA's official April 2026 schedule confirms the HACK.ALGO edition.
export const ACHIEVEMENTS: Achievement[] = [
  { id: 'kawach-startup', title: 'Best Startup Award', event: 'AAKRITHI / AETHERION', year: 2026, status: 'winner',
    description: 'KAWACH used Bluetooth Low Energy mesh networking to relay emergency requests between phones.',
    link: 'https://github.com/udbhavnc7/KAWACH' },
  { id: 'vortex-winner', title: 'Winner', event: 'REVA RIFT HACK.ALGO', year: 2026, status: 'winner',
    description: 'VORTEX earned a $350 cash prize for its Algorand escrow project.',
    link: 'https://github.com/sharonjoseph12/vortex_reva' },
  { id: 'build-for-bengaluru', title: 'Top 30', event: 'Build For Bengaluru Hackathon', status: 'top' },
  { id: 'coastal-india', title: 'Top 30', event: 'Coastal India Hackathon', status: 'top' },
  { id: 'synergia', title: 'Top 30', event: 'SYNERGIA Hackathon', year: 2025, status: 'top',
    description: 'Placed in the top 30 out of 1,500 teams.' },
  { id: 'sambhram', title: '2nd Place', event: 'Sambhram Line Quest', year: 2025, status: 'top' },
  { id: 'srinathon', title: 'Participated', event: 'Srinathon', year: 2025, status: 'participated' },
  { id: 'fusion', title: 'Participated', event: 'Fusion Techathon', status: 'participated' },
];

export const ACHIEVEMENT_STYLES = {
  winner: { label: 'Winner', edge: '#c9a260', ink: '#705129', paper: '#e7d4ad' },
  top: { label: 'Top placement', edge: '#34577b', ink: '#243b54', paper: '#d4dbd8' },
  participated: { label: 'Participation', edge: '#367f64', ink: '#235744', paper: '#d2dcc9' },
} as const;
