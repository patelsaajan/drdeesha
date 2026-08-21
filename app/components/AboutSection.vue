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
            <h2 class="m-0 mt-5 max-w-xl font-serif text-[clamp(2rem,3vw,2.75rem)] font-normal leading-heading tracking-heading">
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
                  class="font-serif text-[clamp(1.15rem,1.6vw,1.45rem)] font-normal leading-snug tracking-heading transition-colors duration-300"
                  :class="i === active ? 'text-foreground' : 'text-foreground/35 group-hover:text-foreground/60'"
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
              <h3 class="m-0 mt-4 max-w-xl font-serif text-[clamp(1.6rem,2.4vw,2.25rem)] font-normal leading-snug tracking-heading">
                {{ topic.heading }}
              </h3>
              <p
                v-for="(para, n) in topic.body"
                :key="n"
                class="m-0 mt-5 max-w-xl font-sans text-base font-light leading-relaxed text-foreground/80 lg:text-lg"
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

    <!-- Below lg: the same content as an accordion. A pinned scroll-jack on
         a phone is friction, not choreography — but four topics stacked open
         is also a long scroll before the page moves on, so the labels and
         hints stand as a scannable index and each body opens on demand. -->
    <div class="mx-auto max-w-5xl px-4 py-24 sm:px-6 lg:hidden">
      <header class="reveal max-w-2xl">
        <p class="m-0 font-display text-xs font-semibold uppercase tracking-eyebrow text-primary">
          About
        </p>
        <h2 class="m-0 mt-5 font-serif text-[clamp(2rem,4vw,3rem)] font-normal leading-heading tracking-heading">
          The details, if you want them.
        </h2>
      </header>

      <div class="mt-12">
        <article
          v-for="(topic, i) in aboutTopics"
          :key="topic.id"
          class="reveal border-t border-foreground/15"
        >
          <!-- The whole row is the control, heading included: h3 > button is
               the accordion pattern screen readers navigate by, and it keeps
               the label a real heading rather than a styled span. -->
          <h3 class="m-0">
            <button
              :id="`about-trigger-${topic.id}`"
              type="button"
              class="flex w-full cursor-pointer items-baseline gap-4 pt-8 pb-4 text-left outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-inset"
              :aria-expanded="openId === topic.id"
              :aria-controls="`about-panel-${topic.id}`"
              @click="toggle(topic.id)"
            >
              <span class="font-display text-xs font-semibold tracking-label text-primary tabular-nums">
                0{{ i + 1 }}
              </span>
              <span class="min-w-0 flex-1">
                <span class="block font-serif text-[clamp(1.35rem,2.4vw,1.9rem)] font-normal leading-snug tracking-heading">
                  {{ topic.label }}
                </span>
                <span class="mt-2 block font-display text-2xs font-semibold uppercase tracking-label text-foreground/50">
                  {{ topic.hint }}
                </span>
              </span>
              <!-- Plus folding into a minus — the same two-bar pseudo-element
                   device the mobile nav's menu glyph uses, so the page keeps
                   one vocabulary for "this control is open". self-center, not
                   baseline: it has no text of its own to sit a baseline on. -->
              <span
                class="about-glyph relative block size-3.5 shrink-0 self-center text-primary"
                :class="openId === topic.id && 'is-open'"
                aria-hidden="true"
              />
            </button>
          </h3>

          <div
            :id="`about-panel-${topic.id}`"
            role="region"
            :aria-labelledby="`about-trigger-${topic.id}`"
            class="about-panel grid"
            :class="openId === topic.id && 'is-open'"
          >
            <div class="min-h-0 overflow-hidden">
              <div class="pb-8">
                <p
                  v-for="(para, n) in topic.body"
                  :key="n"
                  class="m-0 mt-4 font-sans text-base font-light leading-relaxed text-foreground/80 first:mt-0"
                >
                  {{ para }}
                </p>
              </div>
            </div>
          </div>
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

// Mobile accordion. One open panel at a time is structural rather than
// enforced: a single id is the entire state, so opening one closes the last
// by construction and there is no set to keep consistent. Re-tapping the open
// topic collapses it. Opens on the first topic, which both teaches the
// affordance and matches where the desktop spotlight enters.
const openId = ref<string | null>(aboutTopics[0]?.id ?? null)

function toggle(id: string) {
  openId.value = openId.value === id ? null : id
}

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

/* Accordion panel. The row grows 0fr -> 1fr with the content clipped inside
   it — the same height device the mobile nav's menu fold uses, and for the
   same reason: `height: auto` isn't animatable, and a fixed max-height would
   either clip the longest topic or spend the tail of every transition
   coasting through empty space. Content fades a beat behind the growth so a
   half-open panel reads as arriving rather than as text sliced by the clip
   line. */
.about-panel {
  grid-template-rows: 0fr;
  transition: grid-template-rows 0.45s cubic-bezier(0.16, 1, 0.3, 1);
}
.about-panel.is-open {
  grid-template-rows: 1fr;
}
.about-panel > div {
  opacity: 0;
  transition: opacity 0.25s ease;
}
.about-panel.is-open > div {
  opacity: 1;
  transition-delay: 90ms;
}

/* Plus folding into a minus: the horizontal bar is permanent, the vertical
   one collapses into it. scaleY rather than a rotate so the two never sit
   at an angle mid-transition — this reads as a state, not a spin. */
.about-glyph::before,
.about-glyph::after {
  content: "";
  position: absolute;
  background: currentColor;
  transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}
.about-glyph::before {
  top: 50%;
  right: 0;
  left: 0;
  height: 1.5px;
  margin-top: -0.75px;
}
.about-glyph::after {
  top: 0;
  bottom: 0;
  left: 50%;
  width: 1.5px;
  margin-left: -0.75px;
}
.about-glyph.is-open::after {
  transform: scaleY(0);
}

@media (prefers-reduced-motion: reduce) {
  .about-slide,
  .about-panel,
  .about-panel > div,
  .about-glyph::before,
  .about-glyph::after {
    transition: none;
  }
}
</style>
