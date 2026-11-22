export type Education = {
  id: string;
  type: 'school' | 'college';
  label: string;
  institution: string;
  details?: string;
  period: string;
};

// Sourced from the portfolio résumé.
export const EDUCATION: Education[] = [
  {
    id: 'school',
    label: 'School',
    type: 'school',
    institution: 'Canara High School, Mangaluru',
    details: 'Class 10 · 92.7%',
    period: 'Jun 2015 – Mar 2022',
  },
  {
    id: 'college',
    label: 'Engineering College',
    type: 'college',
    institution: 'St. Joseph Engineering College, Mangaluru',
    details: 'B.E. Computer Science & Data Science · 9 CGPA in Year 1',
    period: 'Sep 2024 – Aug 2028',
  },
  {
    id: 'pu',
    label: 'PU College',
    type: 'college',
    institution: 'Sharada PU College',
    details: 'Grade: 90%',
    period: 'Jul 2022 – Feb 2024',
  },
];
