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
  /** Tailwind object-position utility keeping the subject in frame — the
   *  mobile (4:3) and desktop (tall) crops cut different axes, but each
   *  axis of a position value only acts when that axis is actually cropped,
   *  so one value covers both. */
  focalPoint: string
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
    image: '/images/career/graduation.webp',
    focalPoint: 'object-[50%_40%]',
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
    image: '/images/career/newark.webp',
    focalPoint: 'object-[72%_24%]',
    mark: 'DF1',
  },
  {
    id: 'birmingham',
    year: '2019 – 2020',
    institution: 'Birmingham Dental Hospital',
    qualification: 'Dental Core Training · Paediatrics & Restorative',
    location: 'Birmingham',
    description:
      'A hospital year split between children and oral surgey. Treating nervous young patients made gentleness a habit, not an afterthought.',
    image: '/images/career/bdh.webp',
    focalPoint: 'object-[50%_40%]',
    mark: 'DCT1',
  },
  {
    id: 'totally-aesthetic',
    year: '2021 – 2023',
    institution: 'Totally Aesthetic',
    qualification: 'Restorative & Aesthetic Dentistry',
    location: 'Postgraduate',
    description:
      'PgDip restorative and aesthetics: a diploma spent obsessing over the details of a smile: proportion, shade, and the millimetre decisions that separate good from seamless.',
    image: '/images/career/ta.webp',
    focalPoint: 'object-[50%_24%]',
    mark: 'PgDip',
  },
  {
    id: 'smart-smiles',
    year: '2023 – now',
    institution: 'Smart Smiles',
    qualification: 'Associate Dentist',
    location: 'Ystrad Mynach',
    description:
      'Where it all comes together. From routine check-ups to full smile makeovers, this is the unhurried, precise dentistry I set out to practise.',
    image: '/images/career/smart-smiles.webp',
    focalPoint: 'object-[35%_20%]',
    mark: 'NOW',
    current: true,
  },
]
