<template>
  <div id="home" ref="heroRoot" class="relative h-dvh overflow-hidden bg-background" style="--smile-w: min(clamp(12rem, 27vw, 28.5rem), 69dvh)">

    <!-- Centred wordmark — the brand logo (name + DENTAL rule, set in the
         practice's own typeface). On first load it performs the site's one
         entrance: a single unhurried rise. -->
    <h1 ref="intro" class="intro-title pointer-events-none absolute inset-0 z-10 m-0 flex items-center justify-center">
      <NuxtImg
        src="/images/logo/dr-deesha-logo.webp"
        alt="Dr Deesha Dental"
        preload
        class="intro-logo h-auto"
        style="width: clamp(18rem, 60vw, 46rem)"
      />
    </h1>

    <!-- Smiles. A beat after load they fly up from below the fold in a
         staggered cascade, sweep past the wordmark and off the top — see
         playSmiles(). Nothing here reacts to scroll. Back-layer smiles sit at
         z-0 so they pass behind the wordmark (z-10); front-layer at z-20 sweep
         over it — the name occluding one set and not the other is the parallax. -->
    <div
      v-for="smile in smiles"
      :key="smile.id"
      class="smile pointer-events-none absolute"
      :class="smile.depth === 'back' ? 'z-0' : 'z-20'"
      :style="{ top: '50%', left: smileLeft(smile.factor) }"
    >
      <div class="overflow-hidden rounded-sm bg-foreground/5" style="width: var(--smile-w); aspect-ratio: 3 / 2">
        <NuxtImg :src="smile.src" alt="" sizes="12rem md:27vw" loading="lazy" class="h-full w-full object-cover" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import gsap from 'gsap'

const images = [
  '/images/hero/smile-1.webp',
  '/images/hero/smile-2.webp',
  '/images/hero/smile-3.webp',
  '/images/hero/smile-4.webp',
  '/images/hero/smile-5.webp',
]

const COLUMN_GAP = 20 // fixed px gap between adjacent smile columns, at any viewport size
const COUNT = 5

// Hand-placed horizontal offsets (units of column spacing, see smileLeft),
// per-smile rise speeds, and depth, deliberately irregular rather than a
// repeating grid. `speed` scales the fly-up duration: >1 rises faster, <1 lags
// behind. `depth` puts a smile in front of or behind the wordmark; the back set
// is also the slowest and gets scaled down (see playSmiles), so it reads as set
// further away. Adjacent entries keep a wide factor gap (>=1.6) since they're
// the two smiles that fly up closest together in time — a close pair sharing a
// horizontal lane at once is what would read as a collision rather than a
// staggered cascade. This only holds while SMILE_STAGGER keeps non-adjacent
// smiles off screen together: entries 0 and 4 sit just 0.2 columns apart and
// overlap by ~85%, so they must never be airborne at the same moment.
const LAYOUT: { factor: number, speed: number, depth: 'front' | 'back' }[] = [
  { factor: -0.95, speed: 1.1, depth: 'front' },
  { factor: 1.6, speed: 0.75, depth: 'back' },
  { factor: -1.75, speed: 1.05, depth: 'front' },
  { factor: 0.9, speed: 0.7, depth: 'back' },
  { factor: -0.75, speed: 1.12, depth: 'front' },
  { factor: 1.3, speed: 0.8, depth: 'front' },
]
const MAX_FACTOR = Math.max(...LAYOUT.map(l => Math.abs(l.factor)))

const smiles = Array.from({ length: COUNT }, (_, i) => ({
  id: i,
  factor: LAYOUT[i % LAYOUT.length]!.factor,
  speed: LAYOUT[i % LAYOUT.length]!.speed,
  depth: LAYOUT[i % LAYOUT.length]!.depth,
  src: images[i % images.length],
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
// from fully below the fold (y: +vh) to fully above it (y: -vh), each in its
// own horizontal lane so the cascade never collides. Purely time-driven; when
// it's done the smiles have cleared the top and the name stands alone.
// Reduced-motion visitors get none of this — the CSS below keeps the smiles
// hidden.
//
// Gap between one smile launching and the next. Load-bearing, not decorative:
// several of the hand-placed horizontal offsets overlap in x, and the cascade
// is what keeps an overlapping pair from ever being airborne together. Five
// smiles at ~389px would need 1945px laid side by side and a 1440px screen
// hasn't got it, so they can only be separated in time, not in space. Don't
// collapse this toward zero without narrowing the smiles to match.
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
      // Back-layer smiles start smaller so, with their slower speed and the
      // wordmark occluding them, they read as set further back.
      const scale = smile.depth === 'back' ? 0.8 : 1

      // Park each smile exactly one edge past the fold, not a whole viewport
      // beyond it. `.smile` sits at top:50% with yPercent:-50, so its centre
      // rests at mid-screen and this offset is half a viewport plus half the
      // smile — the least that still hides it completely. The previous ±vh
      // buried 320px of dead travel at each end, and since power2.inOut is at
      // its slowest there, the first smile spent 1.6s crawling up through
      // off-screen space before a single pixel showed.
      const offscreen = vh / 2 + (el.offsetHeight * scale) / 2 + FOLD_CLEARANCE
      gsap.set(el, { xPercent: -50, yPercent: -50, y: offscreen, scale, autoAlpha: 1 })

      // Linear, because the start and end are now only just out of frame:
      // an ease-in would spend its slow phase on screen and read as a crawl,
      // where before that phase was hidden. Nothing abrupt is exposed by it —
      // both ends of the tween still happen past the fold.
      // The duration is rescaled to suit the shorter distance so the time a
      // smile actually spends crossing the screen is unchanged.
      tl.to(el, { y: -offscreen, duration: 2.5 / smile.speed, ease: 'none' }, i * SMILE_STAGGER)
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
  /* Hidden until GSAP takes over; reduced-motion visitors keep this and so
     never see the smiles at all — matching the animation's cleared end state. */
  opacity: 0;
  will-change: transform, opacity;
}

/* Entrance start state — only where we'll animate. Reduced-motion visitors
   get the logo fully visible from first paint, no JS required. */
@media (prefers-reduced-motion: no-preference) {
  .intro-logo {
    opacity: 0;
  }
}
</style>
