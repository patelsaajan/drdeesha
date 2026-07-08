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
    summary: 'I softened a front-tooth gap in a single afternoon.',
    description:
      'I built up freehand composite, layered and polished, to close a central gap and even the edges. No drilling, no anaesthetic, finished in one visit.',
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
      'I staged this upper smile makeover with hand-layered porcelain veneers, designing around my patient’s face before I prepared a single tooth.',
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
      'I corrected the crowding with clear aligners over several months, then finished with take-home whitening once everything sat right.',
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
      'I built this whitening course to reduce sensitivity, easing the shade up gradually rather than forcing it.',
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
      'I replaced a lost front tooth with a single implant and crown, matching it to its neighbours in shape and translucency so it disappears into the smile.',
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
      'I rebuilt worn incisal edges with composite bonding, returning length and a soft, natural finish without touching healthy enamel.',
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
