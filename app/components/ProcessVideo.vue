<template>
  <!-- Full-screen video overlay pinned over the section it lives in (Case Studies).
       As you keep scrolling past the cards, the section pins and this slides across
       from the right, then releases into whatever comes next. -->
  <div ref="root" class="pointer-events-none absolute inset-x-0 bottom-0 z-30 h-dvh overflow-hidden">
    <div ref="panel" class="reveal-right pointer-events-auto relative h-full w-full overflow-hidden bg-foreground">

      <!-- Real clip: flip `hasVideo` to true once public/videos/process.mp4 exists. -->
      <video
        v-if="hasVideo"
        ref="video"
        class="h-full w-full object-cover"
        :autoplay="!reduce"
        muted
        loop
        playsinline
        preload="metadata"
        :controls="reduce"
        poster="/images/process-poster.svg"
      >
        <source :src="videoSrc" type="video/mp4">
      </video>

      <!-- Placeholder: animated brand wash while there's no footage yet. -->
      <div v-else class="video-placeholder absolute inset-0">
        <div class="drift absolute" />
        <div class="absolute inset-0 grid place-items-center">
          <div class="flex flex-col items-center gap-4 text-center">
            <svg width="72" height="72" viewBox="0 0 72 72" fill="none" aria-hidden="true">
              <circle cx="36" cy="36" r="35" stroke="#aeb9c6" stroke-width="1.5" />
              <path d="M30 26 L48 36 L30 46 Z" fill="#aeb9c6" />
            </svg>
            <span class="font-display text-2xs font-semibold uppercase tracking-eyebrow text-foreground/40">
              Footage to follow
            </span>
          </div>
        </div>
      </div>

      <!-- Caption over a legibility scrim -->
      <div class="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/55 via-black/15 to-transparent p-6 sm:p-10 lg:p-14">
        <p class="font-display text-xs font-semibold uppercase tracking-eyebrow text-white/80">
          In the chair
        </p>
        <p class="mt-2 max-w-md font-serif font-normal leading-tight tracking-heading text-white" style="font-size: clamp(1.5rem, 3vw, 2.5rem)">
          A tooth, rebuilt.
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

// Set to true once the real clip lives at public/videos/process.mp4.
const hasVideo = false
// Dynamic binding (not a static `src`) so Vite doesn't try to resolve it as an
// import before the file exists.
const videoSrc = '/videos/process.mp4'

const video = ref<HTMLVideoElement | null>(null)
const reduce = ref(false)

const root = ref<HTMLElement | null>(null)
const panel = ref<HTMLElement | null>(null)
let ctx: gsap.Context | undefined

onMounted(() => {
  reduce.value = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const videoEl = video.value
  if (videoEl) {
    // Vue can be unreliable setting `muted` as an attribute; enforce it for autoplay.
    videoEl.muted = true
    if (reduce.value) videoEl.pause()
  }

  const panelEl = panel.value
  const sectionEl = root.value?.closest('section')
  if (!panelEl || !sectionEl) return

  gsap.registerPlugin(ScrollTrigger)
  // autoAlpha:1 clears the CSS opacity:0 (anti-FOUC) once JS is in control.
  gsap.set(panelEl, { xPercent: 100, autoAlpha: 1 })

  ctx = gsap.context(() => {
    if (reduce.value) {
      // No scroll-jacking: just slide it in once it scrolls into view.
      ScrollTrigger.create({
        trigger: sectionEl,
        start: 'bottom bottom',
        once: true,
        onEnter: () => gsap.to(panelEl, { xPercent: 0, duration: 0.6, ease: 'expo.out' }),
      })
      return
    }

    // Pin the section and scrub the video across it as you keep scrolling.
    gsap.to(panelEl, {
      xPercent: 0,
      ease: 'none',
      scrollTrigger: {
        trigger: sectionEl,
        start: 'bottom bottom',
        end: '+=100%',
        pin: true,
        pinSpacing: true,
        anticipatePin: 1,
        scrub: 0.4,
      },
    })
  }, sectionEl)
})

onUnmounted(() => {
  ctx?.revert()
})
</script>

<style scoped>
/* Avoid a flash before GSAP takes over on capable displays. */
@media (prefers-reduced-motion: no-preference) {
  .reveal-right {
    opacity: 0;
  }
}

.video-placeholder {
  background-color: #e7ebf1;
}
.video-placeholder .drift {
  inset: -15%;
  background:
    radial-gradient(55% 55% at 22% 28%, #f2f5f9, transparent 70%),
    radial-gradient(45% 45% at 82% 72%, #d3dbe6, transparent 70%),
    linear-gradient(125deg, #e9edf2 0%, #dde5ee 100%);
  will-change: transform;
  animation: drift 18s ease-in-out infinite;
}

@keyframes drift {
  0% {
    transform: translate3d(-3%, -2%, 0) scale(1.1);
  }
  50% {
    transform: translate3d(3%, 2%, 0) scale(1.16);
  }
  100% {
    transform: translate3d(-3%, -2%, 0) scale(1.1);
  }
}

@media (prefers-reduced-motion: reduce) {
  .video-placeholder .drift {
    animation: none;
  }
}
</style>
