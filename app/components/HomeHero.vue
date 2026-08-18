<template>
  <!-- Centred editorial stack — badge, title, bio, then a full-bleed arced
       carousel and the booking CTA beneath it. The carousel sits still until
       it's dragged; each card is scaled and tilted by its distance from the
       viewport's centre line so the row reads as bending around a cylinder
       rather than sliding flat. -->
  <!-- Sticky at z-0 so the section below can slide up over it as a curtain,
       the same layering trick the footer uses over the testimonials. It stays
       stuck for the rest of the page rather than unsticking, but every later
       section is opaque and paints above it, so it's only ever visible here. -->
  <!-- --card-w is capped by height as well as width: on the vw term alone the
       row grows tall enough on a short laptop (1440x800) to push the CTA
       below the fold, so the dvh term caps the card's own height (~39dvh via
       its 3/4 aspect) and the whole stack keeps fitting. -->
  <section
    id="home"
    ref="heroRoot"
    class="sticky top-0 z-0 flex min-h-dvh flex-col items-center justify-center overflow-hidden bg-background pb-28 lg:pb-10"
    style="--card-w: clamp(10.5rem, min(20vw, 29dvh), 32rem); padding-top: clamp(4rem, 9dvh, 6rem)"
  >
    <div class="flex w-full flex-col items-center px-6 text-center">
      <!-- Accent pill. Text is primary, not white: accent sits at ~2:1 against
           white and fails AA, where primary on accent is ~7.6:1. -->
      <p class="hero-rise m-0 rounded-full bg-accent/70 px-4 py-1.5 font-display text-2xs font-semibold uppercase tracking-label text-primary">
        New patients welcome
      </p>

      <h1
        class="hero-rise m-0 mt-5 max-w-3xl font-display font-semibold leading-heading tracking-heading text-foreground"
        style="font-size: clamp(2.25rem, min(5vw, 7.5dvh), 4rem)"
      >
        Feel confident in your smile
      </h1>

      <p class="hero-rise m-0 mt-4 max-w-xl font-serif text-base font-normal leading-relaxed text-foreground/70 lg:text-lg">
        General and cosmetic dentistry from Dr Deesha at {{ practice.name }} in
        {{ practice.location }}, delivered calmly, carefully, and at your pace.
      </p>

      <!-- Same qualification lockup as the About portrait's caption, retinted
           for the light ground. -->
      <p class="hero-rise m-0 mt-4 font-display text-3xs font-semibold uppercase tracking-label text-foreground/55 sm:text-2xs">
        BChD<span class="mx-1.5 text-accent">·</span>MChD<span class="mx-1.5 text-accent">·</span>BSc<span class="mx-1.5 text-accent">·</span>PgDip
      </p>
    </div>

    <!-- Full-bleed: sits outside the padded column above so the row runs off
         both edges of the screen, as the arc needs it to. -->
    <!-- A sliver of vertical padding: overflow-hidden clips both axes (CSS
         won't let one be hidden and the other visible), and perspective makes
         the near edge of a yawed card project a few percent taller than its
         layout box, which this absorbs. -->
    <div
      ref="viewport"
      class="hero-rise mt-3 w-full cursor-grab overflow-hidden active:cursor-grabbing"
      style="padding-block: calc(var(--card-w) * 0.08)"
    >
      <div ref="track" class="flex w-max gap-0.5 will-change-transform">
        <div
          v-for="(src, i) in loopImages"
          :key="i"
          ref="cardEls"
          class="hero-card aspect-3/4 shrink-0 overflow-hidden rounded-2xl select-none"
          draggable="false"
          :style="{ width: 'var(--card-w)', backgroundColor: usePrimaryTint(50) }"
        >
          <!-- Sized at 2x the card's true slot (18vw) on purpose. @nuxt/image
               v2 derives srcset candidates from the vw breakpoints alone and
               the `densities` option produced no 2x entries, so the widest
               candidate was 276w — which Retina then upscaled into the soft
               image this replaced. Overstating `sizes` is what gets a
               big-enough candidate generated and picked. -->
          <NuxtImg
            :src="src"
            :alt="i === 0 ? HERO_ALT : ''"
            sizes="22rem md:40vw"
            quality="82"
            draggable="false"
            :loading="i === 0 ? 'eager' : 'lazy'"
            class="pointer-events-none h-full w-full object-cover"
          />
        </div>
      </div>
    </div>

    <!-- Keeps the site's CTA convention — solid primary resolving to accent on
         hover, same as every other booking prompt on the page. -->
    <a
      :href="practice.bookingHref"
      class="hero-rise mt-5 rounded-full bg-primary px-8 py-3.5 font-display text-sm font-semibold uppercase tracking-label text-white outline-none transition-colors duration-250 ease-out hover:bg-accent hover:text-primary focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
    >
      Book an appointment
    </a>
  </section>
</template>

<script setup lang="ts">
import gsap from 'gsap'
import { Observer } from 'gsap/Observer'
import { practice } from '../data/contact'

// One photograph, repeated across every card. The row is a texture rather than
// a gallery, so a single strong image reads more deliberately than a mixed set
// — and this one carries the whole proposition on its own: Dr Deesha and a
// patient, both relaxed, mid-appointment.
const IMAGES = [
  '/images/hero/consultation.webp',
]

// Only the first card is described. The rest are the same photograph repeating
// as decoration, and announcing it once per copy would be noise.
const HERO_ALT = 'Dr Deesha with a smiling patient in the treatment chair at Smart Smiles'

// Copies of the list laid end to end. Position starts a couple of copies in
// and wraps every copy width as it's dragged, so the window it can sweep
// always has content past both screen edges. Left at a fixed count this
// breaks on wide screens, where the card width clamp stops one copy from
// growing with the viewport.
const MIN_COPIES = 3
const copies = ref(MIN_COPIES)
const loopImages = computed(() => Array.from({ length: copies.value }, () => IMAGES).flat())

// Ring model — the viewer stands at the centre of a cylinder of cards and the
// row is the far wall sweeping past. A card's layout position maps linearly to
// a viewing angle ψ (±EDGE_ANGLE at the screen edges — constant marquee speed
// therefore means constant *angular* speed), and everything else falls out of
// the circle's geometry:
//
//   position — a tangent projection, blended with the flat layout by
//     TAN_BLEND. Pure tan is what a camera at the ring's centre actually
//     sees, but at these angles it starves the edges of cards; the blend
//     keeps the signature of circular motion — cards sweep fastest at the
//     edges (nearest the viewer) and slowest across the centre (far wall) —
//     at a strength the composition survives.
//   depth — from s(ψ) = cos(EDGE_ANGLE)/cos(ψ), the true size ratio for
//     points on a circle around the viewer projected to a flat screen —
//     deepest at the centre, surfacing to the natural plane at the edges —
//     then damped by DEPTH_STRENGTH: the optically exact shrink opens the
//     gaps between centre cards wider than the composition wants.
//   yaw — the viewing angle itself, damped by YAW_RATIO so edge cards read
//     as turning to face the centre without foreshortening into slivers.
//
// Past ±ARC_LIMIT a card keeps circling: depth goes negative (toward the
// viewer, growing) and the position mapping continues on the limit tangent's
// slope, so exits accelerate off rather than freezing at the edge pose.
const PERSPECTIVE = 1200
const EDGE_ANGLE = (50 * Math.PI) / 180
const TAN_BLEND = 0.18
const DEPTH_STRENGTH = 0.55
const YAW_RATIO = 0.7
const ARC_LIMIT = 1.1

// Position mapping t → screen (both in half-viewport units) and its slope.
const TAN_E = Math.tan(EDGE_ANGLE)
function ringMap(t: number) {
  return (1 - TAN_BLEND) * t + (TAN_BLEND * Math.tan(t * EDGE_ANGLE)) / TAN_E
}
function ringSlope(t: number) {
  const sec = 1 / Math.cos(t * EDGE_ANGLE)
  return 1 - TAN_BLEND + (TAN_BLEND * EDGE_ANGLE * sec * sec) / TAN_E
}

const heroRoot = ref<HTMLElement | null>(null)
const viewport = ref<HTMLElement | null>(null)
const track = ref<HTMLElement | null>(null)
const cardEls = ref<HTMLElement[]>([])

let ctx: gsap.Context | undefined
let motionQuery: MediaQueryList | undefined
let observer: Observer | undefined

// The row's single source of truth. A repeating tween can't absorb a drag
// (the drag and the tween would fight over the same x), so position is
// advanced by hand each frame instead: drift, drag delta and release inertia
// all just add into `pos`, and it wraps by one copy width to loop.
let pos = 0
let velocity = 0
let dragging = false
let copySpan = 0
let posMax = 0

// Per-second decay applied to release inertia — 0.06 leaves ~6% of the throw
// speed after a second, a firm glide rather than a long coast.
const FRICTION = 0.06
const MAX_THROW = 4000

// Measured once per layout rather than per frame: applyArc derives every card's
// position arithmetically from these, so the ticker never reads back from the
// DOM and never forces a layout.
let step = 0
let cardW = 0
let gapW = 0
let viewW = 0

function measure() {
  const first = cardEls.value[0]
  if (!first || !track.value || !viewport.value) return false
  cardW = first.offsetWidth
  gapW = Number.parseFloat(getComputedStyle(track.value).columnGap) || 0
  step = cardW + gapW
  viewW = viewport.value.clientWidth
  return step > 0 && viewW > 0
}

function wrapPos() {
  if (copySpan <= 0) return
  while (pos > posMax) pos -= copySpan
  while (pos <= posMax - copySpan) pos += copySpan
}

// Inertia and drag resolve here, once per frame. There is no ambient drift —
// the row holds still until it's dragged, then a release glides out on its
// throw velocity and settles.
function tick(_time: number, deltaMs: number) {
  if (!track.value || step === 0) return
  // Cap dt so a backgrounded tab doesn't resume with one enormous jump.
  const dt = Math.min(deltaMs, 50) / 1000

  if (!dragging) {
    // At rest: nothing to advance, nothing to redraw.
    if (Math.abs(velocity) <= 2) {
      velocity = 0
      return
    }
    pos += velocity * dt
    velocity *= FRICTION ** dt
  }

  wrapPos()
  gsap.set(track.value, { x: pos })
  applyArc()
}

function applyArc() {
  if (!track.value || step === 0) return
  const x = pos
  const half = viewW / 2
  const els = cardEls.value
  const n = els.length

  for (let i = 0; i < n; i++) {
    const centre = x + i * step + cardW / 2
    const raw = (centre - half) / half
    const t = gsap.utils.clamp(-ARC_LIMIT, ARC_LIMIT, raw)
    const psi = t * EDGE_ANGLE

    // Beyond the limit the mapping continues linearly on the limit tangent's
    // slope — cards keep their exit velocity instead of stalling off screen.
    const mapped
      = Math.abs(raw) <= ARC_LIMIT
        ? ringMap(raw)
        : Math.sign(raw) * (ringMap(ARC_LIMIT) + ringSlope(ARC_LIMIT) * (Math.abs(raw) - ARC_LIMIT))

    // Damped scale first, then back to the translateZ that produces it.
    const sFull = Math.cos(EDGE_ANGLE) / Math.cos(psi)
    const scale = 1 - DEPTH_STRENGTH * (1 - sFull)
    const depth = PERSPECTIVE * (1 / scale - 1)
    const yaw = (-t * EDGE_ANGLE * YAW_RATIO * 180) / Math.PI

    // Screen-space placement rides the CSS `translate` property, which
    // composes *outside* `transform`; inside it (as a translateX) the shift
    // would project through the perspective and squash yawed cards.
    els[i]!.style.translate = `${half + half * mapped - centre}px`
    els[i]!.style.transform = `perspective(${PERSPECTIVE}px) translateZ(${-depth}px) rotateY(${yaw}deg)`
  }
}

// Resize fires in bursts, and this function yields at nextTick — without a
// token the build that started first can resume after a later one has already
// installed its tween, leaving two running at once.
let buildId = 0

async function buildMarquee() {
  const id = ++buildId
  if (!measure()) return

  const copyW = step * IMAGES.length

  // The ring mapping only ever moves a card *outward* from its layout slot
  // (|ringMap(t)| ≥ (1 - TAN_BLEND)|t| and = |t| at the edges), so plain
  // copy margins cover the bleed: a two-copy lead-in on the left, the same
  // again plus the travel distance on the right.
  const startCopies = 2
  const need = Math.max(
    MIN_COPIES,
    startCopies + 2 + Math.ceil(viewW / copyW),
  )
  if (need !== copies.value) {
    copies.value = need
    await nextTick()
    if (id !== buildId || !measure()) return
  }

  // Park startCopies in, and let pos roam one copy width either side of that
  // before wrapping — the content repeats every copyW, so the wrap is
  // pixel-identical and invisible in both directions.
  copySpan = copyW
  posMax = -startCopies * copyW
  pos = posMax
  velocity = 0
  gsap.set(track.value, { x: pos })
  applyArc()
}

function prefersReducedMotion() {
  return !!motionQuery?.matches
}

function onResize() {
  buildMarquee()
}

// First-load entrance: the stack rises in source order. Reduced-motion
// visitors never enter here — the anti-FOUC rule below only hides these
// elements under no-preference, so for them everything is up at first paint.
function playIntro() {
  const el = heroRoot.value
  if (!el || prefersReducedMotion()) return

  ctx = gsap.context(() => {
    gsap.fromTo(
      '.hero-rise',
      { autoAlpha: 0, y: 26 },
      { autoAlpha: 1, y: 0, duration: 1.05, ease: 'expo.out', stagger: 0.09 },
    )
  }, el)
}

onMounted(() => {
  motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
  motionQuery.addEventListener('change', onResize)
  window.addEventListener('resize', onResize)

  buildMarquee()
  gsap.ticker.add(tick)
  playIntro()

  // Drag, on pointer and touch alike. Vertical gestures are left alone
  // (lockAxis + tolerance) so a thumb swiping down the page still scrolls
  // instead of snagging on the row.
  gsap.registerPlugin(Observer)
  observer = Observer.create({
    target: viewport.value,
    type: 'touch,pointer',
    dragMinimum: 3,
    tolerance: 10,
    lockAxis: true,
    onPress: () => {
      dragging = true
      velocity = 0
    },
    onDrag: (self) => {
      if (self.isDragging) pos += self.deltaX
    },
    onDragEnd: (self) => {
      dragging = false
      velocity = gsap.utils.clamp(-MAX_THROW, MAX_THROW, self.velocityX || 0)
    },
    onRelease: () => {
      dragging = false
    },
  })

  // Card widths are in vw, but the webfont landing can still reflow the column
  // above and shift the row; re-measure once it has.
  document.fonts?.ready.then(buildMarquee)
})

onUnmounted(() => {
  gsap.ticker.remove(tick)
  observer?.kill()
  ctx?.revert()
  motionQuery?.removeEventListener('change', onResize)
  window.removeEventListener('resize', onResize)
})
</script>

<style scoped>
/* The native HTML5 image drag fires on pointerdown and swallows the gesture
   before Observer's drag ever starts — the row simply wouldn't move. */
.hero-card img {
  -webkit-user-drag: none;
  user-select: none;
}

.hero-card {
  /* Set once here rather than per-frame in applyArc — the transform string it
     writes carries no origin, and centre is what makes the arc symmetric. */
  transform-origin: center center;
  will-change: transform;
}

/* Entrance start state — only where we'll animate. Reduced-motion visitors get
   the full stack at first paint, no JS required. */
@media (prefers-reduced-motion: no-preference) {
  .hero-rise {
    opacity: 0;
  }
}
</style>
