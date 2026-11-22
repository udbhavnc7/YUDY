export type Education = {
  id: string;
  type: 'school' | 'college';
  institution: string;
  details?: string;
  period: string;
};

// Sourced from the portfolio résumé.
export const EDUCATION: Education[] = [
  {
    id: 'school',
    type: 'school',
    institution: 'Canara High School, Mangaluru',
    details: 'Class 10 · 92.7%',
    period: 'Jun 2015 – Mar 2022',
  },
  {
    id: 'college',
    type: 'college',
    institution: 'St. Joseph Engineering College, Mangaluru',
    details: 'B.E. Computer Science & Data Science · 9 CGPA in Year 1',
    period: 'Sep 2024 – Aug 2028',
  },
];
