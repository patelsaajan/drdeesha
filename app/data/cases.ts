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

// PARTLY PLACEHOLDER COPY. The photography is real throughout, and the
// composite-bonding and resin-bridge notes are now written from the real cases.
// The rest (edge-bonding, chip-repair, invisalign-whitening) is still invented to
// dress the layout: those treatment names, timelines and outcome claims must be
// replaced with the real case notes before this goes anywhere public.
export const caseStudies: CaseStudy[] = [
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
]
