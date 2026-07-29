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
           and candid photos fill in on desktop — personality by showing,
           not telling. Below lg the personal candids (jacaranda, the
           elephants) drop out, so a patient scrolling on their phone only
           meets the tiles that actually help them size up a dentist — bio,
           the chairside photo, the open invitation, the quiet-work quote,
           the reassurance CTA, the portrait, and the philosophy copy — as a
           lean two-column stack, the reassurance CTA leading the booking
           moment and the booking CTA closing it. lg pins
           every tile to an explicit slot across five 17rem rows: a
           full-width row leads with the professional bio, then a 6-col
           arrangement of the rest — the portrait holds the top-centre as a
           1x2 column, the pull-quote runs two cells wide across its row, and
           the intro paragraph stands 1x2 tall down the right side — the
           booking tile, itself a whole-tile link, takes its old single-row
           slot instead. Every slide target stays a single 1x1 cell. Every
           surface — the section wash included — comes off the shared
           primary tint ramp (usePrimaryTint), and no cell drops below 50.
           Text cards spread across that ramp (67, 67, 73, 73, 80), placed so
           no two edge-sharing surfaces land near each other; photo tiles sit at
           50 as a load-time ground the image covers anyway. Full primary
           (bg-primary, the ramp's dark end) belongs to the booking CTAs — a
           class rather than an inline tint so hover:bg-accent can win. Only
           the section wash sits light, at 6: it's the ground the gutters show
           as grout, not a cell. Type is scaled per tile to the room it has —
           the 1x2 intro carries the largest body size, the 4-col bio a step
           under it — so each box reads comfortably full at its row height. -->
      <div class="mt-14 grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-6 lg:grid-rows-[repeat(5,17rem)]">

        <!-- The professional bio — leads the mosaic right under the section
             title, sharing row one with the chairside photo beside it. Sits
             mid-ramp at 67; its only text neighbour is the booking CTA
             directly below at full primary, so it has room to run deep without
             crowding anything. -->
        <div
          class="reveal col-span-2 flex flex-col justify-center rounded-xl p-6 text-white sm:p-8 lg:col-span-4 lg:col-start-1 lg:row-start-1 lg:p-6"
          :style="{ backgroundColor: usePrimaryTint(67) }"
        >
          <!-- lg:text-xl — the widest tile in the mosaic, so the copy can run
               up a step and still hold its 4-col measure inside one row. -->
          <p class="font-display text-base font-light leading-relaxed text-white/85 lg:text-xl">
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
          :style="{ backgroundColor: usePrimaryTint(50) }"
        >
          <NuxtImg
            src="/images/about/chairside.png"
            alt="Dr Deesha treating a patient chairside, with a dental nurse assisting"
            sizes="100vw lg:33vw"
            loading="lazy"
            class="absolute inset-0 h-full w-full object-cover"
          />
        </figure>

        <!-- An open invitation — sits early in the mobile stack, right after
             the chairside photo and ahead of the quote and reassurance CTA
             that follow it. lg:col-start-5 lg:row-start-2 seats it in the
             right column alongside the portrait on desktop, independent of
             this source position.
             The lightest text tile, and 67 is its floor: the surrounding
             tiles all came down 5 in the same pass, but this one stopped at 3
             because a further 2 puts its white/85 body copy at 4.42:1, under
             the 4.5:1 AA needs for text this size. Don't round it down to 65
             for tidiness without darkening the text. -->
        <div
          class="reveal col-span-2 flex flex-col justify-center rounded-xl p-6 text-white sm:p-8 lg:col-start-5 lg:row-start-2 lg:p-6"
          :style="{ backgroundColor: usePrimaryTint(67) }"
        >
          <p class="m-0 font-display text-base font-light leading-relaxed text-white/85 lg:text-xl">
            Questions are welcome, and so are second opinions. Bring the X-rays,
            the worries, the photo of the smile you're after.
          </p>
        </div>

        <!-- Pull-quote — the mid-ramp tint, a serif beat placed just ahead
             of the reassurance CTA below so the sentiment lands right before
             that ask on the mobile stack. It keeps its lg:row-start-4
             desktop slot regardless, running two cells wide under the
             portrait; max-w keeps the line's measure honest across the
             double width. -->
        <div
          class="reveal col-span-2 flex flex-col justify-center rounded-xl p-6 text-white sm:p-8 lg:col-span-4 lg:col-start-1 lg:row-start-4"
          :style="{ backgroundColor: usePrimaryTint(73) }"
        >
          <!-- Written and sized to land on two lines. Copy length and size are
               a pair here: the cap goes up to 2.75rem precisely because the
               copy came down — two lines at the old 2.25rem left the card half
               empty. Keep the copy near this length; the row is a fixed 17rem
               and this tile doesn't clip, so a third line would show. -->
          <p class="m-0 max-w-3xl font-serif font-normal leading-snug tracking-heading" style="font-size: clamp(1.6rem, 2.9vw, 2.75rem)">
            Good dentistry is quiet work. Gentle, plain, lasting.
          </p>
        </div>

        <!-- The reassurance CTA — the lapsed-visit reassurance promoted into
             the booking action itself. Moved up in source order, ahead of
             the booking CTA below, so it's the first booking prompt a
             visitor meets on mobile, right under the quote above; the
             reassurance stays the headline (it's what earns the click —
             "Book an appointment" on its own asks without answering the
             worry), so the invitation reads as the consequence of it rather
             than a bare button. Whole tile is the link, same accent flood on
             hover as every other CTA. Desktop position is unaffected:
             lg:row-start-5 lg:col-start-3 still place it in the mosaic's
             bottom row beside the jacaranda candid, independent of source
             order. -->
        <a
          :href="practice.bookingHref"
          class="reveal group col-span-2 flex flex-col justify-center gap-6 rounded-xl bg-primary p-6 text-white outline-none transition-colors duration-250 ease-out hover:bg-accent hover:text-primary focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 sm:p-8 lg:col-span-4 lg:col-start-3 lg:row-start-5 lg:p-8"
        >
          <p class="m-0 font-display text-2xs uppercase tracking-label text-white/60 transition-colors group-hover:text-primary/70">
            New patients welcome
          </p>
          <p class="m-0 max-w-2xl font-serif font-normal leading-snug tracking-heading transition-colors" style="font-size: clamp(1.15rem, 1.7vw, 1.55rem)">
            If it's been years since your last check-up, you won't get a lecture here.
            Just a clear plan, and a bit of credit for showing up.
          </p>
          <p class="m-0 flex items-center gap-2 font-display text-sm font-semibold uppercase tracking-label text-white transition-colors group-hover:text-primary">
            Book an appointment
            <span aria-hidden="true" class="inline-block text-accent transition-all duration-250 ease-out group-hover:translate-x-0.5 group-hover:text-primary">↗</span>
          </p>
        </a>

        <!-- The anchor portrait — name and qualifications live on the photo -->
        <figure
          class="reveal relative col-span-2 m-0 aspect-3/4 overflow-hidden rounded-xl sm:aspect-square lg:col-start-3 lg:row-span-2 lg:row-start-2 lg:aspect-auto"
          :style="{ backgroundColor: usePrimaryTint(50) }"
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

        <!-- Candids — desktop only (see the mosaic-level comment above): the
             jacaranda print sits plain; only the "outside the practice"
             text tile is interactive, its text card sliding off toward the
             mosaic's left edge to reveal the deesha-2 candid hiding under it.
             lg:overflow-hidden clips that lid at the tile bound, so it appears
             to slip *under* the mosaic's edge rather than float out over the
             section wash. candid--left / --right set the exit direction. -->
        <!-- Jacaranda — a plain print closing the mosaic's bottom-left corner.
             No caption and no slide: just the photograph. A personal travel
             shot earns its place in the full desktop mosaic but isn't
             something a patient needs to see to size up a dentist, so it's
             hidden below lg rather than competing with the credential and
             reassurance tiles for scroll space. -->
        <figure
          class="reveal relative hidden m-0 overflow-hidden rounded-xl lg:col-span-2 lg:col-start-1 lg:row-start-5 lg:block lg:aspect-auto"
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

        <!-- The person outside the practice — the same mechanic as the
             jacaranda tile, just with the roles reversed: here the TEXT is the
             lid. It's the tile's resting face and the only moving part,
             sliding off to the left (clipped at the tile edge, so it vanishes
             under the mosaic's left border) to uncover the deesha-2 candid
             waiting beneath. candid--left because the tile hugs the mosaic's
             left column — direction always tracks which outer edge it sits on.
             Hidden below lg along with the other candids: its resting face is
             personal-interest copy (Pilates, hiking, baking), which isn't
             what a patient is scrolling for on mobile, and the hover/focus
             swap it exists for has no mobile equivalent anyway. -->
        <div
          tabindex="0"
          class="candid candid--left reveal relative col-span-2 hidden rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-primary/40 lg:col-start-1 lg:row-start-3 lg:block lg:overflow-hidden"
          :style="{ backgroundColor: usePrimaryTint(50) }"
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
            :style="{ backgroundColor: usePrimaryTint(73) }"
          >
            <p class="font-display text-base font-light leading-relaxed text-white/85 lg:text-xl">
              Outside of dentistry, you'll usually find me at Pilates, hiking somewhere with a
              good view, being an amateur nail tech, or trying out new baking recipes.
            </p>
          </div>
        </div>

        <!-- Intro — the top of the card ramp (80), now standing a full 1x2
             column down the grid's bottom-right corner where the booking
             tile used to sit (the deesha-2 lid slides down over its
             neighbour, not this). Only the booking tile goes darker: full
             primary is reserved for the one surface that has to catch the
             eye. -->
        <div
          class="reveal col-span-2 flex flex-col justify-center rounded-xl p-6 text-white sm:p-8 lg:col-start-5 lg:row-span-2 lg:row-start-3"
          :style="{ backgroundColor: usePrimaryTint(80) }"
        >
          <!-- lg:text-2xl — the only 1x2 text tile, so it has roughly twice
               the vertical room per word and carries the largest body size. -->
          <p class="font-display text-base font-light leading-relaxed text-white/85 lg:text-2xl">
            I believe dentistry is about much more than teeth. Visiting the dentist can feel
            daunting, so I aim to create a calm, supportive experience. Whether it's a gentle
            aesthetic enhancement or getting you out of pain, your comfort always comes first.
          </p>
        </div>

        <!-- Booking — the ramp's full-strength endpoint, a single 1x1 cell
             that sits in what used to be the intro's slot on desktop (the
             intro paragraph swapped down into the old 1x2 booking slot
             below), via lg:row-start-2. Moved last in source order so on
             mobile it closes the stack as the final booking prompt — the
             reassurance CTA above now leads instead. The whole tile is the
             link: hover floods it with the accent, the same colour every
             other CTA resolves to (solid bg-primary class rather than an
             inline style, so hover:bg-accent can win). The action carries
             the serif headline; "Ready when you are." is its eyebrow. -->
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

      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { practice } from '../data/contact'

// Tiles ride the site's shared staggered entrance, in DOM order — the bio
// row, then chairside, and the rest cascading in behind them, booking CTA
// last. A slightly wider stagger than the default so each square lands as
// its own beat.
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
