<template>
  <!-- Shares the page-white ground of the Process section below, so the deep
       Meet panel above reads as one saturated block and the page returns to
       light from here down. -->
  <section id="about" ref="root" class="relative z-20 bg-background text-foreground">
    <div class="mx-auto max-w-4xl px-4 py-24 sm:px-6 lg:py-28">

      <header class="reveal max-w-2xl">
        <p class="m-0 font-display text-xs font-semibold uppercase tracking-eyebrow text-primary">
          About
        </p>
        <!-- Invitational rather than descriptive — the accordion is optional
             depth, and the heading says so. -->
        <h2 class="m-0 mt-5 font-serif font-normal leading-heading tracking-heading" style="font-size: clamp(2rem, 4vw, 3rem)">
          The details, if you want them.
        </h2>
      </header>

      <!-- An accordion rather than the old mosaic of fixed tiles: the same
           copy, but the visitor opens what they want instead of scrolling
           past all of it. One panel at a time, so the section keeps a
           predictable height and the answers never compete.

           Native <details>/<summary>, which gives the disclosure semantics,
           keyboard operation and find-in-page expansion for free; `name`
           makes the browser close the others, so the single-open behaviour
           costs no JS either. The height animation rides interpolate-size,
           and browsers without it simply open instantly. -->
      <div class="reveal mt-10 lg:mt-12">
        <details
          v-for="(topic, i) in aboutTopics"
          :key="topic.id"
          name="about"
          class="about-item border-t border-foreground/15"
          :class="i === aboutTopics.length - 1 && 'border-b'"
          :open="i === 0"
        >
          <summary
            class="group grid cursor-pointer list-none grid-cols-[2.75rem_minmax(0,1fr)_auto] items-baseline gap-x-2 py-6 outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-inset sm:gap-x-4 lg:py-7"
          >
            <!-- Index — the structural cue that makes five hairline rows read
                 as one deliberate set. Tabular numerals so the column holds
                 its width; accent only while open, so exactly one number is
                 lit and it doubles as the "you are here" marker. -->
            <span class="about-index font-display text-xs font-semibold tracking-label text-foreground/35 tabular-nums transition-colors duration-250">
              0{{ i + 1 }}
            </span>

            <span class="min-w-0">
              <span class="block font-serif font-normal leading-snug tracking-heading transition-colors duration-250" style="font-size: clamp(1.25rem, 2.2vw, 1.75rem)">
                {{ topic.label }}
              </span>
              <span class="mt-1.5 block font-display text-2xs uppercase tracking-label text-foreground/55 transition-colors duration-250 group-hover:text-foreground/70">
                {{ topic.hint }}
              </span>
            </span>

            <!-- Two rules crossed into a plus, the vertical one rotating away
                 as the panel opens. Cheaper than swapping a glyph, and it
                 animates rather than snapping. -->
            <span aria-hidden="true" class="relative mt-1 h-4 w-4 shrink-0 self-center">
              <span class="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-primary" />
              <span class="about-bar absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-primary" />
            </span>
          </summary>

          <div class="about-panel">
            <!-- Content indents to the label's own column, so open copy hangs
                 from the same left edge the row names — the index gutter stays
                 clear and the set keeps one strong vertical. -->
            <div class="pb-8 pl-13 sm:pl-15">
              <div class="max-w-2xl sm:pr-8">
                <p
                  v-for="(para, n) in topic.body"
                  :key="n"
                  class="about-fade m-0 mt-4 font-display text-base font-light leading-relaxed text-foreground/80 first:mt-0 lg:text-lg"
                >
                  {{ para }}
                </p>

                <figure v-if="topic.image" class="about-fade relative m-0 mt-7 h-56 overflow-hidden rounded-xl lg:h-72" :style="{ backgroundColor: usePrimaryTint(50) }">
                  <NuxtImg
                    :src="topic.image.src"
                    :alt="topic.image.alt"
                    sizes="100vw lg:60vw"
                    loading="lazy"
                    class="absolute inset-0 h-full w-full object-cover"
                  />
                </figure>
              </div>
            </div>
          </div>
        </details>
      </div>

      <!-- The booking prompt the mosaic used to carry in two places, kept as
           one line under the accordion so the section still closes on an
           action. bg-primary is the ramp's dark end against this lighter
           ground, so it still reads as the one thing to press. -->
      <a
        :href="practice.bookingHref"
        class="reveal group mt-10 flex flex-col justify-center gap-4 rounded-2xl bg-primary p-6 text-white outline-none transition-colors duration-250 ease-out hover:bg-accent hover:text-primary focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 sm:flex-row sm:items-center sm:justify-between sm:p-8"
      >
        <span class="max-w-2xl font-serif font-normal leading-snug tracking-heading transition-colors" style="font-size: clamp(1.15rem, 1.7vw, 1.55rem)">
          New patients welcome, and you won't get a lecture.
        </span>
        <span class="flex shrink-0 items-center gap-2 font-display text-sm font-semibold uppercase tracking-label text-white transition-colors group-hover:text-primary">
          Book an appointment
          <span aria-hidden="true" class="inline-block text-accent transition-all duration-250 ease-out group-hover:translate-x-0.5 group-hover:text-primary">↗</span>
        </span>
      </a>

    </div>
  </section>
</template>

<script setup lang="ts">
import { aboutTopics } from '../data/about'
import { practice } from '../data/contact'

const root = ref<HTMLElement | null>(null)
useSectionReveal(root, { stagger: 0.12 })
</script>

<style scoped>
/* Start hidden only where we'll animate; reduced-motion keeps everything visible. */
@media (prefers-reduced-motion: no-preference) {
  .reveal {
    opacity: 0;
  }
}

summary::-webkit-details-marker {
  display: none;
}

/* The plus closes to a minus as the panel opens. */
.about-bar {
  transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1);
}
.about-item[open] .about-bar {
  transform: translateX(-50%) rotate(90deg);
}

/* Exactly one index is lit — the open row's — so the number column doubles
   as the "you are here" marker. */
.about-item[open] .about-index {
  color: var(--color-primary);
}

/* Panel content rises a beat behind the height animation, second child a
   step after the first. Delays live only on the open state, so closing
   fades everything at once instead of playing the cascade backwards. */
.about-fade {
  opacity: 0;
  transform: translateY(10px);
  transition:
    opacity 0.3s ease,
    transform 0.45s cubic-bezier(0.16, 1, 0.3, 1);
}
.about-item[open] .about-fade {
  opacity: 1;
  transform: none;
  transition-delay: 120ms;
}
.about-item[open] .about-fade:nth-child(2) {
  transition-delay: 200ms;
}
.about-item[open] .about-fade:nth-child(3) {
  transition-delay: 280ms;
}

/* Height animation. A panel's natural height is `auto`, which is not
   normally interpolable — interpolate-size opts this subtree into animating
   to and from it. Where it isn't supported the grid row simply snaps open,
   which is the plain <details> behaviour and perfectly usable. */
.about-item {
  interpolate-size: allow-keywords;
}
.about-panel {
  display: grid;
  grid-template-rows: 0fr;
  transition: grid-template-rows 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}
.about-item[open] .about-panel {
  grid-template-rows: 1fr;
}
.about-panel > div {
  min-height: 0;
  overflow: hidden;
}

.about-item summary:hover .font-serif {
  color: var(--color-primary);
}

@media (prefers-reduced-motion: reduce) {
  .about-bar,
  .about-panel,
  .about-fade {
    transition: none;
  }
}
</style>
