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
       below the fold, so the dvh term caps the card's own height and the
       whole stack keeps fitting. The floor is low enough that a phone still
       fits the centre pair plus the laterals either side — at a larger floor
       only the two tall cards fit and the arch has nothing to read against. -->
  <section
    id="home"
    ref="heroRoot"
    class="hero-root sticky top-0 z-0 flex min-h-dvh flex-col items-center gap-6 overflow-hidden bg-background pb-28 lg:gap-8 lg:pb-10"
    style="padding-top: clamp(4rem, 9dvh, 6rem)"
  >
    <div class="flex w-full shrink-0 flex-col items-center gap-5 px-6 text-center">
      <!-- Accent pill. Text is primary, not white: accent sits at ~2:1 against
           white and fails AA, where primary on accent is ~7.6:1. -->
      <p class="hero-rise m-0 shrink-0 rounded-lg bg-accent/70 px-4 py-1.5 font-display text-2xs font-semibold uppercase tracking-label text-primary">
        New patients welcome
      </p>

      <h1
        class="hero-rise m-0 max-w-3xl shrink-0 font-serif font-normal leading-heading tracking-heading text-foreground"
        style="font-size: clamp(2rem, min(5vw, 7dvh), 4rem)"
      >
        Feel confident in your smile
      </h1>

      <p class="hero-rise m-0 max-w-xl shrink-0 font-serif text-base font-normal leading-relaxed text-foreground/70 lg:text-lg">
        General and cosmetic dentistry from Dr Deesha at {{ practice.name }} in
        {{ practice.location }}, delivered calmly, carefully, and at your pace.
      </p>
    </div>

    <!-- Full-bleed: sits outside the padded column above so the row runs off
         both edges of the screen, as the arc needs it to. -->
    <!-- flex-1 so this band takes whatever height the stack has left over,
         with items-center putting the row in the middle of it: the carousel
         then sits centred between the bio above and the CTA below, rather
         than hugging the bio with the slack pooling underneath.

         Vertical padding is symmetric: overflow-hidden clips both axes (CSS
         won't let one be hidden and the other visible), so this absorbs the
         few percent that cards past the screen edge project beyond their
         layout box. Equal top and bottom, or the padding itself would offset
         the centring the flex-1 band is doing. -->
    <div
      ref="viewport"
      class="hero-rise flex w-full flex-1 items-center overflow-hidden cursor-grab active:cursor-grabbing"
      style="padding-block: calc(var(--card-w) * 0.045)"
    >
      <div ref="track" class="flex w-max items-start gap-[9px] will-change-transform lg:gap-1" :style="{ marginBottom: `${-deadSpace}px` }">
        <!-- One photograph per card, chosen by its slot in PATTERN — each
             slot owns one photograph. Because the assignment is fixed rather
             than recomputed against the screen, no card ever swaps image and
             a single <img> each is enough.

             `sizes` is set at 2x the card's true slot on purpose. @nuxt/image
             v2 derives srcset candidates from the vw breakpoints alone and
             the `densities` option produced no 2x entries, so the widest
             candidate was 276w — which Retina then upscaled into a soft
             image. Overstating `sizes` is what gets a big-enough candidate
             generated and picked. -->
        <div
          v-for="i in cardCount"
          :key="i"
          ref="cardEls"
          class="hero-card relative shrink-0 overflow-hidden rounded-2xl select-none"
          draggable="false"
          :style="{
            width: 'var(--card-w)',
            aspectRatio: String(slotAspect[(i - 1) % SLOTS_PER_COPY]),
            backgroundColor: usePrimaryTint(50),
          }"
        >
          <NuxtImg
            :src="PATTERN[(i - 1) % SLOTS_PER_COPY]!.src"
            :alt="i <= SLOTS_PER_COPY ? PATTERN[(i - 1) % SLOTS_PER_COPY]!.alt : ''"
            sizes="28rem md:52vw"
            quality="82"
            draggable="false"
            :loading="i <= SLOTS_PER_COPY ? 'eager' : 'lazy'"
            class="pointer-events-none absolute inset-0 h-full w-full object-cover"
          />
        </div>
      </div>
    </div>

    <!-- Keeps the site's CTA convention — solid primary resolving to accent on
         hover, same as every other booking prompt on the page. Desktop only:
         the mobile layout already docks a Book Now button at the bottom edge,
         so a second one here is the same ask twice on a small screen. -->
    <a
      :href="practice.bookingHref"
      class="hero-rise hidden shrink-0 rounded-lg bg-primary px-8 py-3.5 lg:inline-block font-display text-sm font-semibold uppercase tracking-label text-white outline-none transition-colors duration-250 ease-out hover:bg-accent hover:text-primary focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
    >
      Book an appointment
    </a>
  </section>
</template>

<script setup lang="ts">
import gsap from 'gsap'
import { Observer } from 'gsap/Observer'
import { practice } from '../data/contact'

