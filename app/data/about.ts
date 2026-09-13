/** A run inside a body paragraph. A bare string is ordinary prose; the object
 *  form marks a phrase for the panel's emphasis rule. `emphasis` is the
 *  literal `true` rather than a boolean on purpose: the wrapper only ever
 *  exists to mark something, so there is no "off" state to write by mistake. */
export type AboutRun = string | { text: string, emphasis: true }

/** One body paragraph. Plain copy stays a plain string, which is what every
 *  topic but `approach` still is; the array form is reached for only when part
 *  of a paragraph needs marking, so nothing has to be rewritten to opt in. */
export type AboutParagraph = string | AboutRun[]

export interface AboutTopic {
  /** Matches the tab/panel element ids */
  id: string
  /** Row label in the left rail */
  label: string
  /** Second line on the row — the answer in miniature, so the rail is
   *  scannable without opening anything */
  hint: string
  /** Panel heading on the right */
  heading: string
  /** Entry body. Two paragraphs is the house length: enough to answer the
   *  label properly, short enough to hold the section's rhythm. Each entry is
   *  a string, or a list of runs when a phrase inside it carries emphasis. */
  body: AboutParagraph[]
}

// The mosaic that used to fill this section, rewritten as four answers: the
// bio, the open invitation and the lapsed-visit reassurance, gathered under
// the question each was really answering. The "quiet work" pull-quote is deliberately absent — it now
// closes the Meet section, where it reads as Dr Deesha's own words rather
// than one tile among many.
export const aboutTopics: AboutTopic[] = [
  {
    id: 'approach',
    label: 'My approach',
    hint: 'Calm, unhurried, comfort first',
    heading: 'Comfort comes before anything else.',
    // The only topic that marks phrases. Two runs carry the three beats the
    // entry exists to land: the approach itself, then what a treatment
    // involves and why it is being done at all.
    body: [
      [
        'Whether it\'s a gentle aesthetic enhancement or getting you out of pain, ',
        { text: 'your comfort always comes first', emphasis: true },
        ', and nothing happens until you understand ',
        { text: 'what\'s involved and why', emphasis: true },
        '.',
      ],
    ],
  },
  {
    id: 'practice',
    label: 'Where I practise',
    hint: 'Smart Smiles, Ystrad Mynach',
    heading: 'General and cosmetic care, in one place.',
    body: [
      'I\'m a general dentist at the wonderful Smart Smiles in Ystrad Mynach, South Wales, providing a wide range of general and cosmetic dental treatments in a calm and welcoming environment.',
      'That covers the everyday, from check-ups  and fillings through to whitening, bonding and alignment. I\'m passionate about helping patients feel confident in their smiles.',
    ],
  },
  {
    id: 'questions',
    label: 'Questions and second opinions',
    hint: 'Both genuinely welcome',
    heading: 'Bring the X-rays, the worries, the photo.',
    body: [
      'Questions are welcome, and so are second opinions. If you have images from another practice, a treatment plan you\'re unsure about, or a photo of the smile you\'re after, bring them along.',
      'You\'ll get a straight answer on what\'s realistic, what it involves and what it costs, with no pressure to decide on the day.',
    ],
  },
  {
    id: 'nervous',
    label: 'If it\'s been a while',
    hint: 'No lectures, ever',
    heading: 'You won\'t get a lecture here.',
    body: [
      'If it\'s been years since your last check-up, you won\'t get a lecture. Just a clear plan, and a bit of credit for showing up.',
      'We can go at whatever pace suits you: a look and a conversation first, treatment only once you\'re ready for it.',
    ],
  },
]
