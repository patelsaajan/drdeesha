<template>
  <!-- Shares the page-white ground of the Process section below, so the deep
       Meet panel above reads as one saturated block and the page returns to
       light from here down. -->
  <section id="about" ref="root" class="relative z-20 bg-background text-foreground">

    <!-- Desktop: a scroll spotlight. The section is given STEP extra viewport
         height per topic and this inner frame pins for the ride; scroll
         progress through the extra height picks the active topic, the rail on
         the left tracks it, and the panel on the right crossfades to match.
         Titles are also buttons — clicking one scrolls to the middle of its
         band, and the scrollspy takes it from there. -->
    <div
      class="hidden lg:block"
      :style="{ height: `calc(100dvh + ${aboutTopics.length * STEP_DVH}dvh)` }"
    >
      <div class="sticky top-0 flex h-dvh items-center overflow-hidden">
        <div class="mx-auto w-full max-w-6xl px-6">

          <!-- Title row — the header owns the full width on its own. -->
          <header>
            <p class="m-0 font-display text-xs font-semibold uppercase tracking-eyebrow text-primary">
              About
            </p>
            <h2 class="m-0 mt-5 max-w-xl font-serif font-normal leading-heading tracking-heading" style="font-size: clamp(2rem, 3vw, 2.75rem)">
              The details, if you want them.
            </h2>
          </header>

          <div class="mt-12 grid grid-cols-[minmax(0,2fr)_minmax(0,3fr)] items-start gap-x-16">

          <!-- Rail -->
          <div>
            <nav aria-label="About topics">
              <button
                v-for="(topic, i) in aboutTopics"
                :key="topic.id"
                type="button"
                class="group flex w-full cursor-pointer items-baseline gap-4 border-t border-foreground/10 py-4 text-left outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-inset"
                :aria-current="i === active ? 'true' : undefined"
                @click="jumpTo(i)"
              >
                <span
                  class="font-display text-xs font-semibold tracking-label tabular-nums transition-colors duration-300"
                  :class="i === active ? 'text-primary' : 'text-foreground/30'"
                >
                  0{{ i + 1 }}
                </span>
                <span
                  class="font-serif font-normal leading-snug tracking-heading transition-colors duration-300"
                  :class="i === active ? 'text-foreground' : 'text-foreground/35 group-hover:text-foreground/60'"
                  style="font-size: clamp(1.15rem, 1.6vw, 1.45rem)"
                >
                  {{ topic.label }}
                </span>
              </button>
            </nav>
          </div>

          <!-- Panel — topics stacked in one grid cell; the active one fades
               and rises in while the rest sit transparent underneath. The
               stack sizes the cell to the tallest topic, so the layout never
               shifts as they trade places. -->
          <div class="grid">
            <div
              v-for="(topic, i) in aboutTopics"
              :key="topic.id"
              class="about-slide col-start-1 row-start-1"
              :class="i === active && 'is-active'"
              :aria-hidden="i !== active"
            >
              <p class="m-0 font-display text-2xs font-semibold uppercase tracking-label text-foreground/50">
                {{ topic.hint }}
              </p>
              <h3 class="m-0 mt-4 max-w-xl font-serif font-normal leading-snug tracking-heading" style="font-size: clamp(1.6rem, 2.4vw, 2.25rem)">
                {{ topic.heading }}
              </h3>
              <p
                v-for="(para, n) in topic.body"
                :key="n"
                class="m-0 mt-5 max-w-xl font-display text-base font-light leading-relaxed text-foreground/80 lg:text-lg"
              >
                {{ para }}
              </p>
            </div>
          </div>
          </div>

          <!-- Below the content but inside the pinned frame, so it stays on
               screen for the whole ride rather than waiting for the release.
               Left-aligned, so it hangs from the same edge as the heading and
               the topic rail above it. -->
          <div class="mt-12 flex justify-start">
            <a
              :href="practice.bookingHref"
              class="inline-flex w-fit items-center rounded-lg bg-primary px-8 py-3.5 font-display text-sm font-semibold uppercase tracking-label text-white outline-none transition-colors duration-250 ease-out hover:bg-accent hover:text-primary focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
            >
              Book an appointment
            </a>
          </div>

        </div>
      </div>
    </div>

    <!-- Below lg: the open editorial stack. A pinned scroll-jack on a phone
         is friction, not choreography, so the same content simply reads top
         to bottom. -->
    <div class="mx-auto max-w-5xl px-4 py-24 sm:px-6 lg:hidden">
      <header class="reveal max-w-2xl">
        <p class="m-0 font-display text-xs font-semibold uppercase tracking-eyebrow text-primary">
          About
        </p>
        <h2 class="m-0 mt-5 font-serif font-normal leading-heading tracking-heading" style="font-size: clamp(2rem, 4vw, 3rem)">
          The details, if you want them.
        </h2>
      </header>

      <div class="mt-12">
        <article
          v-for="(topic, i) in aboutTopics"
          :key="topic.id"
          class="reveal border-t border-foreground/15 py-9"
        >
          <div class="flex items-baseline gap-4">
            <span class="font-display text-xs font-semibold tracking-label text-primary tabular-nums">
              0{{ i + 1 }}
            </span>
            <h3 class="m-0 min-w-0">
              <span class="block font-serif font-normal leading-snug tracking-heading" style="font-size: clamp(1.35rem, 2.4vw, 1.9rem)">
                {{ topic.label }}
              </span>
              <span class="mt-2 block font-display text-2xs font-semibold uppercase tracking-label text-foreground/50">
                {{ topic.hint }}
              </span>
            </h3>
          </div>
          <p
            v-for="(para, n) in topic.body"
            :key="n"
            class="m-0 mt-4 font-display text-base font-light leading-relaxed text-foreground/80"
          >
            {{ para }}
          </p>
        </article>
      </div>
    </div>


  </section>
