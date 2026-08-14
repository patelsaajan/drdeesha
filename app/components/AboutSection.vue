<template>
  <!-- The section sits on a light wash of primary rather than the page
       white — a soft lavender ground that shows through the grid's gutters
       as tinted grout and gives the mid-to-deep card tints a related
       field to sit on. -->
  <section id="about" ref="root" class="relative z-20 text-foreground" :style="{ backgroundColor: usePrimaryTint(6) }">
    <div class="mx-auto max-w-6xl px-4 py-24 sm:px-6 lg:py-28">

      <SectionHeader eyebrow="About" title="Meet Dr Deesha." />

      <!-- Editorial mosaic, same family as the cases grid, cut back to seven
           tiles: the studio portrait anchors (name + qualifications on its
           scrim), one merged bio card carries the professional copy, and one
           serif pull-quote gives the section its beat. Surfaces are mostly
           light — white cards on the lavender wash — so the section reads
           bright and airy; saturated purple appears exactly twice, on the
           pull-quote (mid-ramp) and the closing booking CTA (full primary),
           which keeps the dark end reserved for the one surface that must
           catch the eye. Below lg the personality tile and jacaranda candid
           drop out, so a patient on their phone meets only bio, chairside,
           portrait, quote, and the booking CTA as a lean stack, CTA last. -->
      <div class="mt-14 grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-6 lg:grid-rows-[repeat(4,17rem)]">

        <!-- The professional bio — who she is and how she practises, merged
             into one card so the section says it once. White surface: the
             copy does the work, the wash does the colour. -->
        <div class="reveal col-span-2 flex flex-col justify-center gap-5 rounded-xl bg-white p-6 shadow-card sm:p-8 lg:col-span-4 lg:col-start-1 lg:row-start-1 lg:p-8">
          <p class="m-0 font-body text-base font-light leading-relaxed text-foreground/85 lg:text-lg">
            I'm a general dentist working at the wonderful {{ practice.name }} in
            {{ practice.location }}, South Wales and I enjoy providing a wide range of general
            and cosmetic dental treatments in a calm and welcoming environment.
          </p>
          <p class="m-0 font-body text-base font-light leading-relaxed text-foreground/85 lg:text-lg">
            Dentistry is about much more than teeth. Visiting can feel daunting, so I aim to
            create a calm, supportive experience — whether it's a gentle aesthetic enhancement
            or getting you out of pain, your comfort always comes first.
          </p>
        </div>

        <!-- Chairside — Dr Deesha mid-treatment with a nurse assisting,
             completing row one alongside the bio. -->
        <figure
          class="reveal relative col-span-2 m-0 aspect-video overflow-hidden rounded-xl lg:col-span-2 lg:col-start-5 lg:row-start-1 lg:aspect-auto"
          :style="{ backgroundColor: usePrimaryTint(50) }"
        >
          <NuxtImg
            src="/images/about/chairside.jpg"
            alt="Dr Deesha treating a patient chairside, with a dental nurse assisting"
            sizes="100vw lg:33vw"
            loading="lazy"
            class="absolute inset-0 h-full w-full object-cover"
          />
        </figure>

        <!-- The anchor portrait — name and qualifications live on the photo -->
        <figure
          class="reveal relative col-span-2 m-0 aspect-3/4 overflow-hidden rounded-xl sm:aspect-square lg:col-span-2 lg:col-start-1 lg:row-span-2 lg:row-start-2 lg:aspect-auto"
          :style="{ backgroundColor: usePrimaryTint(50) }"
        >
          <!-- Below the fold — no preload, so the hero logo keeps the only
               preload hint on first paint. -->
          <NuxtImg
            src="/images/about/portrait.jpeg"
            alt="Dr Deesha, smiling in a black roll-neck against a dark studio backdrop"
            sizes="100vw lg:33vw"
            loading="lazy"
            class="absolute inset-0 h-full w-full object-cover"
            style="object-position: 50% 20%"
          />
          <div aria-hidden="true" class="absolute inset-0 bg-linear-to-t from-black/75 via-black/20 to-transparent" />
          <!-- A caption, not a heading — "Meet Dr Deesha." above is this
               section's one h2. -->
          <figcaption class="absolute inset-x-0 bottom-0 p-6 lg:p-7">
            <p class="font-body text-xs font-semibold uppercase tracking-label text-white/80">
              BChD<span class="mx-1.5 text-accent">·</span>MChD<span class="mx-1.5 text-accent">·</span>BSc<span class="mx-1.5 text-accent">·</span>PgDip
            </p>
            <p class="m-0 mt-2 font-display font-normal leading-none tracking-heading text-white" style="font-size: clamp(2.25rem, 4.5vw, 3rem)">
              Dr Deesha
            </p>
          </figcaption>
        </figure>

        <!-- Pull-quote — one of the section's two purple surfaces, a serif
             beat running wide beside the portrait. max-w keeps the line's
             measure honest across the width. -->
        <div
          class="reveal col-span-2 flex flex-col justify-center rounded-xl p-6 text-white sm:p-8 lg:col-span-4 lg:col-start-3 lg:row-start-2"
          :style="{ backgroundColor: usePrimaryTint(73) }"
        >
          <!-- Written and sized to land on two lines inside the fixed 17rem
               row — a third line would show, so copy length and size move
               together here. -->
          <p class="m-0 max-w-3xl font-display font-normal leading-snug tracking-heading" style="font-size: clamp(1.6rem, 2.9vw, 2.75rem)">
            Good dentistry is quiet work. Gentle, plain, lasting.
          </p>
        </div>

        <!-- The person outside the practice — a plain white card now, no
             slide mechanic. Hidden below lg: personal-interest copy isn't
             what a patient is scrolling for on mobile. -->
        <div class="reveal col-span-2 hidden flex-col justify-center rounded-xl bg-white p-6 shadow-card sm:p-8 lg:col-span-2 lg:col-start-3 lg:row-start-3 lg:flex lg:p-6">
          <p class="m-0 font-body text-base font-light leading-relaxed text-foreground/85">
            Outside of dentistry, you'll usually find me at Pilates, hiking somewhere with a
            good view, being an amateur nail tech, or trying out new baking recipes.
          </p>
        </div>

        <!-- Jacaranda — a personal candid closing the row, photograph only.
             Desktop only, same reasoning as the personality card. -->
        <figure
          class="reveal relative hidden m-0 overflow-hidden rounded-xl lg:col-span-2 lg:col-start-5 lg:row-start-3 lg:block lg:aspect-auto"
          :style="{ backgroundColor: usePrimaryTint(50) }"
        >
          <NuxtImg
            src="/images/about/candid-1.jpg"
            alt="Dr Deesha beaming under a jacaranda tree in a glasshouse garden"
            sizes="50vw lg:33vw"
            loading="lazy"
            class="absolute inset-0 h-full w-full object-cover"
          />
        </figure>

        <!-- The section's one booking CTA — lapsed-visit reassurance promoted
             into the action itself. The reassurance stays the headline (it's
             what earns the click), the invitation reads as its consequence.
             Whole tile is the link; hover floods it with the accent. Placed
             last in the DOM so it also lands last in the reveal stagger. -->
        <a
          :href="practice.bookingHref"
          class="reveal group col-span-2 flex flex-col justify-center gap-6 rounded-xl bg-primary p-6 text-white outline-none transition-colors duration-250 ease-out hover:bg-accent hover:text-primary focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 sm:p-8 lg:col-span-6 lg:col-start-1 lg:row-start-4 lg:p-8"
        >
          <p class="m-0 font-body text-xs uppercase tracking-label text-white/70 transition-colors group-hover:text-primary/70">
            New patients welcome
          </p>
          <p class="m-0 max-w-2xl font-display font-normal leading-snug tracking-heading transition-colors" style="font-size: clamp(1.15rem, 1.7vw, 1.55rem)">
            If it's been years since your last check-up, you won't get a lecture here.
            Just a clear plan, and a bit of credit for showing up.
          </p>
          <p class="m-0 flex items-center gap-2 font-body text-sm font-semibold uppercase tracking-label text-white transition-colors group-hover:text-primary">
            Book an appointment
            <span aria-hidden="true" class="inline-block text-accent transition-all duration-250 ease-out group-hover:translate-x-0.5 group-hover:text-primary">↗</span>
          </p>
        </a>

      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { practice } from '../data/contact'

// Tiles ride the site's shared staggered entrance, in DOM order — the bio
// row, then chairside, portrait, and the rest cascading in behind them,
// closing CTA last. A slightly wider stagger than the default so each
// square lands as its own beat.
const root = ref<HTMLElement | null>(null)
useSectionReveal(root, { stagger: 0.12 })
</script>

