export interface CareerStep {
  /** Stable key */
  id: string
  /** Time span, e.g. "2013 – 2018" */
  year: string
  /** Card title — where she was */
  institution: string
  /** Sub-title — the course or role */
  qualification: string
  /** City / context line */
  location: string
  /** Short first-person note */
  description: string
  /** Path under /public. Swap the placeholder for a real portrait. */
  image: string
  /** Short tag drawn large and rotated down the card's spine */
  mark: string
  /** Marks the current role */
  current?: boolean
}

export const careerSteps: CareerStep[] = [
  {
    id: 'leeds',
    year: '2013 – 2018',
    institution: 'University of Leeds Dental School',
    qualification: 'Bachelor of Dental Surgery',
    location: 'Leeds',
    description:
      'Five years of foundations: anatomy, materials, and my first real patients. Leeds taught me that good dentistry is equal parts science and steadiness.',
    image: '/images/dr-deesha-graduation.jpg',
    mark: 'BDS',
  },
  {
    id: 'newark',
    year: '2018 – 2019',
    institution: 'London Road Dental Practice',
    qualification: 'Foundation Dentist',
    location: 'Newark',
    description:
      'My first year in practice, treating a whole community from anxious first-timers to lifelong regulars. I learned to slow down and listen before I ever picked up a handpiece.',
    image: '/images/dr-deesha-newark.jpeg',
    mark: 'DF1',
  },
  {
    id: 'birmingham',
    year: '2019 – 2020',
    institution: 'Birmingham Dental Hospital',
    qualification: 'Dental Core Training · Paediatrics & Restorative',
    location: 'Birmingham',
    description:
      'A hospital year split between children and complex restorative work. Treating nervous young patients made gentleness a habit, not an afterthought.',
    image: '/images/dr-deesha-bdh.jpeg',
    mark: 'DCT1',
  },
  {
    id: 'totally-aesthetic',
    year: '2021 – 2023',
    institution: 'Totally Aesthetic',
    qualification: 'Restorative & Aesthetic Dentistry',
    location: 'Postgraduate',
    description:
      'A masters spent obsessing over the details of a smile: proportion, shade, and the millimetre decisions that separate good from seamless.',
    image: '/images/dr-deesha-ta.jpg',
    mark: 'TA',
  },
  {
    id: 'smart-smiles',
    year: '2023 – now',
    institution: 'Smart Smiles',
    qualification: 'Associate Dentist',
    location: 'Ystrad Mynach',
    description:
      'Where it all comes together. From routine check-ups to full smile makeovers, this is the unhurried, precise dentistry I set out to practise.',
    image: '/images/dr-deesha-smart-smiles.jpg',
    mark: 'NOW',
    current: true,
  },
]
