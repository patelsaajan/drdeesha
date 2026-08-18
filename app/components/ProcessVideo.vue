<template>
  <!-- Desktop only. Hiding it below lg also spares the download: the <video>
       is mounted by an IntersectionObserver when the section nears the
       viewport, and a display:none section never intersects. -->
  <section id="process" ref="root" class="relative z-20 hidden bg-background text-foreground lg:block">
    <div class="mx-auto max-w-6xl px-4 py-24 sm:px-6 lg:py-28">
      <!-- Pin anchor: reserves the section's normal contained footprint and
           drives the scroll timing. GSAP's `pin` locks a `max-width`/
           `max-height` onto whatever it pins (to protect the pin spacer's
           box), which silently clamps any attempt to grow that same element
           past its resting size — so the box that actually grows (`frame`)
           is a separate, absolutely positioned child instead of the pin
           target itself. -->
      <div ref="pinAnchor" class="relative w-full" style="aspect-ratio: 16 / 9">
        <div
          ref="frame"
          class="reveal absolute inset-0 z-30 overflow-hidden rounded-xl bg-foreground"
        >
          <!-- Self-hosted file rather than an embed, so object-cover does the
               cropping natively at whatever size GSAP has the frame at — the
               container-query trick this used to need existed only because an
               iframe can't be object-fit. Motion-reduced visitors get a
               normal, pausable player instead of one that starts itself. -->
          <video
            v-if="showVideo"
            :src="VIDEO_SRC"
            :autoplay="!reduce"
            :controls="reduce"
            :class="reduce ? 'pointer-events-auto' : 'pointer-events-none'"
            class="absolute inset-0 h-full w-full object-cover"
            muted
            loop
            playsinline
            preload="auto"
            aria-label="Dr Deesha performing a composite restoration, in the chair"
            @loadedmetadata="startPlayback"
          />

        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

const VIDEO_SRC = '/images/cases/case-video.mp4'

const reduce = ref(false)
// Mounted only once the section is nearly in view (see the IntersectionObserver
// below) rather than at page load — this is a ~5MB file well below the fold,
// and `preload="auto"` on it would otherwise start fetching immediately.
const showVideo = ref(false)

// Belt-and-braces on autoplay. Browsers refuse to autoplay unless the element
// is muted at the moment play is attempted, and the `muted` attribute alone
// is historically unreliable through a framework's render — so set the
// property directly and kick playback off, swallowing the rejection that a
// stricter autoplay policy would hand back.
function startPlayback(e: Event) {
  const el = e.target as HTMLVideoElement
  el.muted = true
  if (!reduce.value) el.play().catch(() => {})
}

const root = ref<HTMLElement | null>(null)
const pinAnchor = ref<HTMLElement | null>(null)
const frame = ref<HTMLElement | null>(null)
let ctx: gsap.Context | undefined
let videoObserver: IntersectionObserver | undefined

const RADIUS = 12 // px, matches rounded-xl so the corners flatten out smoothly as it grows

onMounted(() => {
  reduce.value = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  const anchorEl = pinAnchor.value
  const frameEl = frame.value
  const sectionEl = root.value
  if (!anchorEl || !frameEl || !sectionEl) return

  // Loads the embed a little before it's actually on screen, not at page
  // load — this section can sit well below the fold.
  videoObserver = new IntersectionObserver(
    ([entry], obs) => {
      if (!entry?.isIntersecting) return
      showVideo.value = true
      obs.disconnect()
    },
    { rootMargin: '600px 0px' },
  )
  videoObserver.observe(anchorEl)

  if (reduce.value) {
    // No scroll-jacking: it just sits in its normal contained spot.
    gsap.set(frameEl, { autoAlpha: 1 })
    return
  }

  gsap.registerPlugin(ScrollTrigger)
  // autoAlpha:1 clears the CSS opacity:0 (anti-FOUC) once JS is in control.
  gsap.set(frameEl, { autoAlpha: 1 })

  ctx = gsap.context(() => {
    // Phase 1 — grow while it scrolls into view. Un-pinned and scrubbed, so
    // `frame` (absolutely positioned inside the never-resized anchor) expands
    // in step with natural scroll: it starts growing the moment the anchor
    // enters the lower viewport and is exactly full-screen when the anchor's
    // top edge reaches the top of the screen. `left` is tweened alongside
    // `width` so both cross zero/100vw together; since `frame` starts flush
    // with the anchor's left edge, shifting `left` by the anchor's own offset
    // from the viewport edge is just enough to reach the screen edge as it
    // widens to 100vw. `invalidateOnRefresh` + function-based values re-measure
    // the resting rect on resize.
    gsap.fromTo(frameEl, {
      left: 0,
      width: () => anchorEl.getBoundingClientRect().width,
      height: () => anchorEl.getBoundingClientRect().height,
      borderRadius: RADIUS,
    }, {
      left: () => -anchorEl.getBoundingClientRect().left,
      width: '100vw',
      height: '100dvh',
      borderRadius: 0,
      ease: 'none',
      scrollTrigger: {
        trigger: anchorEl,
        start: 'top 85%',
        end: 'top top',
        scrub: 0.4,
        invalidateOnRefresh: true,
      },
    })

    // Phase 2 — hold it full-screen for a beat, then release into the next
    // section. Pinning only starts once phase 1 has already filled the screen,
    // so the grow reads as part of the scroll-in, not a separate pinned event.
    ScrollTrigger.create({
      trigger: anchorEl,
      start: 'top top',
      end: '+=100%',
      pin: anchorEl,
      pinSpacing: true,
      anticipatePin: 1,
      invalidateOnRefresh: true,
    })
  }, sectionEl)
})

onUnmounted(() => {
  ctx?.revert()
  videoObserver?.disconnect()
})
</script>

<style scoped>
/* Avoid a flash before GSAP takes over on capable displays. */
@media (prefers-reduced-motion: no-preference) {
  .reveal {
    opacity: 0;
  }
}

</style>
