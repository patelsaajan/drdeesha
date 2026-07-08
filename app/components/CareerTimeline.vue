<template>
  <section class="relative z-20 bg-background text-foreground">

    <div class="px-4 pt-24 pb-10 sm:px-6 lg:pt-28">
      <p class="font-display text-xs font-semibold uppercase tracking-eyebrow text-primary">
        Experience
      </p>
      <h2 class="mt-5 font-serif font-normal leading-heading tracking-heading" style="font-size: clamp(2rem, 4vw, 3.25rem)">
        The path here.
      </h2>
      <p class="mt-4 max-w-md font-display text-base font-light leading-relaxed text-foreground/65">
        The short version of a long apprenticeship, from the first lecture to the chair you'll sit in.
      </p>
    </div>

    <div class="career-track overflow-x-hidden px-4 pt-4 pb-24 sm:px-6 lg:pb-28">
      <div class="mx-auto flex w-full flex-col gap-5 lg:w-max lg:flex-row lg:gap-0">
        <article
          v-for="(step, i) in careerSteps"
          :key="step.id"
          tabindex="0"
          :aria-label="`${step.institution}, ${step.qualification}`"
          class="career-card group relative flex flex-col rounded-xl border border-foreground/10 bg-background outline-none lg:block lg:h-160 lg:w-140 lg:shrink-0 focus-visible:ring-2 focus-visible:ring-primary/40"
          :class="[
            i > 0 && 'lg:-ml-98',
            activeIndex === i && 'is-active lg:shadow-lift',
          ]"
          :style="cardStyle(i)"
          @mouseenter="hovered = i"
          @mouseleave="hovered = null"
          @focusin="hovered = i"
          @focusout="hovered = null"
        >
          <!-- Spine — always visible tab -->
          <div class="career-spine flex flex-row items-center justify-between gap-4 border-b border-foreground/10 p-5 lg:absolute lg:inset-y-0 lg:left-0 lg:w-42 lg:flex-col lg:items-start lg:justify-between lg:border-b-0 lg:border-r lg:p-6">
            <span class="font-serif text-3xl leading-none text-foreground/25 lg:text-6xl">{{ pad(i) }}</span>
            <div class="text-right lg:mt-auto lg:text-left">
              <p class="font-display text-2xs font-semibold uppercase leading-snug tracking-label text-foreground">
                {{ step.institution }}
              </p>
              <p class="mt-1 font-display text-3xs uppercase tracking-label text-foreground/45">
                {{ step.year }}
              </p>
            </div>
          </div>

          <!-- Content — revealed when active -->
          <div
            class="career-content flex flex-1 flex-col gap-5 p-5 lg:absolute lg:inset-y-0 lg:left-42 lg:right-0 lg:p-8"
            :style="{ opacity: activeIndex === i ? 1 : 0 }"
          >
            <div class="flex flex-wrap items-center gap-2">
              <span
                v-if="step.current"
                class="inline-block rounded-full bg-primary/15 px-2 py-0.5 font-display text-3xs font-semibold uppercase tracking-label text-primary"
              >
                Now
              </span>
              <p class="font-display text-2xs font-semibold uppercase leading-snug tracking-label text-primary">
                {{ step.qualification }}
              </p>
            </div>

            <img
              :src="step.image"
              :alt="`Dr Deesha during her time at ${step.institution}`"
              loading="lazy"
              class="career-img w-full rounded-lg bg-foreground/5 object-cover lg:min-h-0 lg:flex-1"
            >

            <p class="font-display text-sm font-light leading-relaxed text-foreground/75 lg:text-base">
              {{ step.description }}
            </p>

            <p class="mt-auto font-display text-2xs uppercase tracking-label text-foreground/40">
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

function pad(i: number) {
  return String(i + 1).padStart(2, '0')
}

function cardStyle(i: number) {
  const active = activeIndex.value
  const transform
    = i > active ? `translateX(${REVEAL_SHIFT}px)` : i === active ? 'translateY(-6px)' : 'translateX(0)'
  return { transform, zIndex: i === active ? 50 : i + 1 }
}
</script>

<style scoped>
.career-card {
  transition:
    transform 0.55s cubic-bezier(0.22, 1, 0.36, 1),
    box-shadow 0.4s ease;
}
.career-content {
  transition: opacity 0.5s ease;
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
