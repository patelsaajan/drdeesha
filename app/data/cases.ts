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
  /** Card thumbnail — the "after" of the pair. */
  image: string
  /** Drawer before / after pair */
  before: string
  after: string
}

// Every case owns a numbered before/after pair under the same convention:
//   /images/cases/case-<n>-before.webp   /images/cases/case-<n>-after.webp
// Both halves of a pair are pre-cropped to the same 3:2 window on the same
// anatomy — registered against each other rather than centred independently —
// so dragging the slider moves the split line without the face jumping. Swap
// a photo and the crop has to be redone as a pair, not per file; the
// full-resolution sources live in /case-originals (gitignored).
const shot = (n: number, phase: 'before' | 'after') => `/images/cases/case-${n}-${phase}.webp`

// PLACEHOLDER COPY. The photography is real; every word below is invented to
// dress the layout. Treatment names, timelines and outcome claims must be
// replaced with the real case notes before this goes anywhere public.
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
    image: shot(1, 'after'),
    before: shot(1, 'before'),
    after: shot(1, 'after'),
  },
  {
    id: 'edge-bonding',
    treatment: 'Edge bonding',
    title: 'Refining worn edges',
    summary: 'Worn front teeth, quietly rebuilt.',
    description:
      'I rebuilt worn incisal edges with composite, returning a little length and a soft, natural finish without touching healthy enamel.',
    meta: [
      { label: 'Visits', value: 'One' },
      { label: 'Chair time', value: '60 min' },
      { label: 'Enamel', value: 'Preserved' },
    ],
    image: shot(2, 'after'),
    before: shot(2, 'before'),
    after: shot(2, 'after'),
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
    image: shot(3, 'after'),
    before: shot(3, 'before'),
    after: shot(3, 'after'),
  },
  {
    id: 'enlighten-whitening',
    treatment: 'Enlighten whitening',
    title: 'Whitening without the ache',
    summary: 'A brighter shade, kept comfortable.',
    description:
      'I built this whitening course to reduce sensitivity, easing the shade up gradually rather than forcing it, and finished by evening a couple of edges.',
    meta: [
      { label: 'Timeline', value: '2 weeks' },
      { label: 'Sensitivity', value: 'Managed' },
      { label: 'Result', value: 'Natural' },
    ],
    image: shot(4, 'after'),
    before: shot(4, 'before'),
    after: shot(4, 'after'),
  },
  {
    id: 'chip-repair',
    treatment: 'Chip repair',
    title: 'Rebuilding a broken corner',
    summary: 'One chipped corner, put back the same day.',
    description:
      'A chipped corner on a front tooth, rebuilt in composite and shaped to match its neighbour. Shade-matched wet, polished dry, done in a single sitting.',
    meta: [
      { label: 'Visits', value: 'One' },
      { label: 'Chair time', value: '45 min' },
      { label: 'Match', value: 'Shade-matched' },
    ],
    image: shot(5, 'after'),
    before: shot(5, 'before'),
    after: shot(5, 'after'),
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
    image: shot(6, 'after'),
    before: shot(6, 'before'),
    after: shot(6, 'after'),
  },
  // The three entries below are new photography waiting on its case notes.
  // Every line describes only what the two photographs actually show, and
  // nothing that would have to come from the record: no visit counts, no chair
  // times, no timelines, no shade numbers. That restraint is deliberate rather
  // than lazy: the placeholder copy above shows how easily an invented fact
  // ends up describing an outcome its photographs do not actually show.
  // Treatment names below are read off the images too, so they are the first
  // thing to confirm.
  {
    id: 'hygiene-lower',
    treatment: 'Hygiene',
    title: 'Taking the build-up back off',
    summary: 'Staining and hard deposits lifted from the lower front teeth.',
    description:
      'Years of staining and hardened deposit had collected around the lower front teeth and along the gumline. Cleaned back to the natural tooth, the shape of each one returns and the gum edge sits calm against it again.',
    meta: [
      { label: 'Area', value: 'Lower front' },
      { label: 'Concern', value: 'Staining, deposit' },
      { label: 'Enamel', value: 'Untouched' },
    ],
    image: shot(7, 'after'),
    before: shot(7, 'before'),
    after: shot(7, 'after'),
  },
  {
    id: 'upper-rehabilitation',
    treatment: 'Full upper restoration',
    title: 'Rebuilding the whole upper smile',
    summary: 'Worn, uneven upper teeth restored as one set.',
    description:
      'The upper teeth had worn short and uneven, each a slightly different shade to the next. Rebuilding them together rather than one at a time is what lets the edges run as a single line and the shade settle into one smile.',
    meta: [
      { label: 'Arch', value: 'Upper' },
      { label: 'Approach', value: 'Restored as a set' },
      { label: 'Focus', value: 'Shape and shade' },
    ],
    image: shot(8, 'after'),
    before: shot(8, 'before'),
    after: shot(8, 'after'),
  },
  {
    id: 'closing-spacing',
    treatment: 'Composite bonding',
    title: 'Closing the spaces across the front',
    summary: 'Gaps between the upper front teeth bonded closed.',
    description:
      'Spaces sat between each of the upper front teeth, with the smaller teeth either side of the middle leaving the widest of them. Adding composite to the sides of each tooth closes the gaps by building width, so the teeth end up in proportion to one another rather than simply pushed together.',
    meta: [
      { label: 'Area', value: 'Upper front' },
      { label: 'Concern', value: 'Spacing' },
      { label: 'Material', value: 'Composite' },
    ],
    image: shot(9, 'after'),
    before: shot(9, 'before'),
    after: shot(9, 'after'),
  },
]
