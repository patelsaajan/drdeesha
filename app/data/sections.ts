export interface SiteSection {
  /** Matches the section element's `id` attribute on the page */
  id: string
  label: string
}

// Single source of truth for the page's section order — the top nav's
// scrollspy switcher and the footer's quick links both derive from it.
export const siteSections: SiteSection[] = [
  { id: 'home', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'cases', label: 'Cases' },
  { id: 'experience', label: 'Experience' },
  { id: 'testimonials', label: 'Reviews' },
  { id: 'contact', label: 'Contact' },
]
