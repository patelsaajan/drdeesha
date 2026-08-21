export interface SiteSection {
  /** Matches the section element's `id` attribute on the page */
  id: string
  label: string
}

// Single source of truth for the page's section order — the nav's labels and
// jump targets and the footer's quick links both derive from it.
export const siteSections: SiteSection[] = [
  { id: 'home', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'cases', label: 'Cases' },
  { id: 'experience', label: 'Experience' },
  { id: 'testimonials', label: 'Reviews' },
  { id: 'contact', label: 'Contact' },
]

export interface SectionAnchor {
  /** Matches a block's `id` attribute on the page */
  id: string
  /** The `siteSections` entry this block reports as while it's the current one */
  navId: string
}

// What the scrollspy actually watches: every full-height block on the page, in
// document order. Two of them carry no nav entry of their own — the Meet panel
// and the Process film — and while one of those filled the screen nothing the
// spy watched crossed its pivot line, so the label fell back to whichever
// section happened to still be on screen. Tagging them closes those blind
// spots: Meet is the opening beat of her story so it reports as About, and the
// Process film is the lead-in to the clinical work so it reports as Cases.
//
// Order is load-bearing — the pick is "last block in page order crossing the
// pivot", which is what keeps the permanently-pinned hero from winning every
// comparison.
export const sectionAnchors: SectionAnchor[] = [
  { id: 'home', navId: 'home' },
  { id: 'meet', navId: 'about' },
  { id: 'about', navId: 'about' },
  { id: 'process', navId: 'cases' },
  { id: 'cases', navId: 'cases' },
  { id: 'experience', navId: 'experience' },
  { id: 'testimonials', navId: 'testimonials' },
  { id: 'contact', navId: 'contact' },
]
