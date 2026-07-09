<template>
  <section class="relative z-20 bg-background text-foreground">

    <div class="mx-auto max-w-6xl px-4 pt-24 pb-10 sm:px-6 lg:pt-28">
      <p class="font-display text-xs font-semibold uppercase tracking-eyebrow text-primary">
        Experience
      </p>
      <h2 class="mt-5 font-serif font-normal leading-heading tracking-heading" style="font-size: clamp(2rem, 4vw, 3.25rem)">
        The path here.
      </h2>
      <p class="mt-4 max-w-md font-display text-base font-light leading-relaxed text-foreground/65">
        The short version of my apprenticeship, from the first lecture to the chair you'll sit in.
      </p>
    </div>

    <!-- Independently centred, not aligned to the header's max-w-6xl column
         — the row is wider than that column, so centring it (rather than
         starting it flush-left) keeps the whole group visually balanced on
         the page instead of looking pushed to one side. -->
    <div class="career-track overflow-x-clip px-2 pt-4 pb-24 sm:px-3 lg:pb-28">
      <div class="mx-auto flex w-full flex-col gap-5 lg:w-max lg:flex-row lg:gap-0">
        <article
          v-for="(step, i) in careerSteps"
          :key="step.id"
          tabindex="0"
          :aria-label="`${step.institution}, ${step.qualification}`"
          class="career-card group relative flex flex-col overflow-hidden rounded-xl border-y border-primary/10 bg-background outline-none lg:block lg:h-160 lg:w-140 lg:shrink-0 focus-visible:ring-2 focus-visible:ring-primary/40"
          :class="[
            i > 0 && 'lg:-ml-98',
            activeIndex === i && 'is-active',
            cardRadiusClass(i),
          ]"
          :style="cardStyle(i)"
          @mouseenter="hovered = i"
          @mouseleave="hovered = null"
          @focusin="hovered = i"
          @focusout="hovered = null"
        >
          <!-- Spine — always visible tab -->
          <div
            class="career-spine relative flex flex-row items-center justify-between gap-4 overflow-hidden border-b border-primary/10 p-5 lg:absolute lg:inset-y-0 lg:left-0 lg:w-42 lg:flex-col lg:items-start lg:justify-between lg:border-b-0 lg:border-r lg:p-6"
            :style="spineStyle(i)"
          >
            <!-- Oversized, faint tag running down the spine, its end pinned to the top -->
            <span
              aria-hidden="true"
              class="career-mark pointer-events-none absolute left-1/2 top-6 hidden font-serif font-normal uppercase leading-none text-white/25 lg:block"
            >
              {{ step.mark }}
            </span>
            <div class="relative z-10 text-right lg:mt-auto lg:text-left">
              <p class="font-display text-2xs font-semibold uppercase leading-snug tracking-label text-white">
                {{ step.qualification }}
              </p>
            </div>
            <p class="relative z-10 mt-1 font-display text-3xs uppercase tracking-label text-white/70">
              {{ step.year }}
            </p>
          </div>

          <!-- Content — revealed when active -->
          <div
            class="career-content flex flex-1 flex-col gap-5 p-5 lg:absolute lg:inset-y-0 lg:left-42 lg:right-0 lg:p-6"
            :style="{ opacity: activeIndex === i ? 1 : 0 }"
          >
            <div class="flex flex-wrap items-center gap-2">
              <p class="font-display text-2xs font-semibold uppercase leading-snug tracking-label text-primary">
                {{ step.institution }}
              </p>
            </div>

            <NuxtImg
              :src="step.image"
              :alt="`Dr Deesha during her time at ${step.institution}`"
              sizes="100vw lg:32vw"
              loading="lazy"
              class="career-img w-full rounded-lg bg-foreground/5 object-cover lg:min-h-0 lg:flex-1"
            />

            <p class="font-display text-sm font-light leading-relaxed text-foreground/75 lg:text-base">
              {{ step.description }}
            </p>

            <p class="mt-auto font-display text-2xs uppercase tracking-label text-primary/45">
              {{ step.location }}
            </p>
          </div>
        </article>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { careerSteps } from '../data/career'

