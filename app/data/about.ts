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
   *  label properly, short enough to hold the section's rhythm. */
  body: string[]
}

// The mosaic that used to fill this section, rewritten as five answers: the
// bio, the open invitation, the lapsed-visit reassurance and the
// life-outside candid copy, gathered under the question each was really
// answering. The "quiet work" pull-quote is deliberately absent — it now
// closes the Meet section, where it reads as Dr Deesha's own words rather
// than one tile among many.
export const aboutTopics: AboutTopic[] = [
  {
    id: 'approach',
    label: 'My approach',
    hint: 'Calm, unhurried, comfort first',
    heading: 'Comfort comes before anything else.',
    body: [
      'I believe dentistry is about much more than teeth. Visiting the dentist can feel daunting, so I aim to create a calm, supportive experience from the moment you sit down.',
      'Whether it\'s a gentle aesthetic enhancement or getting you out of pain, your comfort always comes first, and nothing happens until you understand what it involves and why.',
    ],
  },
  {
    id: 'practice',
    label: 'Where I practise',
    hint: 'Smart Smiles, Ystrad Mynach',
    heading: 'General and cosmetic care, in one place.',
    body: [
      'I\'m a general dentist at the wonderful Smart Smiles in Ystrad Mynach, South Wales, providing a wide range of general and cosmetic dental treatments in a calm and welcoming environment.',
      'That covers the everyday, from check-ups, hygiene and fillings through to whitening, bonding and alignment. I\'m passionate about helping patients feel confident in their smiles.',
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
  {
    id: 'outside',
    label: 'Outside the practice',
    hint: 'Pilates, hikes and baking',
    heading: 'Life beyond the surgery.',
    body: [
      'Outside of dentistry, you\'ll usually find me at Pilates, hiking somewhere with a good view, being an amateur nail tech, or trying out new baking recipes.',
      'It\'s the same instinct as the day job, really: steady hands, and a lot of patience for getting the details right.',
    ],
  },
]
