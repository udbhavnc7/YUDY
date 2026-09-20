export type Education = {
  id: string;
  type: 'school' | 'college';
  institution: string;
  details?: string;
};

export const EDUCATION: Education[] = [
  {
    id: 'school',
    type: 'school',
    institution: 'St. Joseph Engineering College, Mangaluru',
    details: 'B.E. Computer Science & Data Science · 2nd Year, 2024–2028 · 9 CGPA (1st Year)',
  },
  {
    id: 'college',
    type: 'college',
    institution: 'Pre-University College (Name TBD)',
    details: 'Science Stream · 2022–2024 · Score: TBD',
  },
];