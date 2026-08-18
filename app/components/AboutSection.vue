<template>
  <!-- Shares the page-white ground of the Process section below, so the deep
       Meet panel above reads as one saturated block and the page returns to
       light from here down. -->
  <section id="about" ref="root" class="relative z-20 bg-background text-foreground">
    <div class="mx-auto max-w-5xl px-4 py-24 sm:px-6 lg:py-28">

      <header class="reveal max-w-2xl">
        <p class="m-0 font-display text-xs font-semibold uppercase tracking-eyebrow text-primary">
          About
        </p>
        <!-- Invitational rather than descriptive — the entries below are
             optional depth, and the heading says so. -->
        <h2 class="m-0 mt-5 font-serif font-normal leading-heading tracking-heading" style="font-size: clamp(2rem, 4vw, 3rem)">
          The details, if you want them.
        </h2>
      </header>

      <!-- An editorial list, no disclosure widget. The five topics total ten
           short paragraphs — content that light doesn't earn the click an
           accordion charges for it, and on a page whose job is persuasion the
           copy works harder in the open. Label column left, copy right, the
           two joined by a shared baseline; below lg the label sits above its
           copy and the number keeps the entries countable. -->
      <div class="mt-14 lg:mt-16">
        <article
          v-for="(topic, i) in aboutTopics"
          :key="topic.id"
          class="reveal grid gap-y-4 border-t border-foreground/15 py-10 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] lg:gap-x-12 lg:py-12"
        >
          <div class="flex items-baseline gap-4">
            <!-- Tabular numerals so the column holds its width down the set. -->
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

          <div class="max-w-2xl lg:pt-1.5">
            <p
              v-for="(para, n) in topic.body"
              :key="n"
              class="m-0 mt-4 font-display text-base font-light leading-relaxed text-foreground/80 first:mt-0 lg:text-lg"
            >
              {{ para }}
            </p>
          </div>
        </article>
      </div>

      <!-- The booking prompt, kept as one line under the list so the section
           still closes on an action. bg-primary is the ramp's dark end
           against the white ground, so it reads as the one thing to press. -->
      <a
        :href="practice.bookingHref"
        class="reveal group mt-4 flex flex-col justify-center gap-4 rounded-2xl bg-primary p-6 text-white outline-none transition-colors duration-250 ease-out hover:bg-accent hover:text-primary focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 sm:flex-row sm:items-center sm:justify-between sm:p-8"
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

// Entries ride the site's shared staggered entrance, one beat per row.
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
</style>
