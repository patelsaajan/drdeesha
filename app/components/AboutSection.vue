<template>
  <!-- Carries the Meet section's ground exactly, so the two run on as one
       surface rather than the page changing colour between them. If that
       tint moves, move this with it. -->
  <section id="about" ref="root" class="relative z-20" :style="{ backgroundColor: usePrimaryTint(90) }">
    <div class="mx-auto max-w-4xl px-4 py-24 sm:px-6 lg:py-28">

      <p class="reveal font-display text-xs font-semibold uppercase tracking-eyebrow text-white/70">
        About
      </p>

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
          class="about-item border-t border-white/15"
          :class="i === aboutTopics.length - 1 && 'border-b'"
          :open="i === 0"
        >
          <summary
            class="group flex cursor-pointer list-none items-baseline gap-4 py-6 outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-inset lg:py-7"
          >
            <span class="min-w-0 flex-1">
              <span class="block font-serif font-normal leading-snug tracking-heading text-white transition-colors duration-250" style="font-size: clamp(1.25rem, 2.2vw, 1.75rem)">
                {{ topic.label }}
              </span>
              <span class="mt-1.5 block font-display text-2xs uppercase tracking-label text-white/55">
                {{ topic.hint }}
              </span>
            </span>

            <!-- Two rules crossed into a plus, the vertical one rotating away
                 as the panel opens. Cheaper than swapping a glyph, and it
                 animates rather than snapping. -->
            <span aria-hidden="true" class="relative mt-1 h-3.5 w-3.5 shrink-0">
              <span class="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-accent" />
              <span class="about-bar absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-accent" />
            </span>
          </summary>

          <div class="about-panel">
            <div class="pb-8 lg:pb-10">
              <p
                v-for="(para, n) in topic.body"
                :key="n"
                class="m-0 mt-4 max-w-2xl font-display text-base font-light leading-relaxed text-white/85 first:mt-0 lg:text-lg"
              >
                {{ para }}
              </p>

              <figure v-if="topic.image" class="relative m-0 mt-6 h-56 overflow-hidden rounded-xl lg:h-72" :style="{ backgroundColor: usePrimaryTint(50) }">
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
          New patients welcome — and you won't get a lecture.
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
  color: color-mix(in oklab, white 80%, var(--color-accent));
}

@media (prefers-reduced-motion: reduce) {
  .about-bar,
  .about-panel {
    transition: none;
  }
}
</style>
