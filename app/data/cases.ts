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
// Both halves of a pair are cut to the same 3:2 window on the same anatomy,
// registered against each other rather than centred independently, so dragging
// the slider moves the split line without the face jumping under it. That
// registration is what makes the reveal read as one mouth changing instead of
// two photographs swapping.
//
// So a swapped photo means re-cutting the pair, never one file: run
// `python3 tools/align-cases.py <n>`, which re-derives both halves from the
// full-resolution sources in /case-originals (gitignored). The two halves are
// deliberately not the same pixel size — each is cut at whatever its own
// source actually holds — because the slider paints both object-cover into one
// 3:2 box and only the ratio has to match.
const shot = (n: number, phase: 'before' | 'after') => `/images/cases/case-${n}-${phase}.webp`

// The photography is real throughout. The copy is only real where it says so:
// the block marked PLACEHOLDER below still carries invented treatment names,
// timelines and outcome claims, and has to be replaced with the real case
// notes before this goes anywhere public.
export const caseStudies: CaseStudy[] = [
  // Feature card: first in the array is the 2x2 that opens the mosaic (see
  // cardClass() in CaseStudies.vue). Real case notes.
  {
    id: 'veneers-crown-replacement',
    treatment: 'Veneers and crown replacements',
    title: 'A full smile makeover',
    summary: 'Worn, uneven upper teeth restored as one set.',
    description:
      'I staged this smile makeover with whitening, followed by free hand composites and crown replacements, designed around the patient’s face and proportions to achieve a fantastic bright smile.',
    meta: [
      { label: 'Visits', value: '5' },
      { label: 'Composite Veneers', value: '4' },
      { label: 'Timeline', value: '8 Weeks' },
    ],
    image: shot(8, 'after'),
    before: shot(8, 'before'),
    after: shot(8, 'after'),
  },
  // PLACEHOLDER COPY from here down to the facial-composites entry: the six
  // below are real photographs with invented words under them.
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
  // Real case notes resume here. One gap left: the pola-whitening meta row
  // below is still the invented Area/Concern/Material trio its neighbours have
  // outgrown, so it wants the real visit count and timeline.
  {
    id: 'facial-composites',
    treatment: 'Facial composites',
    title: 'See the details',
    summary: 'A little change, a lasting difference.',
    description:
      'A little change, a lasting difference. I replaced and restored the facial composites on the lower teeth to reduce sensitivity and brighten the smile.',
    meta: [
      { label: 'Visits', value: '1' },
      { label: 'Sensitivity', value: 'Managed' },
      { label: 'Aesthetics', value: 'Seamless' },
    ],
    image: shot(7, 'after'),
    before: shot(7, 'before'),
    after: shot(7, 'after'),
  },
  {
    id: 'pola-whitening',
    treatment: 'Pola whitening',
    title: '6 composite veneers',
    summary: 'Gaps between the upper front teeth bonded closed.',
    description:
      'Whitening followed by sculpting 6 freehand composite veneers to achieve a natural, bright smile by evening the edges and closing the gaps.',
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
