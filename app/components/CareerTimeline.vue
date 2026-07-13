<template>
  <section id="experience" class="relative z-20 bg-background text-foreground">

    <div ref="header" class="mx-auto max-w-6xl px-4 pt-24 pb-10 sm:px-6 lg:pt-28">
      <p class="reveal font-display text-xs font-semibold uppercase tracking-eyebrow text-primary">
        Experience
      </p>
      <h2 class="reveal mt-5 font-serif font-normal leading-heading tracking-heading" style="font-size: clamp(2rem, 4vw, 3.25rem)">
        The path here.
      </h2>
      <p class="reveal mt-4 max-w-md font-display text-base font-light leading-relaxed text-foreground/65">
        The short version of my apprenticeship, from the first lecture to the chair you'll sit in.
      </p>
    </div>

    <!-- Independently centred, not aligned to the header's max-w-6xl column
         — the row is wider than that column, so centring it (rather than
         starting it flush-left) keeps the whole group visually balanced on
         the page instead of looking pushed to one side. -->
    <!-- Below lg the same deck runs vertically: every spine stays visible as
         a stacked tab inside one rounded frame, and tapping one folds its
         card open in place — the thumb's version of the desktop hover-peel.
         One card is always open (the current role by default). -->
    <div ref="track" class="career-track overflow-x-clip px-4 pt-4 pb-24 sm:px-6 lg:px-3 lg:pb-28">
      <div class="reveal mx-auto flex w-full flex-col overflow-hidden rounded-xl border border-primary/10 lg:w-max lg:flex-row lg:overflow-visible lg:rounded-none lg:border-0">
        <article
          v-for="(step, i) in careerSteps"
          :key="step.id"
          tabindex="0"
          :aria-label="`${step.institution}, ${step.qualification}`"
          class="career-card group relative flex flex-col overflow-hidden bg-background outline-none lg:block lg:h-160 lg:w-140 lg:shrink-0 lg:rounded-xl lg:border-y lg:border-primary/10 focus-visible:ring-2 focus-visible:ring-primary/40"
          :class="[
            i > 0 && 'lg:-ml-98',
            activeIndex === i && 'is-active',
            cardRadiusClass(i),
          ]"
          :style="cardStyle(i)"
          @click="hovered = i"
          @mouseenter="hovered = i"
          @mouseleave="hovered = null"
          @focusin="hovered = i"
          @focusout="hovered = null"
        >
          <!-- Spine — always visible tab. The border-r divider only makes sense
               once this card is open (marking the spine/content boundary) —
               left on unconditionally, it renders on every stacked card and
               shows up as a faint line right at the overlap seam.
               Width overdraws the 10.5rem visible strip by 1px: the next
               card's left edge lands exactly on this spine's right edge, and
               subpixel rem->px rounding can leave a hairline gap there — the
               overdraw makes any such gap show spine tint instead of the
               card's white body peeking through as a white seam. -->
          <div
            class="career-spine relative flex flex-row items-center justify-between gap-4 overflow-hidden border-b border-primary/10 p-5 lg:absolute lg:inset-y-0 lg:left-0 lg:w-[calc(10.5rem+1px)] lg:flex-col lg:items-start lg:justify-between lg:border-b-0 lg:p-6"
            :class="[
              activeIndex === i && 'lg:border-r',
              i === careerSteps.length - 1 && 'border-b-0',
            ]"
            :style="spineStyle(i)"
          >
            <!-- Oversized, faint tag running down the spine, its end pinned to the top -->
            <span
              aria-hidden="true"
              class="career-mark pointer-events-none absolute left-1/2 top-6 hidden font-serif font-normal uppercase leading-none text-white/25 lg:block"
            >
              {{ step.mark }}
            </span>
            <div class="relative z-10 lg:mt-auto">
              <p class="font-display text-2xs font-semibold uppercase leading-snug tracking-label text-white">
                {{ step.qualification }}
              </p>
            </div>
            <div class="relative z-10 flex shrink-0 items-center gap-3 lg:mt-1">
              <p class="font-display text-3xs uppercase tracking-label text-white/70">
                {{ step.year }}
              </p>
              <!-- Mobile-only open/close cue; the fold below does the actual work -->
              <span
                aria-hidden="true"
                class="career-plus font-display text-lg font-light leading-none text-white/80 lg:hidden"
                :class="activeIndex === i && 'is-open'"
              >+</span>
            </div>
          </div>

          <!-- Content — revealed when active. On mobile a grid-row fold
               (0fr -> 1fr, the animatable version of height:auto) collapses
               it under the spine; on desktop both wrappers dissolve to
               display:contents and the absolute positioning takes over. -->
          <div class="career-fold" :class="activeIndex === i && 'is-open'">
            <div class="career-fold-clip">
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
            </div>
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
// since the cards after it have slid clear). Desktop-only — on mobile the
// cards sit square inside the deck's own rounded, clipped frame.
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
  return { backgroundColor: usePrimaryTint(spinePrimaryPct(i)) }
}

// Header entrance — same reveal treatment as every other section header.
const header = ref<HTMLElement | null>(null)
useSectionReveal(header)

// The deck gets its own observer rather than riding the header's: the
// section is tall enough that a single section-level trigger fires while
// the deck is still below the fold, playing its entrance unseen. Observed
// on its own, it rises as one unit the moment it actually shows up.
const track = ref<HTMLElement | null>(null)
useSectionReveal(track)
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

/* Mobile fold: a grid row is the animatable stand-in for height:auto, so
   each card's content collapses to nothing under its spine and unfolds in
   place when tapped. On desktop both wrappers get out of the way entirely
   (display:contents) and the content's absolute positioning takes over. */
@media (max-width: 1023px) {
  .career-fold {
    display: grid;
    grid-template-rows: 0fr;
    transition: grid-template-rows 0.55s cubic-bezier(0.22, 1, 0.36, 1);
  }
  .career-fold.is-open {
    grid-template-rows: 1fr;
  }
  .career-fold-clip {
    overflow: hidden;
    min-height: 0;
  }
}
@media (min-width: 1024px) {
  .career-fold,
  .career-fold-clip {
    display: contents;
  }
}

.career-plus {
  transition: transform 0.4s cubic-bezier(0.22, 1, 0.36, 1);
}
.career-plus.is-open {
  transform: rotate(45deg);
}

/* Elevation for the open card — the shared card token (now primary-tinted
   site-wide). Desktop only; the mobile stack neutralises it below. */
@media (min-width: 1024px) {
  .career-card.is-active {
    box-shadow: var(--shadow-card);
  }
}

/* Avoid a flash of un-animated header before GSAP takes over. */
@media (prefers-reduced-motion: no-preference) {
  .reveal {
    opacity: 0;
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

/* Stacked layout below lg: neutralise the desktop slide transforms — the
   fold above carries the open/close motion instead. */
@media (max-width: 1023px) {
  .career-card {
    transform: none !important;
    box-shadow: none !important;
  }
}

@media (prefers-reduced-motion: reduce) {
  .career-card,
  .career-content,
  .career-fold,
  .career-plus {
    transition: none !important;
  }
}
</style>
