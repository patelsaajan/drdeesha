<template>
  <!-- Slides up over the sticky hero as a curtain — z-10 paints it above the
       hero's z-0, so scrolling draws this section across a stationary hero
       rather than pushing it away. Same layering device the footer uses over
       the pinned testimonials. The slide *is* the entrance, so there's no
       fade-up reveal on top of it.

       Full-viewport introduction directly under the hero: the studio portrait
       claims the left third, and the remaining two thirds carry the name, the
       qualification lockup, a short bio and her pull-quote. The ground is
       primary cut with
       20% white (usePrimaryTint(80)) — the same tinting device the About
       panel and footer use, so the two sections read as one family. White
       body copy sits at ~9:1 on it; the eyebrow is white/70 rather than
       white/60 because 60% lands at 4.31:1, just under AA for its size. -->
  <section
    class="relative z-10 grid min-h-dvh w-full overflow-hidden lg:grid-cols-5"
    :style="{ backgroundColor: usePrimaryTint(90) }"
  >
    <!-- The 2/5 : 3/5 split only exists on lg: below it it becomes a stack, the
         portrait taking the top 44dvh so the face stays the section's opening
         beat on a phone while leaving the bio room. The generous pb on the
         text column clears the mobile nav bar docked at the bottom edge. -->
    <figure
      class="relative m-0 h-[44dvh] lg:col-span-2 lg:h-auto lg:min-h-dvh"
      :style="{ backgroundColor: usePrimaryTint(50) }"
    >
      <NuxtImg
        src="/images/about/portrait.webp"
        alt="Dr Deesha, smiling in a black roll-neck against a dark studio backdrop"
        sizes="100vw lg:40vw"
        loading="lazy"
        class="absolute inset-0 h-full w-full object-cover"
        style="object-position: 50% 20%"
      />
    </figure>

    <div class="flex flex-col items-start justify-center gap-6 px-6 pt-14 pb-28 sm:px-10 lg:col-span-3 lg:px-20 lg:py-24">
      <p class="m-0 font-display text-xs font-semibold uppercase tracking-eyebrow text-white/70">
        Meet your dentist
      </p>

      <h2
        class="m-0 font-serif font-normal leading-none tracking-heading text-white"
        style="font-size: clamp(2.75rem, 6vw, 4.5rem)"
      >
        Dr Deesha
      </h2>

      <!-- Same qualification lockup as the hero and the About portrait. -->
      <p class="m-0 font-display text-2xs font-semibold uppercase tracking-label text-white/70">
        BChD<span class="mx-1.5 text-accent">·</span>MChD<span class="mx-1.5 text-accent">·</span>BSc<span class="mx-1.5 text-accent">·</span>PgDip
      </p>

      <p class="m-0 max-w-2xl font-display text-base font-light leading-relaxed text-white/85 lg:text-xl">
        I'm a general dentist at {{ practice.name }} in {{ practice.location }},
        South Wales, offering a wide range of general and cosmetic treatments
        in a calm, welcoming environment. Whether it's your first appointment
        in years or a routine check-up, you'll get unhurried care, plain
        explanations, and a plan that moves at your pace.
      </p>

      <!-- Closing beat: the pull-quote that used to sit as one tile among
           many in the About mosaic. Given here as an actual blockquote under
           her own bio, it reads as Dr Deesha's words rather than decoration.
           Sized well above the body copy so it lands as the section's last
           word; the accent rule replaces quotation marks, which at this size
           would sit awkwardly against the serif. -->
      <blockquote class="m-0 mt-2 border-l-2 border-accent pl-6 lg:pl-8">
        <p class="m-0 max-w-2xl font-serif font-normal leading-quote tracking-heading text-white" style="font-size: clamp(1.75rem, 3.2vw, 2.75rem)">
          Good dentistry is quiet work. Gentle, plain, lasting.
        </p>
      </blockquote>
    </div>
  </section>
</template>

<script setup lang="ts">
import { practice } from '../data/contact'
</script>
