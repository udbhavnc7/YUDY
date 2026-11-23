export type Hobby = {
  id: string;
  title: string;
  description: string;
  asset: string;
};

export const HOBBIES: Hobby[] = [
  {
    id: 'photography',
    title: 'Photography',
    description: 'Street and architectural photography, with an eye for light, geometry, and quiet moments in urban spaces.',
    asset: '/models/compact-camera.glb',
  },
  {
    id: 'music',
    title: 'Music',
    description: 'Listening across genres, from ambient electronic music to Indian classical.',
    asset: '/models/cassette-player.glb',
  },
  {
    id: 'reading',
    title: 'Reading',
    description: 'Reading about systems design, along with science fiction and the occasional philosophy paper.',
    asset: '/models/project-book.glb',
  },
  {
    id: 'cooking',
    title: 'Cooking',
    description: 'Experimental home cooking and trying new recipes.',
    asset: '/models/frying-pan.glb',
  },
];
