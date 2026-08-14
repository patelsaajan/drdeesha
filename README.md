# Dr Deesha Dental

Single-page marketing/portfolio site for Dr Deesha Chudasama — a general and
cosmetic dentist at Smart Smiles, Ystrad Mynach. Patients first (the booking
portal is the primary action); enough clinical detail in the case studies for
colleagues and prospective professional contacts to look deeper.

Stack: Nuxt 4 · @nuxt/ui v4 (Tailwind v4) · GSAP · pnpm.

## Setup

```bash
pnpm install
pnpm dev        # http://localhost:3000
pnpm build      # production build
```

## Where things live

- `app/pages/index.vue` — the one page; section order only.
- `app/components/` — one component per section (`HomeHero`, `AboutSection`,
  `ProcessVideo`, `CaseStudies`, `CareerTimeline`, `TestimonialsSection`,
  `SiteFooter`) plus chrome (`SiteNav`, `SiteScrollProgress`) and shared
  pieces (`SectionHeader`, `BeforeAfterSlider`, `LocationCards`, `LocationMap`).
- `app/data/` — all copy/config that isn't layout: `contact.ts` (practice,
  hours, GDC number — drives the footer, the live open/closed badge and the
  JSON-LD), `cases.ts`, `career.ts`, `testimonials.ts`, `sections.ts`
  (canonical section order for nav/scrollspy/progress rail).
- `app/assets/css/main.css` — every design token (`@theme`) and the global
  `.js .reveal` anti-FOUC rule. No hard-coded brand values in components.
- `PRODUCT.md` — brief, audiences, anti-references. Read before designing.

## Conventions

- Fonts are self-hosted via `@nuxt/fonts` (configured in `nuxt.config.ts`):
  Bodoni Moda = `font-display` (headings), Fraunces = `font-body`. Add a
  weight there before using a new `font-*` utility.
- Images go through `<NuxtImg>`; IPX serves AVIF/WebP (see `image` config).
  Photographic sources are JPEG — never commit multi-MB PNG photos.
- Case-study photography: full-resolution originals live in
  `/case-originals` (gitignored, local only). The shipped crops in
  `public/images/cases` are aligned before/after pairs — re-crop both halves
  together (see the note in `app/data/cases.ts`).
- Animations: every GSAP entry point checks `prefers-reduced-motion`, and
  content must remain visible without JS (the `.reveal` start state only
  applies under `html.js`).

## Before going live

- Replace the placeholder case-study copy in `app/data/cases.ts` with real
  case notes (it is marked as invented; advertising-standards exposure).
- Real Instagram/TikTok URLs in `SiteFooter.vue`.
- Confirm opening hours in `app/data/contact.ts` (they drive a live
  "Open · closes …" badge).
- Set the production domain: absolute `og:image`/canonical URLs and a
  sitemap need it (`nuxt.config.ts` + `public/robots.txt`).
