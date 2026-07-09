export interface Testimonial {
  /** Stable key */
  id: string
  /** The review, without surrounding quote marks */
  quote: string
  /** Who said it */
  name: string
  /** Short context, e.g. treatment or patient type */
  context: string
  /** Optional source, e.g. "Google" */
  source?: string
  /** Pull one out as the lead quote */
  featured?: boolean
}

export const testimonials: Testimonial[] = [
  {
    id: 'sarah',
    quote:
      'I’d avoided dentists for years. Deesha talked me through every step, and I actually left smiling. I’ve since had my whole smile done and I couldn’t be happier.',
    name: 'Sarah M.',
    context: 'Bonding & whitening',
    source: 'Google',
    featured: true,
  },
  {
    id: 'james',
    quote:
      'Gentle, precise, and genuinely kind. My veneers look completely natural, no one can tell.',
    name: 'James T.',
    context: 'Porcelain veneers',
    source: 'Google',
  },
  {
    id: 'priya',
    quote:
      'She fixed a gap I’d been self-conscious about my whole life, in a single appointment. Life-changing.',
    name: 'Priya K.',
    context: 'Edge bonding',
    source: 'Google',
  },
  {
    id: 'hannah',
    quote:
      'The calmest dental experience I’ve ever had. My kids actually ask to go back.',
    name: 'Hannah L.',
    context: 'Family patient',
    source: 'Google',
  },
  {
    id: 'owen',
    quote:
      'Booked in nervous, walked out grinning. Worth every mile of the drive.',
    name: 'Owen R.',
    context: 'Invisalign',
    source: 'Google',
  },
  {
    id: 'emma',
    quote:
      'Straightened my teeth without anyone at work even noticing I was wearing aligners. Barely felt like treatment.',
    name: 'Emma S.',
    context: 'Invisalign',
    source: 'Google',
  },
  {
    id: 'marcus',
    quote:
      'Lost a front tooth in my twenties and hated smiling for years. You genuinely cannot tell which one is the implant now.',
    name: 'Marcus D.',
    context: 'Single implant',
    source: 'Google',
  },
  {
    id: 'chloe',
    quote:
      'Whitening with zero sensitivity, which I didn’t think was possible. Eased into it exactly at my pace.',
    name: 'Chloe W.',
    context: 'Enlighten whitening',
    source: 'Google',
  },
  {
    id: 'liam',
    quote:
      'I’m the most nervous patient you’ll ever meet and I still went back for a second visit. That says everything.',
    name: 'Liam P.',
    context: 'Composite bonding',
    source: 'Google',
  },
  {
    id: 'grace',
    quote:
      'Cracked a tooth on a Friday night and got seen first thing Saturday. Calm, quick, no drama.',
    name: 'Grace H.',
    context: 'Emergency appointment',
    source: 'Google',
  },
  {
    id: 'david',
    quote:
      'Ten veneers and every single one matches like it grew there. Worth every consultation it took to get the shade right.',
    name: 'David N.',
    context: 'Porcelain veneers',
    source: 'Google',
  },
  {
    id: 'aisha',
    quote:
      'My daughter used to cry at the dentist. Now she asks when her next check-up is. I still can’t quite believe it.',
    name: 'Aisha R.',
    context: 'Family patient',
    source: 'Google',
  },
  {
    id: 'noah',
    quote:
      'Explained every option before touching anything. First dentist who’s ever made me feel like a decision-maker, not a patient.',
    name: 'Noah B.',
    context: 'Composite bonding',
    source: 'Google',
  },
  {
    id: 'freya',
    quote:
      'Flew back from abroad just for my check-ups now. That’s the honest truth.',
    name: 'Freya C.',
    context: 'General patient',
    source: 'Google',
  },
  {
    id: 'tom',
    quote:
      'Chipped a front tooth the week of my wedding. Fixed same-day and you’d never know it happened.',
    name: 'Tom K.',
    context: 'Emergency appointment',
    source: 'Google',
  },
  {
    id: 'ruby',
    quote:
      'Nine months of Invisalign and not one awkward moment. Painless, honestly.',
    name: 'Ruby A.',
    context: 'Invisalign',
    source: 'Google',
  },
  {
    id: 'daniel',
    quote:
      'Went in for a whitening consult, left with a whole plan I actually understood. No pressure, just options.',
    name: 'Daniel F.',
    context: 'Enlighten whitening',
    source: 'Google',
  },
  {
    id: 'nadia',
    quote:
      'I’d put off an implant for three years out of dread. Should’ve booked years ago.',
    name: 'Nadia S.',
    context: 'Single implant',
    source: 'Google',
  },
  {
    id: 'ben',
    quote:
      'Recommended by three separate people before I’d even asked. Now I understand why.',
    name: 'Ben O.',
    context: 'General patient',
    source: 'Google',
  },
  {
    id: 'sophie',
    quote:
      'Six veneers later and strangers still ask if they’re real. Best answer I could give.',
    name: 'Sophie L.',
    context: 'Porcelain veneers',
    source: 'Google',
  },
  {
    id: 'harry',
    quote:
      'Talked me through every stage of the bonding before starting. Left knowing exactly what I was getting.',
    name: 'Harry M.',
    context: 'Composite bonding',
    source: 'Google',
  },
]
