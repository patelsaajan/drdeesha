<template>
  <section id="about" ref="root" class="relative z-20 bg-background text-foreground">
    <div class="mx-auto max-w-6xl px-4 py-24 sm:px-6 lg:py-28">

      <!-- Editorial mosaic, same family as the cases grid: mixed-size tiles
           where the studio portrait is the anchor (name + qualifications sat
           on its scrim), two primary-tinted text tiles carry the bio at
           opposite corners, and three candid photos fill around them —
           personality by showing, not telling. Mobile keeps the mosaic as a
           two-column stack; lg pins every tile to an explicit slot in a
           3x3 arrangement of 2-col cells: the portrait holds the centre as
           a 2x2, every text tile is a single cell, and the photos alternate
           with them checkerboard-fashion. Tile surfaces all come off the
           shared primary tint ramp (usePrimaryTint), photo backdrops
           included. -->
      <div class="grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-6 lg:grid-rows-[repeat(3,17rem)]">

        <!-- Intro + booking — the deep tint, white text -->
        <div
          class="reveal col-span-2 flex flex-col rounded-xl p-6 text-white sm:p-8 lg:col-start-1 lg:row-start-1 lg:p-6"
          :style="{ backgroundColor: usePrimaryTint(80) }"
        >
          <p class="font-display text-xs font-semibold uppercase tracking-eyebrow text-white/70">
            About
          </p>
          <!-- lg:text-sm: this copy has to clear a single fixed grid row -->
          <p class="mt-5 font-display text-base font-light leading-relaxed text-white/85 lg:text-sm">
            I became a dentist for the mix of precision and people: the quiet craft of getting
            something exactly right, and the person in the chair who walks out feeling better.
            The nervous first visits are the ones I care about most, and turning them into
            easy ones is what I'm proudest of.
          </p>
          <p class="mt-7 flex items-center gap-3 font-display text-2xs uppercase tracking-label text-white/60 lg:mt-auto">
            <span class="h-px w-8 bg-white/30" />
            General Dental Council registered
          </p>
        </div>

        <!-- The anchor portrait — name and qualifications live on the photo -->
        <figure
          class="reveal relative col-span-2 m-0 aspect-3/4 overflow-hidden rounded-xl sm:aspect-square lg:col-start-3 lg:row-span-2 lg:row-start-1 lg:aspect-auto"
          :style="{ backgroundColor: usePrimaryTint(95) }"
        >
          <NuxtImg
            src="/images/dr-deesha.jpeg"
            alt="Dr Deesha, smiling in a black roll-neck against a dark studio backdrop"
            sizes="100vw lg:33vw"
            preload
            loading="eager"
            class="absolute inset-0 h-full w-full object-cover"
            style="object-position: 50% 20%"
          />
          <div aria-hidden="true" class="absolute inset-0 bg-linear-to-t from-black/75 via-black/20 to-transparent" />
          <figcaption class="absolute inset-x-0 bottom-0 p-6 lg:p-7">
            <p class="font-display text-3xs font-semibold uppercase tracking-label text-white/80 sm:text-2xs">
              BDS<span class="mx-1.5 text-accent">·</span>MJDF RCS<span class="text-white/60">&nbsp;(Eng)</span><span class="mx-1.5 text-accent">·</span>PgDip Restorative &amp; Aesthetic Dentistry
            </p>
            <!-- h2, not h1 — the hero wordmark is the page's single h1. -->
            <h2 class="m-0 mt-2 font-serif font-normal leading-none tracking-heading text-white" style="font-size: clamp(2.25rem, 4.5vw, 3rem)">
              Dr Deesha
            </h2>
          </figcaption>
        </figure>

        <!-- Candids — a square pair on mobile, singles slotted around on lg -->
        <figure
          class="reveal relative col-span-1 m-0 aspect-square overflow-hidden rounded-xl lg:col-span-2 lg:col-start-5 lg:row-start-1 lg:aspect-auto"
          :style="{ backgroundColor: usePrimaryTint(90) }"
        >
          <NuxtImg
            src="/images/deesha-1.jpg"
            alt="Dr Deesha beaming under a jacaranda tree in a glasshouse garden"
            sizes="50vw lg:33vw"
            loading="lazy"
            class="absolute inset-0 h-full w-full object-cover"
          />
        </figure>

        <figure
          class="reveal relative col-span-1 m-0 aspect-square overflow-hidden rounded-xl lg:col-span-2 lg:col-start-5 lg:row-start-3 lg:aspect-auto"
          :style="{ backgroundColor: usePrimaryTint(90) }"
        >
          <NuxtImg
            src="/images/deesha-3.jpg"
            alt="Dr Deesha blowing a kiss beside the Aquarius fountain on a city wander"
            sizes="50vw lg:33vw"
            loading="lazy"
            class="absolute inset-0 h-full w-full object-cover"
          />
        </figure>

        <!-- Pull-quote — the mid-ramp tint, a serif beat between the two
             paragraph tiles -->
        <div
          class="reveal col-span-2 flex flex-col justify-center rounded-xl p-6 text-white sm:p-8 lg:col-start-1 lg:row-start-3"
          :style="{ backgroundColor: usePrimaryTint(65) }"
        >
          <p class="m-0 font-serif font-normal leading-snug tracking-heading" style="font-size: clamp(1.35rem, 2vw, 1.6rem)">
            Good dentistry is quiet work. Gentle in the chair, plain in the explanation, made to last.
          </p>
        </div>

        <!-- The person outside the practice — the pale tint, dark text -->
        <div
          class="reveal col-span-2 flex flex-col rounded-xl p-6 sm:p-8 lg:col-start-5 lg:row-start-2 lg:p-6"
          :style="{ backgroundColor: usePrimaryTint(8) }"
        >
          <p class="font-display text-base font-light leading-relaxed text-foreground/75 lg:text-sm">
            Away from the practice I'm usually outdoors on a long walk, cooking for far too many
            people, or hunting down a decent flat white. Whatever brings you in, a routine
            check-up or a whole new smile, you'll get the same unhurried attention.
          </p>
          <p class="mt-7 flex items-center gap-3 font-display text-2xs uppercase tracking-label text-foreground/55 lg:mt-auto">
            {{ practice.name }}
            <span aria-hidden="true" class="h-1 w-1 rounded-full bg-accent" />
            {{ practice.location }}
          </p>
        </div>

        <!-- Booking — the ramp's full-strength endpoint, closing the grid
             under the portrait so the CTA lands after the personality has
             done its work -->
        <div
          class="reveal col-span-2 flex flex-col items-start justify-center gap-5 rounded-xl p-6 text-white sm:p-8 lg:col-start-3 lg:row-start-3"
          :style="{ backgroundColor: usePrimaryTint(100) }"
        >
          <p class="m-0 font-serif font-normal leading-snug tracking-heading" style="font-size: clamp(1.35rem, 2vw, 1.6rem)">
            Ready when you are.
          </p>
          <UButton
            :href="practice.bookingHref"
            color="neutral"
            variant="solid"
            size="lg"
            class="rounded-full px-6 duration-250 ease-out hover:bg-accent hover:text-white"
          >
            Book an appointment
          </UButton>
        </div>

        <figure
          class="reveal relative col-span-2 m-0 aspect-video overflow-hidden rounded-xl lg:col-start-1 lg:row-start-2 lg:aspect-auto"
          :style="{ backgroundColor: usePrimaryTint(90) }"
        >
          <NuxtImg
            src="/images/deesha-2.jpg"
            alt="Dr Deesha waving beside elephants bathing in a Chiang Mai river"
            sizes="100vw lg:33vw"
            loading="lazy"
            class="absolute inset-0 h-full w-full object-cover"
          />
        </figure>

      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { practice } from '../data/contact'

// Tiles ride the site's shared staggered entrance, in DOM order — intro,
// portrait, then the candids and closing note cascading in behind them.
// A slightly wider stagger than the default so each square lands as its
// own beat.
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
