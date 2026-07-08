export interface CaseStudy {
  /** Stable key */
  id: string
  /** Short treatment label / tag */
  treatment: string
  /** Card + drawer heading */
  title: string
  /** One-line summary for the card */
  summary: string
  /** Longer note shown in the drawer */
  description: string
  /** Small facts, rendered as a definition list */
  meta: { label: string, value: string }[]
  /** Card thumbnail. Swap the placeholder for a real photo. */
  image: string
  /** Drawer before / after pair */
  before: string
  after: string
}

const P = '/images/cases/placeholder.svg'

export const caseStudies: CaseStudy[] = [
  {
    id: 'bonding-gap',
    treatment: 'Composite bonding',
    title: 'Closing a midline gap',
    summary: 'A front-tooth gap softened in a single afternoon.',
    description:
      'Freehand composite, layered and polished to close a central gap and even the edges. No drilling and no anaesthetic, finished in one visit.',
    meta: [
      { label: 'Visits', value: 'One' },
      { label: 'Chair time', value: '90 min' },
      { label: 'Anaesthetic', value: 'None' },
    ],
    image: P,
    before: P,
    after: P,
  },
  {
    id: 'veneers-upper',
    treatment: 'Porcelain veneers',
    title: 'A full upper makeover',
    summary: 'Ten veneers, rebuilt in proportion and shade.',
    description:
      'A staged upper smile makeover using hand-layered porcelain veneers, designed around the patient’s face before a single tooth was prepared.',
    meta: [
      { label: 'Visits', value: 'Three' },
      { label: 'Veneers', value: 'Ten' },
      { label: 'Timeline', value: '6 weeks' },
    ],
    image: P,
    before: P,
    after: P,
  },
  {
    id: 'invisalign-whitening',
    treatment: 'Invisalign & whitening',
    title: 'Straighten, then brighten',
    summary: 'Aligners first, a gentle whiten to finish.',
    description:
      'Clear aligners to correct crowding over several months, followed by take-home whitening to lift the shade once everything sat right.',
    meta: [
      { label: 'Timeline', value: '7 months' },
      { label: 'Aligners', value: 'Clear' },
      { label: 'Whitening', value: 'Take-home' },
    ],
    image: P,
    before: P,
    after: P,
  },
  {
    id: 'enlighten-whitening',
    treatment: 'Enlighten whitening',
    title: 'Whitening without the ache',
    summary: 'A brighter shade, kept comfortable.',
    description:
      'A supervised whitening course built to reduce sensitivity, easing the shade up gradually rather than forcing it.',
    meta: [
      { label: 'Timeline', value: '2 weeks' },
      { label: 'Sensitivity', value: 'Managed' },
      { label: 'Result', value: 'Natural' },
    ],
    image: P,
    before: P,
    after: P,
  },
  {
    id: 'single-implant',
    treatment: 'Single implant',
    title: 'Replacing a front tooth',
    summary: 'One missing tooth, seamlessly restored.',
    description:
      'A single implant and crown to replace a lost front tooth, matched to its neighbours in shape and translucency so it disappears into the smile.',
    meta: [
      { label: 'Approach', value: 'Staged' },
      { label: 'Restoration', value: 'Implant + crown' },
      { label: 'Match', value: 'Shade-matched' },
    ],
    image: P,
    before: P,
    after: P,
  },
  {
    id: 'edge-bonding',
    treatment: 'Edge bonding',
    title: 'Refining worn edges',
    summary: 'Worn front teeth, quietly rebuilt.',
    description:
      'Composite edge bonding to rebuild worn incisal edges, returning length and a soft, natural finish without touching healthy enamel.',
    meta: [
      { label: 'Visits', value: 'One' },
      { label: 'Chair time', value: '60 min' },
      { label: 'Enamel', value: 'Preserved' },
    ],
    image: P,
    before: P,
    after: P,
  },
]