// The smile arch, as a fixed repeating pattern of six card slots, each with
// its own photograph. Dental anatomy, roughly: central incisors longest,
// laterals beside them shorter, canines longer again. `k` is the card's
// rendered height as a multiple of its width. The consultation portrait
// holds both centrals — the photograph that carries the proposition sits
// where the eye already is — and the practice's other moments fill the arch
// around it.
//
// Fixed to the cards rather than recomputed against the screen each frame, so
// the arch travels with the row when it's dragged instead of the cards
// changing shape underneath it. That's also why the pattern has to *repeat*:
// the loop wraps every SLOTS_PER_COPY cards, and a one-off arch would jump
// at the seam. Repeating it means the wrap stays invisible and dragging
// simply reveals the next set of teeth. Six slots, six distinct photographs,
// ordered so no two neighbours share an image — including across the wrap,
// where the last slot sits beside the first. Alts live here too, described
// once per photograph on the first copy; later copies repeat as decoration.
const PATTERN = [
  { k: 1.09, src: '/images/hero/treatment-in-progress.webp', alt: 'Dr Deesha in loupes and mask, working on a reclined patient' }, // canine — square but a little taller
  { k: 1.02, src: '/images/hero/treatment-room.webp', alt: 'The treatment room mid-appointment, Dr Deesha and a nurse at work' }, // lateral — square
  { k: 1.12, src: '/images/hero/deesha-with-patient.webp', alt: 'Dr Deesha with a smiling patient in the treatment chair at Smart Smiles' }, // central — tall
  { k: 1.12, src: '/images/hero/whitening-collection.webp', alt: 'A patient at the surgery door collecting a whitening kit' }, // central — tall
  { k: 1.02, src: '/images/hero/patient-thumbs-up.webp', alt: 'A patient giving a thumbs up from the chair, Dr Deesha beside him' }, // lateral — square
  { k: 1.09, src: '/images/hero/smiling-patient.webp', alt: 'Dr Deesha and a patient grinning side by side in the surgery' }, // canine
]
const SLOTS_PER_COPY = PATTERN.length

// Slot 2|3 is the seam the arch is centred on, so a slot's distance from the
// centre line, in card widths, is its offset from 2.5.
const SLOT_U = PATTERN.map((_, i) => Math.abs(i - (SLOTS_PER_COPY - 1) / 2))
// Cards laid end to end. Every card is now identical in content (both
// photographs, one revealed), so the repeating unit is a single card and the
// loop wraps every card width. Position starts a couple of units in and
// wraps as it's dragged, so the window it can sweep always has content past
// both screen edges. Left at a fixed count this breaks on wide screens,
// where the card width clamp stops a unit from growing with the viewport.
const MIN_COPIES = 3
const copies = ref(MIN_COPIES)
const cardCount = computed(() => copies.value * SLOTS_PER_COPY)

// width / height per slot. The ring shrinks centre cards to ~82% and leaves
// the outer ones near 100%, which cancelled the arch out when the ratios were
// applied raw — the outer cards came out tallest on screen despite the centre
// being tallest in layout. Each slot is therefore divided by the scale a card
// resting in that slot will be drawn at. Derived from the slot, never from a
// card's live position, so every card sharing a slot is identical and the
// wrap stays seamless. Recomputed on resize, since the scale depends on how
// many cards fit across the viewport.
const slotAspect = ref<number[]>(PATTERN.map(p => 1 / p.k))

// Layout height the tallest card claims but never fills. Cards project from
// a top anchor and the ring shrinks them, so a card's drawn height is its
// layout height times that scale — the difference is dead space hanging off
// the bottom of the row's box. Carried as a negative margin on the track so
// the box matches what's actually drawn, which is what lets the band centre
// the row on what the eye sees rather than on empty layout.
const deadSpace = ref(0)

// Mobile runs one dominant card, so the arch's height variation has nothing
// to play against — every slot takes this one ratio instead, and the row
// centres on a card rather than on the seam between the two centrals.
const MOBILE_K = 1.25
const isDesktop = useIsDesktop()
const slotK = (i: number) => (isDesktop.value ? PATTERN[i]!.k : MOBILE_K)

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
const TAN_BLEND = 0.1
const DEPTH_STRENGTH = 0.32
const YAW_RATIO = 0.7
const ARC_LIMIT = 1.1