</template>

<script setup lang="ts">
import { aboutTopics } from '../data/about'
import { practice } from '../data/contact'

// Extra scroll height per topic, in dvh. The pacing knob: each topic owns
// this much of the ride before the spotlight moves on.
const STEP_DVH = 55

const root = ref<HTMLElement | null>(null)
const active = ref(0)

useSectionReveal(root, { stagger: 0.12 })

// Scrollspy for the pin: progress through the section's extra height, cut
// into equal bands, one per topic. Plain rAF-coalesced scroll listener — the
// maths is a few subtractions, and Vue only re-renders when the band index
// actually changes.
let raf = 0
function onScroll() {
  if (raf) return
  raf = requestAnimationFrame(() => {
    raf = 0
    const el = root.value
    if (!el) return
    const rect = el.getBoundingClientRect()
    const denom = el.offsetHeight - window.innerHeight
    if (denom <= 0) return
    const p = Math.min(1, Math.max(0, -rect.top / denom))
    active.value = Math.min(aboutTopics.length - 1, Math.floor(p * aboutTopics.length))
  })
}

// A rail title scrolls to the middle of its own band, and the scrollspy
// takes it from there.
function jumpTo(i: number) {
  const el = root.value
  if (!el) return
  const denom = el.offsetHeight - window.innerHeight
  const top = window.scrollY + el.getBoundingClientRect().top
  window.scrollTo({ top: top + ((i + 0.5) / aboutTopics.length) * denom })
}

onMounted(() => {
  window.addEventListener('scroll', onScroll, { passive: true })
  window.addEventListener('resize', onScroll)
  onScroll()
})

onUnmounted(() => {
  window.removeEventListener('scroll', onScroll)
  window.removeEventListener('resize', onScroll)
  if (raf) cancelAnimationFrame(raf)
})
</script>

<style scoped>
/* Start hidden only where we'll animate; reduced-motion keeps everything visible. */
@media (prefers-reduced-motion: no-preference) {
  .reveal {
    opacity: 0;
  }
}

/* Panel crossfade: the outgoing topic just fades, the incoming one fades and
   rises — the small offset is what reads as "next", not a re-render. Inactive
   slides keep no pointer targets. */
.about-slide {
  opacity: 0;
  transform: translateY(14px);
  pointer-events: none;
  transition:
    opacity 0.35s ease,
    transform 0.55s cubic-bezier(0.16, 1, 0.3, 1);
}
.about-slide.is-active {
  opacity: 1;
  transform: none;
  pointer-events: auto;
  transition-delay: 90ms;
}

@media (prefers-reduced-motion: reduce) {
  .about-slide {
    transition: none;
  }
}
</style>