/** How far the cards to the right of the active one slide to uncover it.
 *  Matches the card/spine overlap (560 − 168) plus a small gap. */
const REVEAL_SHIFT = 404

const hovered = ref<number | null>(null)
// Default to the current role being open; hover overrides it.
const activeIndex = computed(() => hovered.value ?? careerSteps.length - 1)

function cardStyle(i: number) {
  const active = activeIndex.value
  const transform = i > active ? `translateX(${REVEAL_SHIFT}px)` : 'translateX(0)'
  return { transform, zIndex: i === active ? 50 : i + 1 }
}

// Every card but the first overlaps the one before it (see `lg:-ml-98`
// above), so its rounded left corner sits on top of that card's flat body —
// the curve peels away from the seam and leaves a sliver of background
// showing through. Only the true outer edges of the row should be rounded:
// the first card's left side, and whichever card's right side is actually
// exposed (the last card, since nothing overlaps it, or the active one,
// since the cards after it have slid clear). Desktop-only — the mobile
// stack doesn't overlap, so every corner stays rounded there.
function cardRadiusClass(i: number) {
  const isFirst = i === 0
  const isLast = i === careerSteps.length - 1
  const isActive = activeIndex.value === i
  return [
    !isFirst && 'lg:rounded-l-none',
    !(isLast || isActive) && 'lg:rounded-r-none',
  ]
}

// Spine tint: primary diluted with white, starting at 60% primary and gaining
// 10 percentage points per step down the timeline (ending at 100% — full
// brand primary — for the current role). 60% was the point white spine text
// first tested legible, so starting the range there instead of lower down
// means every card clears that bar and the text can stay a single flat
// white throughout, rather than flipping between dark and light per card.
const SPINE_TINT_START = 60
const SPINE_TINT_STEP = 10

function spinePrimaryPct(i: number) {
  return SPINE_TINT_START + i * SPINE_TINT_STEP
}

function spineStyle(i: number) {
  return { backgroundColor: `color-mix(in oklab, var(--color-primary) ${spinePrimaryPct(i)}%, white)` }
}
</script>

<style scoped>
.career-card {
  transition:
    transform 0.55s cubic-bezier(0.22, 1, 0.36, 1),
    box-shadow 0.5s cubic-bezier(0.22, 1, 0.36, 1),
    border-radius 0.4s cubic-bezier(0.22, 1, 0.36, 1);
}
.career-content {
  transition: opacity 0.5s ease;
}

/* Elevation for the open card. Primary-tinted (not the navy --shadow-lift
   token) so it reads as a soft amethyst lift on this purple band rather than a
   muddy grey pool. Desktop only; the mobile stack neutralises it below. */
@media (min-width: 1024px) {
  .career-card.is-active {
    box-shadow: 0 26px 52px -26px rgb(60 0 97 / 0.3);
  }
}

/* Vertical spine tag: large enough to fill the column, faint enough (via the
   low opacity in the template) to sit behind the label without competing.
   Rotated about its end point (right-centre) so the word's END always lands
   at the pinned top offset, whatever its length, while staying centred in the
   column. The translate re-seats that end point at (left 50%, top 1.5rem). */
.career-mark {
  transform-origin: right center;
  transform: translate(-100%, -50%) rotate(-90deg);
  white-space: nowrap;
  font-size: 5.5rem;
  letter-spacing: 0.02em;
}

/* Portrait aspect on mobile; fills the card height on desktop. */
.career-img {
  aspect-ratio: 4 / 3;
}
@media (min-width: 1024px) {
  .career-img {
    aspect-ratio: auto;
  }
}

/* Stacked layout below lg: neutralise the interactive transforms. */
@media (max-width: 1023px) {
  .career-card {
    transform: none !important;
    box-shadow: none !important;
  }
  .career-content {
    opacity: 1 !important;
  }
}

@media (prefers-reduced-motion: reduce) {
  .career-card,
  .career-content {
    transition: none !important;
  }
}
</style>
