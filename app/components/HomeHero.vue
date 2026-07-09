<template>
  <div id="home" class="relative bg-background">

    <!-- Fixed wordmark — stays centred while smiles scroll behind it -->
    <div class="intro-title pointer-events-none fixed inset-0 z-10 flex flex-col items-center justify-center gap-2">
      <h1 class="m-0 font-serif font-normal leading-none tracking-heading text-foreground" style="font-size: clamp(3rem, 10vw, 7rem)">
        Dr Deesha
      </h1>
      <div class="flex items-center gap-3" style="width: clamp(20rem, 55vw, 48rem)">
        <span class="flex-1 h-px bg-foreground" />
        <span class="font-display font-semibold tracking-eyebrow uppercase text-foreground" style="font-size: clamp(0.7rem, 1.2vw, 0.9rem)">Dental</span>
        <span class="flex-1 h-px bg-foreground" />
      </div>
    </div>

    <!-- Smile scroll track — above the wordmark -->
    <div
      class="relative z-20 overflow-x-clip"
      :style="{ height: `${trackHeight}dvh`, '--smile-w': 'min(clamp(12rem, 27vw, 28.5rem), 69dvh)' }"
    >
      <div
        v-for="smile in smiles"
        :key="smile.id"
        class="smile absolute -translate-x-1/2"
        :style="{ top: `${smile.top}dvh`, left: smileLeft(smile.factor), transform: `translateY(${parallaxOffset(smile)}px)` }"
      >
        <div class="overflow-hidden rounded-sm bg-foreground/5" style="width: var(--smile-w); aspect-ratio: 3 / 2">
          <NuxtImg :src="smile.src" alt="" sizes="12rem md:27vw" loading="lazy" class="h-full w-full object-cover" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const images = [
  '/images/smile/smile-1.jpeg',
  '/images/smile/smile-2.jpeg',
  '/images/smile/smile-3.png',
  '/images/smile/smile-4.png',
  '/images/smile/smile-5.png',
]

const COLUMN_GAP = 20 // fixed px gap between adjacent smile columns, at any viewport size
const COUNT = 6
// dvh between consecutive smiles. Tuned so ~2-3 (avg ~2.5) are visible at once:
// tight enough to overlap two steps sometimes, but never three (100dvh viewport +
// 46dvh worst-case smile height = 146dvh max co-visible span; 3 * STEP = 162 > 146).
// Per-smile parallax (see `speed` below) nudges this by ±15% at most, so the
// co-visibility budget still roughly holds.
const STEP = 54
const OFFSET = 104 // dvh before the first smile — clears a full viewport so none show on initial load

// Hand-placed horizontal offsets (units of column spacing, see smileLeft) and
// scroll speeds, deliberately irregular rather than a repeating column grid.
// `speed` is relative to natural scroll: 1 tracks the page exactly (identical
// to the old fixed-grid behaviour), >1 drifts up faster, <1 lags behind.
// Adjacent entries keep a wide factor gap (>=1.6) since neighbours are the
// ones most likely to be on screen together — a close pair crossing at very
// different speeds is what reads as an overlap glitch rather than parallax.
const LAYOUT: { factor: number, speed: number }[] = [
  { factor: -0.95, speed: 1.28 },
  { factor: 1.6, speed: 0.75 },
  { factor: -1.75, speed: 1.2 },
  { factor: 0.9, speed: 0.7 },
  { factor: -0.75, speed: 1.32 },
  { factor: 1.3, speed: 0.8 },
]
const MAX_FACTOR = Math.max(...LAYOUT.map(l => Math.abs(l.factor)))

const smiles = Array.from({ length: COUNT }, (_, i) => ({
  id: i,
  factor: LAYOUT[i % LAYOUT.length]!.factor,
  speed: LAYOUT[i % LAYOUT.length]!.speed,
  top: OFFSET + i * STEP,
  src: images[i % images.length],
}))

const trackHeight = OFFSET + (COUNT - 1) * STEP + 96

const EDGE_MARGIN = 24 // px, minimum clearance between a smile's outer edge and the viewport edge

// Horizontal offset from centre, in units of column spacing. Spacing is the
// smaller of the ideal (width + gap) and whatever keeps the widest-set smile
// (MAX_FACTOR) from clipping past the viewport edge — otherwise, on a narrow
// viewport, the outermost smiles would be pushed off-screen.
function smileLeft(factor: number) {
  const sign = factor < 0 ? '-' : '+'
  const idealSpacing = `(var(--smile-w) + ${COLUMN_GAP}px)`
  const maxSpacing = `((50% - ${EDGE_MARGIN}px - (var(--smile-w) / 2)) / ${MAX_FACTOR})`
  const spacing = `min(${idealSpacing}, ${maxSpacing})`
  return `calc(50% ${sign} ${Math.abs(factor)} * ${spacing})`
}

const scrollY = ref(0)
const viewportH = ref(0)
const prefersReducedMotion = ref(false)

// Natural document scroll already moves each smile at speed 1 (see `top`
// above); this adds only the delta needed to reach the smile's own speed, as
// a transform so it stays off the layout/paint path. The delta is measured
// from the smile's own base scroll position (not raw scrollY) so drift stays
// close to zero while a smile is actually near the viewport and only grows
// once you've scrolled well past it — anchoring to page-top instead would
// make drift scale with how deep the smile sits in a ~470dvh track, blowing
// up for the later images and dragging them into their neighbours.
function parallaxOffset(smile: { top: number, speed: number }) {
  if (prefersReducedMotion.value)
    return 0
  const basePx = (smile.top / 100) * viewportH.value
  return (scrollY.value - basePx) * (1 - smile.speed)
}

let ticking = false

function onScroll() {
  if (!ticking) {
    ticking = true
    requestAnimationFrame(() => {
      scrollY.value = window.scrollY
      ticking = false
    })
  }
}

function onResize() {
  viewportH.value = window.innerHeight
}

let motionQuery: MediaQueryList | undefined

function onMotionPreferenceChange(e: MediaQueryListEvent) {
  prefersReducedMotion.value = e.matches
}

onMounted(() => {
  onResize()
  window.addEventListener('scroll', onScroll, { passive: true })
  window.addEventListener('resize', onResize)
  motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
  prefersReducedMotion.value = motionQuery.matches
  motionQuery.addEventListener('change', onMotionPreferenceChange)
})

onUnmounted(() => {
  window.removeEventListener('scroll', onScroll)
  window.removeEventListener('resize', onResize)
  motionQuery?.removeEventListener('change', onMotionPreferenceChange)
})
</script>

<style scoped>
.smile {
  will-change: transform;
}
</style>
