// Site-wide SEO metadata — single source of truth for the head tags the
// landing page emits (title, description, canonical, social cards).

// PLACEHOLDER — the production domain isn't recorded anywhere in this repo
// (no CNAME, no deploy config). Replace with the real origin (no trailing
// slash) before the social/canonical tags go live.
export const siteUrl = 'https://drdeesha.example.com'

export const site = {
  name: 'Dr Deesha Dental',
  /** Full title for search results and social cards */
  title: 'Dr Deesha Dental — Dentist in Ystrad Mynach, South Wales',
  /** Meta description — drawn from the page's own copy (hero + about) */
  description:
    'General and cosmetic dentistry from Dr Deesha at Smart Smiles in Ystrad Mynach, South Wales. Calm, unhurried care, from check-ups, hygiene and fillings to whitening, bonding and alignment.',
  /** Social-card image: the portrait from the Meet section */
  ogImage: `${siteUrl}/images/about/portrait.webp`,
}