// Position mapping t → screen (both in half-viewport units) and its slope.
const TAN_E = Math.tan(EDGE_ANGLE)
function ringMap(t: number) {
  return (1 - TAN_BLEND) * t + (TAN_BLEND * Math.tan(t * EDGE_ANGLE)) / TAN_E
}
// The ring's own scaling at a viewing angle: the exact cos ratio, damped.
function ringScale(psi: number) {
  return 1 - DEPTH_STRENGTH * (1 - Math.cos(EDGE_ANGLE) / Math.cos(psi))
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
  const flat = !isDesktop.value

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
    const depth = PERSPECTIVE * (1 / ringScale(psi) - 1)
    const yaw = (-t * EDGE_ANGLE * YAW_RATIO * 180) / Math.PI

    // Screen-space placement rides the CSS `translate` property, which
    // composes *outside* `transform`; inside it (as a translateX) the shift
    // would project through the perspective and squash yawed cards.
    if (flat) {
      // Mobile is a plain filmstrip: one card holding the frame with its
      // neighbours peeking in. The ring's spread would throw those
      // neighbours clean off a 390px screen, and its yaw and depth read as
      // distortion rather than curvature at this size.
      els[i]!.style.translate = '0px'
      els[i]!.style.transform = 'none'
      continue
    }

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

  const copyW = step * SLOTS_PER_COPY
  const half = viewW / 2

  // The ring mapping only ever moves a card *outward* from its layout slot
  // (|ringMap(t)| ≥ (1 - TAN_BLEND)|t| and = |t| at the edges), so plain
  // copy margins cover the bleed: a two-copy lead-in on the left, the same
  // again plus the travel distance on the right.
  const startCopies = 2
  const need = Math.max(
    MIN_COPIES,
    startCopies + 1 + Math.ceil(viewW / copyW),
  )
  if (need !== copies.value) {
    copies.value = need
    await nextTick()
    if (id !== buildId || !measure()) return
  }

  // Park startCopies in, and let pos roam one copy width either side of that
  // before wrapping — the content repeats every copyW, so the wrap is
  // pixel-identical and invisible in both directions.
  //
  // The start is nudged so the *seam between two cards* lands on the centre
  // line, which is what puts a symmetric pair either side of it rather than
  // one card dead centre and the arch sitting off-axis. Alignment survives
  // wrapping: the row repeats every copyW, so shifting by a whole copy only
  // relabels which card is which.
  // Each slot's aspect, corrected for the scale a card resting there is drawn
  // at — without this the ring's foreshortening cancels the arch out, and the
  // outer cards come out tallest on screen despite the centre being tallest
  // in layout. Derived from the slot, never from a card's live position, so
  // every card sharing a slot is identical and the wrap stays seamless.
  slotAspect.value = PATTERN.map((_, i) => {
    if (!isDesktop.value) return 1 / slotK(i)
    const t = gsap.utils.clamp(-ARC_LIMIT, ARC_LIMIT, (SLOT_U[i]! * step) / half)
    return ringScale(t * EDGE_ANGLE) / slotK(i)
  })

  // Tallest layout box vs tallest drawn card, from the same slot maths above.
  const layoutH = PATTERN.map((_, i) => cardW / slotAspect.value[i]!)
  const drawnH = PATTERN.map((_, i) => layoutH[i]! * (slotAspect.value[i]! * slotK(i)))
  deadSpace.value = isDesktop.value
    ? Math.max(0, Math.max(...layoutH) - Math.max(...drawnH))
    : 0

  copySpan = copyW
  // Land the seam between the two centrals on the centre line, so the arch
  // sits symmetrically about it rather than one card dead centre.
  const base = -startCopies * copyW
  // Desktop lands the seam between the two centrals on the centre line, so
  // the arch sits symmetrically about it. Mobile lands a card's own centre
  // there instead — with one card holding the frame, a seam would split the
  // view between two half-cards.
  const anchor = isDesktop.value ? (SLOTS_PER_COPY - 1) / 2 : Math.floor(SLOTS_PER_COPY / 2)
  const aligned = half - cardW / 2 - anchor * step
  posMax = aligned - Math.round((aligned - base) / copyW) * copyW
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
  watch(isDesktop, () => buildMarquee())

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

/* Mobile shows one card holding most of the frame with its neighbours
   peeking in either side — the arch needs six cards across to read, and a
   phone can only fit two at a legible size. Desktop keeps the dvh-capped
   clamp so the row can't outgrow a short laptop. */
.hero-root {
  --card-w: min(72vw, 46dvh);
}

@media (min-width: 1024px) {
  .hero-root {
    --card-w: clamp(9.5rem, min(26vw, 33dvh), 40rem);
  }
}

.hero-card {
  /* Placeholder only — applyArc sets the real value on the first frame. It's
     updated continuously rather than transitioned: the profile is a smooth
     function of position, so the value already animates itself and a
     transition on top would just lag it. Nothing recomputes while the row is
     at rest (tick returns early), so this costs nothing until a drag. */
  aspect-ratio: 1 / 1;
}

/* Mobile shows one card holding most of the frame with its neighbours
   peeking in either side — the arch needs six cards across to read, and a
   phone can only fit two at a legible size. Desktop keeps the dvh-capped
   clamp so the row can't outgrow a short laptop. */
.hero-root {
  --card-w: min(72vw, 46dvh);
}

@media (min-width: 1024px) {
  .hero-root {
    --card-w: clamp(9.5rem, min(26vw, 33dvh), 40rem);
  }
}

.hero-card {
  /* Set once here rather than per-frame in applyArc — the transform string
     it writes carries no origin. Top-anchored: the perspective projects a
     card about its origin, so with a centre origin the deep middle cards
     shrank equally up and down and their rendered top edges sagged below the
     outer cards' despite items-start aligning the layout boxes. Anchoring at
     the top makes every card project downward only, and the row's top edge
     holds as one line. x stays 50% so yaw and the seam-centring math are
     untouched. */
  transform-origin: 50% 0;
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
