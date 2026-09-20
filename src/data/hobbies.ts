export type Hobby = {
  id: string;
  title: string;
  description: string;
  asset?: string;
};

export const HOBBIES: Hobby[] = [
  {
    id: 'photography',
    title: 'Photography',
    description: 'Street and architectural photography. Capturing light, geometry, and quiet moments in urban spaces.',
  },
  {
    id: 'music',
    title: 'Music',
    description: 'Listening across genres — from ambient electronic to Indian classical. The cassette player on the terrace is not decorative.',
  },
  {
    id: 'reading',
    title: 'Reading',
    description: 'Systems design, sci-fi, and the occasional philosophy paper. The bookshelf in the room is not just a metaphor.',
  },
  {
    id: 'cooking',
    title: 'Cooking',
    description: 'Experimental home cooking. The dosa on the terrace loader was not a random choice — it is a Sunday ritual.',
  },
];