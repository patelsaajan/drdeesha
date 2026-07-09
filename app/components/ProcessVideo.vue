<template>
  <section id="process" ref="root" class="relative z-20 bg-background text-foreground">
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
          <!-- YouTube embed, cropped to cover like a native <video object-cover>
               would: `yt-cover` is a container-query context sized to the
               frame's own current box (whatever GSAP has resized it to,
               contained or full-screen), and the iframe inside is oversized
               off of that container's own cqw/cqh units using the standard
               16:9 cover-crop formula — vw/vh would only be correct once the
               frame has actually reached full-viewport size, not while it's
               still the small contained rest-state box. -->
          <div class="yt-cover absolute inset-0">
            <iframe
              v-if="showVideo"
              :src="youtubeSrc"
              title="Dr Deesha performing a composite restoration, in the chair"
              allow="autoplay; encrypted-media"
              frameborder="0"
              class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
              :class="reduce ? 'pointer-events-auto' : 'pointer-events-none'"
            />
          </div>

          <!-- Caption over a legibility scrim -->
          <div class="pointer-events-none absolute inset-x-0 bottom-0 bg-linear-to-t from-black/55 via-black/15 to-transparent p-6 sm:p-10 lg:p-14">
            <p class="font-display text-xs font-semibold uppercase tracking-eyebrow text-white/70">
              In the chair
            </p>
            <p class="mt-2 max-w-md font-serif font-normal leading-tight tracking-heading text-white" style="font-size: clamp(1.5rem, 3vw, 2.5rem)">
              A tooth, rebuilt.
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

const YOUTUBE_ID = 'GKZ3LZBOiLI'

const reduce = ref(false)
// Mounted only once the section is nearly in view (see the IntersectionObserver
// below), rather than at page load — the branding-flash fade delay in the
// styles below is timed off of this, so it needs to actually track when the
// visitor is about to see it, not when the page happened to load.
const showVideo = ref(false)

// `loop=1` only works for a single video if `playlist` repeats its own id.
// Autoplay/controls flip with `reduce`: motion-reduced visitors get a normal,
// pausable embed instead of one that starts playing itself.
const youtubeSrc = computed(() => {
  const params = new URLSearchParams({
    autoplay: reduce.value ? '0' : '1',
    mute: '1',
    loop: '1',
    playlist: YOUTUBE_ID,
    controls: reduce.value ? '1' : '0',
    modestbranding: '1',
    playsinline: '1',
    rel: '0',
    iv_load_policy: '3',
  })
  return `https://www.youtube-nocookie.com/embed/${YOUTUBE_ID}?${params}`
})

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

/* Crops the YouTube embed to cover its box the way a native
   <video object-cover> would. `container-type: size` makes `cqw`/`cqh`
   below track this element's own current size — the frame it sits in is
   resized by GSAP between a small contained rest state and a full-viewport
   grown one, so sizing off `vw`/`vh` (the viewport) would only be correct
   in the latter case. */
.yt-cover {
  container-type: size;
}
.yt-cover iframe {
  border: 0;
  /* Standard 16:9 cover-crop formula (16/9 ≈ 1.778, 9/16 = 0.5625), just
     expressed in container units instead of viewport ones. */
  width: 178cqh;
  height: 56.25cqw;
  min-width: 100%;
  min-height: 100%;
  /* YouTube briefly shows its title/channel overlay on load — required by
     their embed terms, can't be turned off via URL params. Rather than show
     that flash, stay invisible for the couple of seconds it's on screen
     (the video is already autoplaying muted underneath) and fade in once
     it's had time to auto-hide. */
  opacity: 0;
  animation: yt-reveal 0.5s ease forwards;
  animation-delay: 2s;
}

@keyframes yt-reveal {
  to {
    opacity: 1;
  }
}

@media (prefers-reduced-motion: reduce) {
  .yt-cover iframe {
    opacity: 1;
    animation: none;
  }
}
</style>
