<template>
  <!-- The section sits on a light wash of primary rather than the page
       white — a soft lavender ground that shows through the grid's gutters
       as tinted grout and gives the mid-to-deep card tints a related
       field to sit on. -->
  <section id="about" ref="root" class="relative z-20 text-foreground" :style="{ backgroundColor: usePrimaryTint(6) }">
    <div class="mx-auto max-w-6xl px-4 py-24 sm:px-6 lg:py-28">

      <header class="max-w-2xl">
        <p class="reveal font-display text-xs font-semibold uppercase tracking-eyebrow text-primary">
          About
        </p>
        <h2 class="reveal mt-5 font-serif font-normal leading-heading tracking-heading" style="font-size: clamp(2rem, 4vw, 3.25rem)">
          Meet Dr Deesha.
        </h2>
      </header>

      <!-- Editorial mosaic, same family as the cases grid: mixed-size tiles
           where the studio portrait is the anchor (name + qualifications sat
           on its scrim), primary-tinted text tiles carry the bio around it,
           and three candid photos fill in — personality by showing, not
           telling. Mobile keeps the mosaic as a two-column stack; lg pins
           every tile to an explicit slot across five 17rem rows: a
           full-width row leads with the professional bio, then a 6-col
           arrangement of the rest — the portrait holds the top-centre as a
           1x2 column, the pull-quote runs two cells wide across its row, and
           the intro paragraph stands 1x2 tall down the right side — the
           booking tile, itself a whole-tile link, takes its old single-row
           slot instead. Every slide target stays a single 1x1 cell. Every
           surface — the section wash included — comes off the shared
           primary tint ramp (usePrimaryTint). All cards carry white text, so
           they live in the 60-85 band (60 is where white first tests
           legible on the ramp), spread so edge-sharing surfaces —
           hover-revealed caption cards included — stay clearly apart. Full
           primary stays reserved for the one booking tile that has to catch
           the eye. Type is scaled per tile to how much copy it carries, so
           each box reads comfortably full at the fixed lg row height. -->
      <div class="mt-14 grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-6 lg:grid-rows-[repeat(5,17rem)]">

        <!-- The professional bio — leads the mosaic right under the section
             title, sharing row one with the chairside photo beside it. The
             lightest tint in the card ramp (60, its floor for legible white
             text) so it opens quietly before the deeper tiles below it. -->
        <div
          class="reveal col-span-2 flex flex-col justify-center rounded-xl p-6 text-white sm:p-8 lg:col-span-4 lg:col-start-1 lg:row-start-1 lg:p-6"
          :style="{ backgroundColor: usePrimaryTint(60) }"
        >
          <p class="font-display text-base font-light leading-relaxed text-white/85">
            I'm a general dentist working at the wonderful {{ practice.name }} in
            {{ practice.location }}, South Wales and I enjoy providing a wide range of general
            and cosmetic dental treatments in a calm and welcoming environment. I'm passionate
            about helping patients feel confident in their smiles.
          </p>
        </div>

        <!-- Chairside — Dr Deesha mid-treatment with a nurse assisting,
             completing row one alongside the bio. -->
        <figure
          class="reveal relative col-span-2 m-0 aspect-video overflow-hidden rounded-xl lg:col-span-2 lg:col-start-5 lg:row-start-1 lg:aspect-auto"
          :style="{ backgroundColor: usePrimaryTint(30) }"
        >
          <NuxtImg
            src="/images/about/chairside.png"
            alt="Dr Deesha treating a patient chairside, with a dental nurse assisting"
            sizes="100vw lg:33vw"
            loading="lazy"
            class="absolute inset-0 h-full w-full object-cover"
          />
        </figure>

        <!-- Booking — the ramp's full-strength endpoint, now a single 1x1
             cell in what used to be the intro's slot (the intro paragraph
             has swapped down into the old 1x2 booking slot below). The
             whole tile is the link: hover floods it with the accent, the
             same colour every other CTA resolves to (solid bg-primary
             class rather than an inline style, so hover:bg-accent can
             win). The action carries the serif headline; "Ready when you
             are." is its eyebrow. -->
        <a
          :href="practice.bookingHref"
          class="reveal group col-span-2 flex flex-col items-start justify-center gap-5 rounded-xl bg-primary p-6 text-white outline-none transition-colors duration-250 ease-out hover:bg-accent hover:text-primary focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 sm:p-8 lg:col-start-1 lg:row-start-2 lg:p-6"
        >
          <p class="font-display text-xs font-semibold uppercase tracking-eyebrow text-white/70 group-hover:text-primary/70">
            Ready when you are.
          </p>
          <p class="m-0 font-serif font-normal leading-snug tracking-heading" style="font-size: clamp(1.5rem, 2.4vw, 2.25rem)">
            Book an appointment
            <span aria-hidden="true" class="inline-block text-accent transition-all duration-250 ease-out group-hover:translate-x-0.5 group-hover:text-primary">↗</span>
          </p>
        </a>

        <!-- The anchor portrait — name and qualifications live on the photo -->
        <figure
          class="reveal relative col-span-2 m-0 aspect-3/4 overflow-hidden rounded-xl sm:aspect-square lg:col-start-3 lg:row-span-2 lg:row-start-2 lg:aspect-auto"
          :style="{ backgroundColor: usePrimaryTint(30) }"
        >
          <NuxtImg
            src="/images/about/portrait.jpeg"
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
              BChD<span class="mx-1.5 text-accent">·</span>MChD<span class="mx-1.5 text-accent">·</span>BSc<span class="mx-1.5 text-accent">·</span>PgDip
            </p>
            <!-- h2, not h1 — the hero wordmark is the page's single h1. -->
            <h2 class="m-0 mt-2 font-serif font-normal leading-none tracking-heading text-white" style="font-size: clamp(2.25rem, 4.5vw, 3rem)">
              Dr Deesha
            </h2>
          </figcaption>
        </figure>

        <!-- Candids — a square pair on mobile, singles slotted around on lg.
             deesha-1 is a lid over its own caption: hovering (or focusing)
             slides the photo off toward the tile's own edge, uncovering the
             caption sitting beneath it — the "outside the practice" text tile
             runs the same trick, its text card sliding off to reveal the
             deesha-2 candid hiding under it. A second deesha-1 print sits
             plain (no caption) further down the mosaic.
             Exit direction follows placement: each interactive tile hugs an
             outer column, so its lid slides off toward that edge (this one on
             the left slides left; the text tile on the right slides right).
             lg:overflow-hidden clips the lid at the tile bound, so it appears
             to slip *under* the mosaic's edge rather than float out over the
             section wash. candid--left / --right set the exit direction. -->
        <!-- Left-column candid → its photo lid slides left off the edge. -->
        <figure
          tabindex="0"
          class="candid candid--left reveal relative col-span-1 m-0 aspect-square rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-primary/40 lg:col-span-2 lg:col-start-1 lg:row-start-3 lg:aspect-auto lg:overflow-hidden"
          :style="{ backgroundColor: usePrimaryTint(80) }"
        >
          <figcaption class="candid-caption absolute inset-0 m-0 flex flex-col justify-center p-6 text-white">
            <p class="m-0 font-display text-base font-light leading-relaxed text-white/85">
              Found the jacaranda in full bloom and refused to leave.
              I'll cross a whole city for a good garden.
            </p>
          </figcaption>
          <div class="candid-slide absolute inset-0 overflow-hidden rounded-xl">
            <NuxtImg
              src="/images/about/candid-1.jpg"
              alt="Dr Deesha beaming under a jacaranda tree in a glasshouse garden"
              sizes="50vw lg:33vw"
              loading="lazy"
              class="absolute inset-0 h-full w-full object-cover"
            />
          </div>
        </figure>

        <figure
          class="reveal relative col-span-1 m-0 aspect-square overflow-hidden rounded-xl lg:col-span-2 lg:col-start-3 lg:row-start-5 lg:aspect-auto"
          :style="{ backgroundColor: usePrimaryTint(80) }"
        >
          <NuxtImg
            src="/images/about/candid-1.jpg"
            alt="Dr Deesha beaming under a jacaranda tree in a glasshouse garden"
            sizes="50vw lg:33vw"
            loading="lazy"
            class="absolute inset-0 h-full w-full object-cover"
          />
        </figure>

        <!-- Pull-quote — the mid-ramp tint, a serif beat running two cells
             wide under the portrait. max-w keeps the line's measure honest
             across the double width. -->
        <div
          class="reveal col-span-2 flex flex-col justify-center rounded-xl p-6 text-white sm:p-8 lg:col-span-4 lg:col-start-1 lg:row-start-4"
          :style="{ backgroundColor: usePrimaryTint(60) }"
        >
          <p class="m-0 max-w-3xl font-serif font-normal leading-snug tracking-heading" style="font-size: clamp(1.6rem, 2.6vw, 2.4rem)">
            Good dentistry is quiet work. Gentle in the chair, plain in the explanation, made to last.
          </p>
        </div>

        <!-- The person outside the practice — the same mechanic as the
             jacaranda tile, just with the roles reversed: here the TEXT is the
             lid. It's the tile's resting face and the only moving part,
             sliding off to the right (clipped at the tile edge, so it vanishes
             under the mosaic's right border) to uncover the deesha-2 candid
             waiting beneath.
             The text layer keeps the in-flow positioning, so below lg — where
             none of the swap CSS applies — it still sits as a normal text
             tile, painting over the absolute photo behind it. -->
        <div
          tabindex="0"
          class="candid candid--right reveal relative col-span-2 rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-primary/40 lg:col-start-5 lg:row-start-2 lg:overflow-hidden"
          :style="{ backgroundColor: usePrimaryTint(30) }"
        >
          <div class="candid-caption absolute inset-0 overflow-hidden rounded-xl">
            <NuxtImg
              src="/images/about/candid-2.jpg"
              alt="Dr Deesha waving beside elephants bathing in a Chiang Mai river"
              sizes="100vw lg:33vw"
              loading="lazy"
              class="absolute inset-0 h-full w-full object-cover"
            />
          </div>
          <div
            class="candid-slide relative flex flex-col justify-center rounded-xl p-6 text-white sm:p-8 lg:absolute lg:inset-0 lg:p-6"
            :style="{ backgroundColor: usePrimaryTint(70) }"
          >
            <p class="font-display text-base font-light leading-relaxed text-white/85">
              Outside of dentistry, you'll usually find me at Pilates, being an amateur nail tech
              or trying out new baking recipes.
            </p>
          </div>
        </div>

        <!-- Lapsed-visit reassurance -->
        <div
          class="reveal col-span-2 flex flex-col rounded-xl p-6 text-white sm:p-8 lg:col-start-5 lg:row-start-5 lg:p-6"
          :style="{ backgroundColor: usePrimaryTint(65) }"
        >
          <p class="font-display text-base font-light leading-relaxed text-white/85 lg:text-lg">
            If it's been years since your last check-up, you won't get a lecture here:
            just a clear plan and a bit of credit for showing up.
          </p>
          <p class="mt-7 flex items-center gap-3 font-display text-2xs uppercase tracking-label text-white/60 lg:mt-auto">
            <span class="h-px w-8 bg-white/30" />
            New patients welcome
          </p>
        </div>

        <!-- An open invitation — a single cell in the bottom-left corner,
             closing the left column. -->
        <div
          class="reveal col-span-2 flex flex-col rounded-xl p-6 text-white sm:p-8 lg:col-start-1 lg:row-start-5 lg:p-6"
          :style="{ backgroundColor: usePrimaryTint(75) }"
        >
          <p class="font-display text-base font-light leading-relaxed text-white/85">
            Questions are welcome, and so are second opinions. Bring the X-rays,
            the worries, the photo of the smile you're after.
          </p>
          <p class="mt-7 flex items-center gap-3 font-display text-2xs uppercase tracking-label text-white/60 lg:mt-auto">
            No rush
            <span aria-hidden="true" class="h-1 w-1 rounded-full bg-accent" />
            No jargon
          </p>
        </div>

        <!-- Intro — the top of the card ramp (85), now standing a full 1x2
             column down the grid's bottom-right corner where the booking
             tile used to sit (the deesha-2 lid slides down over its
             neighbour, not this). Only the booking tile goes darker: full
             primary is reserved for the one surface that has to catch the
             eye. -->
        <div
          class="reveal col-span-2 flex flex-col justify-center rounded-xl p-6 text-white sm:p-8 lg:col-start-5 lg:row-span-2 lg:row-start-3"
          :style="{ backgroundColor: usePrimaryTint(85) }"
        >
          <p class="font-display text-base font-light leading-relaxed text-white/85">
            I believe dentistry is about much more than teeth. Visiting the dentist can feel
            daunting, so I aim to create a calm, supportive experience. Whether it's a gentle
            aesthetic enhancement or getting you out of pain, your comfort always comes first.
          </p>
        </div>

        <!-- Below lg deesha-2 stands alone: on desktop it hides under the
             "outside the practice" lid above, and a photo the mosaic paid
             for shouldn't vanish from phones. -->
        <figure
          class="reveal relative col-span-2 m-0 aspect-video overflow-hidden rounded-xl lg:hidden"
          :style="{ backgroundColor: usePrimaryTint(30) }"
        >
          <NuxtImg
            src="/images/about/candid-2.jpg"
            alt="Dr Deesha waving beside elephants bathing in a Chiang Mai river"
            sizes="100vw"
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

// Tiles ride the site's shared staggered entrance, in DOM order — the bio
// row, then intro, portrait, and the candids cascading in behind them.
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

/* Candid card-swap — desktop only; below lg the photos sit still and the
   reveal cards stay hidden underneath. The lid rides on top; hovering (or
   focusing) slides it clean off toward the tile's own edge, and the reveal
   sitting one z-level down is uncovered in its place. Each tile is
   lg:overflow-hidden, so the departing lid is clipped at the tile bound and
   appears to slip *under* the mosaic's edge rather than float out over the
   section wash — no card ever overlaps a neighbour on the way out.
   Exit direction is per-tile (candid--left / --right): the lid travels its
   own width plus a grid-gutter (1.25rem, the lg gap-5) so it fully clears.
   Nothing else may touch transform on .candid-slide — the transition owns
   that property outright. An earlier idle-hint keyframe animation shared it
   and the swap snapped instantly instead of sliding: an infinite animation
   outranks normal declarations in the cascade, so cancelling it and setting
   the exit transform in the same rule gave the transition no start value to
   interpolate from.
   The idle peek below is therefore built on `translate`, the standalone
   transform property — a different property from `transform`, so the two
   compose (translate applies first, then transform) and neither can clobber
   the other. That also lets the peek nudge the cover card, which is parked
   outside the tile and so can't be teased from an inner wrapper. */
@media (min-width: 1024px) {
  .candid-slide {
    z-index: 2;
    transition: transform 0.55s cubic-bezier(0.22, 1, 0.36, 1);
    will-change: transform, translate;
    /* The periodic "you can slide me" tease. Safe to cancel on hover: it
       owns `translate`, never `transform`. */
    animation: candid-peek 5.5s ease-in-out infinite;
  }
  /* Exit direction, inherited by the .candid-slide within. --candid-peek is
     the matching tease offset: a fraction of the lid's own width, pointing
     the same way the lid will travel. */
  .candid--right {
    --candid-exit: calc(100% + 1.25rem);
    --candid-peek: 8%;
  }
  .candid--left {
    --candid-exit: calc(-100% - 1.25rem);
    --candid-peek: -8%;
  }
  /* Offset in time so the two tiles don't tease in unison. */
  .candid--right .candid-slide {
    animation-delay: 2.75s;
  }
  /* :hover still matches while the cursor rides the departing lid (it stays
     a descendant), so following it out doesn't snap the reveal shut.
     Killing the tease here drops `translate` back to 0 instantly, but the
     0.55s slide starting in the same frame more than covers that ≤8% hop. */
  .candid:hover > .candid-slide,
  .candid:focus-visible > .candid-slide {
    animation: none;
    transform: translateX(var(--candid-exit));
  }
  /* The reveal simply rests beneath the lid, one z-level down, and is
     uncovered as the lid clears the tile. */
  .candid-caption {
    z-index: 1;
  }
}

/* The tease: mostly at rest, then a single nudge toward (or into) the tile and
   back, so it reads as an occasional invitation rather than a loop. Animates
   `translate` only — see the note above on why it must never touch transform. */
@keyframes candid-peek {
  0%,
  74%,
  100% {
    translate: 0 0;
  }
  84% {
    translate: var(--candid-peek, -8%) 0;
  }
  93% {
    translate: 0 0;
  }
}

@media (prefers-reduced-motion: reduce) {
  .candid-slide {
    transition: none !important;
    animation: none !important;
  }
}
</style>
