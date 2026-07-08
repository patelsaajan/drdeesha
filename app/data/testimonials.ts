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
]
