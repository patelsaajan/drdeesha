<template>
  <div id="home" ref="heroRoot" class="relative h-dvh overflow-hidden bg-background" style="--smile-w: min(clamp(12rem, 27vw, 28.5rem), 69dvh)">

    <!-- Centred wordmark — the brand logo (name + DENTAL rule, set in the
         practice's own typeface). On first load it performs the site's one
         entrance: a single unhurried rise. -->
    <h1 ref="intro" class="intro-title pointer-events-none absolute inset-0 z-10 m-0 flex items-center justify-center">
      <NuxtImg
        src="/images/logo/dr-deesha-logo.png"
        alt="Dr Deesha Dental"
        preload
        class="intro-logo h-auto"
        style="width: clamp(18rem, 60vw, 46rem)"
      />
      <span class="sr-only">— dentist in Ystrad Mynach, South Wales</span>
    </h1>

    <!-- Smiles. A beat after load they fly up from below the fold in a
         staggered cascade and settle into a loose collage around the wordmark —
         see playSmiles(). Nothing here reacts to scroll. Back-layer smiles sit
         at z-0 so the name occludes them; front-layer at z-20 sit over it —
         that occlusion split is the parallax. The settle position and scale
         live in CSS custom props so reduced-motion visitors (and no-JS
         visitors) get the finished composition at first paint; GSAP animates
         to the same values. -->
    <div
      v-for="smile in smiles"
      :key="smile.id"
      class="smile pointer-events-none absolute"
      :class="smile.depth === 'back' ? 'z-0' : 'z-20'"
      :style="{ 'top': '50%', 'left': smileLeft(smile.factor), '--settle-y': `${smile.settleY * 100}dvh`, '--settle-scale': String(smile.settleScale) }"
    >
      <div class="overflow-hidden rounded-sm bg-foreground/5" style="width: var(--smile-w); aspect-ratio: 3 / 2">
        <NuxtImg :src="smile.src" :alt="smile.alt" sizes="12rem md:27vw" loading="lazy" class="h-full w-full object-cover" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import gsap from 'gsap'

const images = [
  { src: '/images/hero/smile-1.jpeg', alt: 'A close, natural smile after treatment' },
  { src: '/images/hero/smile-2.jpeg', alt: 'A bright, even smile up close' },
  { src: '/images/hero/smile-3.jpg', alt: 'A confident finished smile' },
  { src: '/images/hero/smile-4.jpg', alt: 'A warm smile with straightened front teeth' },
  { src: '/images/hero/smile-5.jpg', alt: 'A relaxed smile after cosmetic work' },
]

const COLUMN_GAP = 20 // fixed px gap between adjacent smile columns, at any viewport size

// Hand-placed horizontal offsets (units of column spacing, see smileLeft),
// per-smile rise speeds, depth, and where each one comes to rest. `speed`
// scales the fly-up duration: >1 rises faster, <1 lags behind. `depth` puts a
// smile in front of or behind the wordmark; the back set settles smaller, so
// it reads as set further away. `settleY` is the resting offset from
// mid-screen in viewport heights (negative = above the wordmark), `settleScale`
// the resting size — together they scatter the five into a loose collage that
// leaves the name's centre line readable. Lanes overlap in x (five full-width
// smiles don't fit side by side), so overlapping pairs (0/4, and the whole
// left cluster) are separated vertically at rest instead.
const LAYOUT: { factor: number, speed: number, depth: 'front' | 'back', settleY: number, settleScale: number }[] = [
  { factor: -0.95, speed: 1.1, depth: 'front', settleY: -0.30, settleScale: 0.76 },
  { factor: 1.6, speed: 0.75, depth: 'back', settleY: -0.21, settleScale: 0.62 },
  { factor: -1.75, speed: 1.05, depth: 'front', settleY: 0.16, settleScale: 0.70 },
  { factor: 0.9, speed: 0.7, depth: 'back', settleY: 0.30, settleScale: 0.60 },
  { factor: -0.75, speed: 1.12, depth: 'front', settleY: 0.34, settleScale: 0.66 },
]
const MAX_FACTOR = Math.max(...LAYOUT.map(l => Math.abs(l.factor)))

const smiles = LAYOUT.map((layout, i) => ({
  id: i,
  ...layout,
  src: images[i % images.length]!.src,
  alt: images[i % images.length]!.alt,
}))

const EDGE_MARGIN = 24 // px, minimum clearance between a smile's outer edge and the viewport edge

// Horizontal offset from centre, in units of column spacing. Spacing is the
// smaller of the ideal (width + gap) and whatever keeps the widest-set smile
// (MAX_FACTOR) from clipping past the viewport edge — otherwise, on a narrow
// viewport, the outermost smiles would be pushed off-screen. Each smile is
// centred on this point via GSAP's xPercent: -50 (see playSmiles).
function smileLeft(factor: number) {
  const sign = factor < 0 ? '-' : '+'
  const idealSpacing = `(var(--smile-w) + ${COLUMN_GAP}px)`
  const maxSpacing = `((50% - ${EDGE_MARGIN}px - (var(--smile-w) / 2)) / ${MAX_FACTOR})`
  const spacing = `min(${idealSpacing}, ${maxSpacing})`
  return `calc(50% ${sign} ${Math.abs(factor)} * ${spacing})`
}

const prefersReducedMotion = ref(false)
let motionQuery: MediaQueryList | undefined

function onMotionPreferenceChange(e: MediaQueryListEvent) {
  prefersReducedMotion.value = e.matches
}

// First-load choreography for the wordmark: a single unhurried rise of the
// logo. Reduced-motion visitors never enter here — the anti-FOUC style that
// hides the logo only applies under no-preference, so for them it's simply
// visible at first paint with no JS involved.
const intro = ref<HTMLElement | null>(null)
let introCtx: gsap.Context | undefined

function playIntro() {
  const el = intro.value
  if (!el || prefersReducedMotion.value) return

  introCtx = gsap.context(() => {
    gsap.fromTo('.intro-logo', { autoAlpha: 0, y: 30 }, { autoAlpha: 1, y: 0, duration: 1.15, ease: 'expo.out' })
  }, el)
}

// The smiles' one entrance. They rise the moment the hero mounts, staggered,
// from fully below the fold, decelerating into their settle positions around
// the wordmark — the collage they form is the hero's steady state. Purely
// time-driven. Reduced-motion visitors skip the flight: the CSS below paints
// the same settled composition with no JS at all.
//
// Gap between one smile launching and the next; keeps the cascade reading as
// a cascade rather than five photos arriving as one block.
const SMILE_STAGGER = 0.55

// Pause before the first smile starts to rise.
const SMILE_LEAD_IN = 0.5

// Extra px past the fold a smile parks at, so it is provably off screen at
// rest rather than flush to the edge by a subpixel.
const FOLD_CLEARANCE = 8
const heroRoot = ref<HTMLElement | null>(null)
let smileCtx: gsap.Context | undefined

function playSmiles() {
  const root = heroRoot.value
  if (!root || prefersReducedMotion.value) return

  const vh = window.innerHeight

  smileCtx = gsap.context(() => {
    const els = gsap.utils.toArray<HTMLElement>('.smile')

    // A short beat before the first smile moves. Deliberate, and distinct
    // from the 1.6s lag this used to have: that came from the tween starting
    // a whole viewport below the fold, so nothing was on screen long after
    // it had begun. Now the motion is visible the moment it starts, and this
    // is simply the pause in front of it. Applied to the timeline, so all
    // five shift together and the cascade spacing is unaffected.
    const tl = gsap.timeline({ delay: SMILE_LEAD_IN })
    els.forEach((el, i) => {
      const smile = smiles[i]!

      // Launch each smile exactly one edge past the fold. `.smile` sits at
      // top:50% with yPercent:-50, so its centre rests at mid-screen and this
      // offset is half a viewport plus half the smile — the least that still
      // hides it completely at the start.
      const offscreen = vh / 2 + (el.offsetHeight * smile.settleScale) / 2 + FOLD_CLEARANCE
      // x: 0 matters: GSAP parses the stylesheet's translate(-50%, …) into
      // its own x/y before applying xPercent, so without clearing it the
      // -50% would be applied twice and every smile would sit half a card
      // left of its lane.
      gsap.set(el, { xPercent: -50, yPercent: -50, x: 0, y: offscreen, scale: smile.settleScale, autoAlpha: 1 })

      // Lands on exactly the values the reduced-motion CSS paints statically
      // (settleY in dvh, settleScale) so both audiences end on one composition.
      tl.to(el, { y: smile.settleY * vh, duration: 2.2 / smile.speed, ease: 'expo.out' }, i * SMILE_STAGGER)
    })
  }, root)
}

onMounted(() => {
  motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
  prefersReducedMotion.value = motionQuery.matches
  motionQuery.addEventListener('change', onMotionPreferenceChange)
  playIntro()
  playSmiles()
})

onUnmounted(() => {
  motionQuery?.removeEventListener('change', onMotionPreferenceChange)
  introCtx?.revert()
  smileCtx?.revert()
})
</script>

<style scoped>
.smile {
  /* The settled composition, straight from the per-smile custom props the
     template sets. This is the resting state for everyone: reduced-motion
     visitors get it at first paint with no JS, and GSAP animates to these
     same values for everyone else. */
  transform: translate(-50%, calc(-50% + var(--settle-y))) scale(var(--settle-scale));
  will-change: transform, opacity;
}

/* Entrance start states — only where we'll actually animate: motion allowed
   AND JS running (html.js, set by the inline head script in app.vue).
   Reduced-motion and no-JS visitors both get the logo and the settled
   smiles fully visible from first paint. */
@media (prefers-reduced-motion: no-preference) {
  .js .intro-logo,
  .js .smile {
    opacity: 0;
  }
}
</style>
