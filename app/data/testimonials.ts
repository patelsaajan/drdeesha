// Patient reviews — the single source for the testimonials section. Add,
// remove or reorder entries here and the section adapts on its own; nothing
// else needs touching.
//
// Two things the count affects (see TestimonialsSection.vue):
//   - mobile shows only the first 8, so put the strongest ones early.
//   - desktop never repeats a review (every row is on screen at once, so a
//     repeat would sit beside its twin), which means the row count follows
//     the count here: it takes 5 per row for a band to be wide enough to
//     scroll, so 3 rows needs 15+. At the current 16 that is 3 rows of
//     5/5/6. Dropping below 15 silently falls back to 2 rows, and below 10
//     to a single row. Nothing here needs tuning either way.
//
// Apostrophes: these are single-quoted strings, so a straight ' inside one
// ends it early and breaks the file. Use the typographic ’ as below.
//
// These are real, attributed reviews, quoted verbatim — reviewers' own typos
// and misspellings included. Keep it that way: edited or invented reviews breach
// ASA/CAP rules, GDC advertising guidance, and the Digital Markets,
// Competition and Consumers Act 2024.
export interface Testimonial {
  /** Stable key */
  id: number
  /** The review, without surrounding quote marks */
  quote: string
  /** Who said it */
  name: string
}

export const testimonials: Testimonial[] = [
  {
    id: 1,
    quote:
      'I had a great visit with Dr Chudasama. It was one of the most informative and thorough appointments I’ve had at a dentist. She took the time to answer every question I had clearly and with real confidence, which made the whole experience feel reassuring.',
    name: 'Saajan P',
  },
  {
    id: 2,
    quote:
      'Haven’t been to the dentist in over 10 years so was a bit apprehensive, but no matter though as Deesha and her assistant Sofie were great. Made me feel very comfortable and talked me through my treatment plan in detail. Very professional but also friendly, would recommend!',
    name: 'Dylan T',
  },
  {
    id: 3,
    quote:
      'Dr Deesha was absolutely incredible and extremely thorough. I usually get anxious at the dentist but Deesha made me feel completely relaxed and at ease. She explained everything she was doing and consistently checked in with me to make sure I wasn’t in pain or uncomfortable. Sophie, the dental nurse was also great and they worked brilliantly together. Thank you to all the staff, especially Deesha, for providing such high quality and patient-centred care, you were so helpful! I could not recommend Dr.Chudasama enough! Thank you again, you were fantastic!',
    name: 'Kishen Mehta',
  },
  {
    id: 4,
    quote:
      'I was nervous about my appointment, The staff were very welcoming, relaxed atmosphere and my Dentist Deesha (hope i spelt it right) and her assistant were brilliant with me. Chatting like we knew each other for years. Having the xrays done were not as uncomfortable as they have been in the past. I was so grateful I had to give Deesha a hug of gratitude for my experience today. PS there are handy disabled parking a cross the road.',
    name: 'A Granham',
  },
  {
    id: 5,
    quote:
      'I honestly couldn’t thank the team enough for everything they did. Booked straight back in for more work in the coming weeks.',
    name: 'Liam B',
  },
  {
    id: 6,
    quote:
      'Deesha and Sophie were terrific. Very friendly and thorough check up and clean, would highly recommend!',
    name: 'Ken D',
  },
  {
    id: 7,
    quote:
      'I was extremely nervous about going, but I needn’t be. The whole staff are wonderful and my dentist, Deesha, was amazing. She was calming, kind, straightforward and completely non-judgmental. She explained everything to me and gave me as much time as I needed. Her assistant nurse was also lovely. I have a long treatment plan, and Siana-the coordinator- took me to a private room to go over everything and discuss my options. She was extremely professional and friendly. I’m pretty sure everyone checked if I was okay, as I got quite flustered and anxious, it was very kind. I would definitely recommend them to everyone and especially to anyone who is reluctant about going.',
    name: 'Aislinn S',
  },
  {
    id: 8,
    quote:
      'My first time meeting dentist Deesha and she was very welcoming and took the time to explain things, which I really appreciated.',
    name: 'Ruth K',
  },
  {
    id: 9,
    quote:
      'Dr Deesha was very professional and informed of everything she was doing. Explained in detail.',
    name: 'Nancy P',
  },
  {
    id: 10,
    quote:
      'Deesha has treated me with care and respect and offered a full explanation every step of the way. My bottom teeth now look normal again and I am delighted x',
    name: 'Susan A',
  },
  {
    id: 11,
    quote:
      'The whole staffing team were very nice and friendly and couldn’t do enough. The dentist was very friendly and explained everything so that I understood what was happening',
    name: 'Lisa T',
  },
  {
    id: 12,
    quote:
      'Amazing team! Deesha and Katelyn were amazing with me - so kind and helpful and even the reception staff were lovely.',
    name: 'Shannon S',
  },
  {
    id: 13,
    quote:
      'Was seen today for an emergency appointment with Deesha, couldn’t recommend enough! Made me feel at ease and welcomed the secono I walked into the room, explained everything so thoroughly. The staff in the dental practice was also amazing! Thank you again',
    name: 'Karen H',
  },
  {
    id: 14,
    quote:
      'Deesha Chudasama was very professional and caring and I felt in safe hands with the filling for my chipped tooth today.',
    name: 'Nadine C',
  },
  {
    id: 15,
    quote:
      'The hygienist and assistant today were really good. The dentist, Dessha Chudassma, was excellent, very reassuring and thorough.',
    name: 'Susan P',
  },
  {
    id: 16,
    quote:
      'Excellent service from the personal welcome as I arrived, to the Xray, anaesthetic and extraction. Staff were great and Dr. Deesha performed the procedure in what seemed to be record time.',
    name: 'Rhodi E',
  },
]
