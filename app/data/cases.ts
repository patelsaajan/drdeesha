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
    id: 'composite-bonding',
    treatment: 'Composite bonding',
    title: 'Replacing old composites',
    summary: 'I softened a front-tooth gap in a single afternoon.',
    description:
      'I built up free hand composites on this wonderful young ladies front teeth and well as closing her central gap. She’d sustained fractures from falling and we managed to restore her beautiful smile!',
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
    id: 'resin-bridge',
    treatment: 'Resin retained bridge',
    title: 'Bridging the gap, restoring the smile',
    summary: 'Bridging the gap, restoring the smile',
    description:
      'A conservative solution with a breautiful result. A resin retained bridge is a minimally invasive way to replace a missing tooth whilst preserving as much natural tooth structure as possible. Functional, aesthetic and designed to blend seamlessly into your smile.',
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
    id: 'chip-repair',
    treatment: 'Chip repair',
    title: 'Rebuilding a broken corner',
    summary: 'One chipped corner, put back the same day.',
    description:
      'A chipped corner on a front tooth, rebuilt in composite and shaped to match its neighbour. Shade-matched wet, polished dry, and finished in one sitting so the repair reads as part of the tooth rather than a patch on it.',
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
