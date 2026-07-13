<template>
  <!-- The section sits on a light wash of primary rather than the page
       white — a soft lavender ground that shows through the grid's gutters
       as tinted grout and gives the mid-to-deep card tints a related
       field to sit on. -->
  <section id="about" ref="root" class="relative z-20 text-foreground" :style="{ backgroundColor: usePrimaryTint(6) }">
    <div class="mx-auto max-w-6xl px-4 py-24 sm:px-6 lg:py-28">

      <!-- Editorial mosaic, same family as the cases grid: mixed-size tiles
           where the studio portrait is the anchor (name + qualifications sat
           on its scrim), two primary-tinted text tiles carry the bio at
           opposite corners, and three candid photos fill around them —
           personality by showing, not telling. Mobile keeps the mosaic as a
           two-column stack; lg pins every tile to an explicit slot in a
           3x4 arrangement of 2-col cells: the portrait holds the top-centre
           as a 1x2 column, the pull-quote runs two cells wide across its
           row, and the booking tile — itself a whole-tile link — stands
           1x2 tall down the bottom-right corner. Every slide target stays a
           single 1x1 cell. Every surface — the section wash included —
           comes off the shared primary tint ramp (usePrimaryTint). All
           cards carry white text, so they live in the 60-85 band (60 is
           where white first tests legible on the ramp), spread so
           edge-sharing surfaces — hover-revealed caption cards included —
           stay clearly apart. Full primary stays reserved for the one
           booking tile that has to catch the eye. Type is scaled per tile
           to how much copy it carries, so each box reads comfortably full
           at the fixed lg row height. -->
      <div class="grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-6 lg:grid-rows-[repeat(4,17rem)]">

        <!-- Intro — the top of the card ramp (85). Only the booking tile
             goes darker: full primary is reserved for the one surface that
             has to catch the eye. -->
        <div
          class="reveal col-span-2 flex flex-col rounded-xl p-6 text-white sm:p-8 lg:col-start-1 lg:row-start-1 lg:p-6"
          :style="{ backgroundColor: usePrimaryTint(85) }"
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
          :style="{ backgroundColor: usePrimaryTint(30) }"
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

        <!-- Candids — a square pair on mobile, singles slotted around on lg.
             On lg each photo is a lid over its own caption: hovering (or
             focusing) peels it exactly one grid cell over a neighbouring
             tile — the career deck's slide, transplanted — uncovering a
             line about the photo and where it was taken. deesha-1 rises up
             onto the intro tile, deesha-3 (middle foot) peels right onto the
             lapsed-visit tile; the "outside the practice" text tile runs the
             trick in reverse, sliding up to uncover the deesha-2 candid
             hiding beneath it.
             lg:z-10 because the section reveal leaves inline transforms on
             every tile, making each a stacking context — without it the
             later-in-DOM text tiles would paint over the travelling photo. -->
        <figure
          tabindex="0"
          class="candid reveal relative col-span-1 m-0 aspect-square rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-primary/40 lg:col-span-2 lg:col-start-1 lg:row-start-2 lg:z-10 lg:aspect-auto"
          :style="{ backgroundColor: usePrimaryTint(80) }"
        >
          <figcaption class="candid-caption absolute inset-0 m-0 flex flex-col justify-between p-6 text-white">
            <p class="m-0 font-display text-base font-light leading-relaxed text-white/85">
              Found the jacaranda in full bloom and refused to leave.
              I'll cross a whole city for a good garden.
            </p>
            <p class="m-0 flex items-center gap-3 font-display text-2xs uppercase tracking-label text-white/60">
              <span class="h-px w-8 bg-white/30" />
              Kew Gardens, London
            </p>
          </figcaption>
          <div class="candid-slide candid-slide-up absolute inset-0 overflow-hidden rounded-xl">
            <NuxtImg
              src="/images/deesha-1.jpg"
              alt="Dr Deesha beaming under a jacaranda tree in a glasshouse garden"
              sizes="50vw lg:33vw"
              loading="lazy"
              class="absolute inset-0 h-full w-full object-cover"
            />
          </div>
        </figure>

        <figure
          tabindex="0"
          class="candid reveal relative col-span-1 m-0 aspect-square rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-primary/40 lg:col-span-2 lg:col-start-3 lg:row-start-4 lg:z-10 lg:aspect-auto"
          :style="{ backgroundColor: usePrimaryTint(85) }"
        >
          <figcaption class="candid-caption absolute inset-0 m-0 flex flex-col justify-between p-6 text-white">
            <p class="m-0 font-display text-base font-light leading-relaxed text-white/85">
              A kiss for the Aquarius fountain. Every good city wander
              deserves a little ceremony.
            </p>
            <p class="m-0 flex items-center gap-3 font-display text-2xs uppercase tracking-label text-white/60">
              <span class="h-px w-8 bg-white/30" />
              Aquarius fountain, London
            </p>
          </figcaption>
          <div class="candid-slide candid-slide-right absolute inset-0 overflow-hidden rounded-xl">
            <NuxtImg
              src="/images/deesha-3.jpg"
              alt="Dr Deesha blowing a kiss beside the Aquarius fountain on a city wander"
              sizes="50vw lg:33vw"
              loading="lazy"
              class="absolute inset-0 h-full w-full object-cover"
            />
          </div>
        </figure>

        <!-- Pull-quote — the mid-ramp tint, a serif beat running two cells
             wide under the portrait. max-w keeps the line's measure honest
             across the double width. -->
        <div
          class="reveal col-span-2 flex flex-col justify-center rounded-xl p-6 text-white sm:p-8 lg:col-span-4 lg:col-start-1 lg:row-start-3"
          :style="{ backgroundColor: usePrimaryTint(60) }"
        >
          <p class="m-0 max-w-3xl font-serif font-normal leading-snug tracking-heading" style="font-size: clamp(1.6rem, 2.6vw, 2.4rem)">
            Good dentistry is quiet work. Gentle in the chair, plain in the explanation, made to last.
          </p>
        </div>

        <!-- The person outside the practice.
             The reverse of the candid trick: here the TEXT is the lid.
             Hovering slides the whole paragraph up, uncovering the deesha-2
             candid hiding beneath — the photo layer borrows .candid-caption
             for the same ease-in reveal. On mobile the lid simply sits in
             flow as a normal text tile. -->
        <div
          tabindex="0"
          class="candid reveal relative col-span-2 rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-primary/40 lg:col-start-5 lg:row-start-1 lg:z-10"
          :style="{ backgroundColor: usePrimaryTint(30) }"
        >
          <div class="candid-caption absolute inset-0 overflow-hidden rounded-xl">
            <NuxtImg
              src="/images/deesha-2.jpg"
              alt="Dr Deesha waving beside elephants bathing in a Chiang Mai river"
              sizes="100vw lg:33vw"
              loading="lazy"
              class="absolute inset-0 h-full w-full object-cover"
            />
            <div aria-hidden="true" class="absolute inset-x-0 bottom-0 bg-linear-to-t from-black/70 to-transparent pt-10" />
            <p class="absolute inset-x-0 bottom-0 m-0 flex items-center gap-3 p-6 font-display text-2xs uppercase tracking-label text-white/75">
              <span class="h-px w-8 bg-white/40" />
              Chiang Mai, Thailand
            </p>
          </div>
          <div
            class="candid-slide candid-slide-up relative flex flex-col rounded-xl p-6 text-white sm:p-8 lg:absolute lg:inset-0 lg:p-6"
            :style="{ backgroundColor: usePrimaryTint(70) }"
          >
            <p class="font-display text-base font-light leading-relaxed text-white/85">
              Away from the practice I'm usually outdoors on a long walk, cooking for far too many
              people, or hunting down a decent flat white. Whatever brings you in, a routine
              check-up or a whole new smile, you'll get the same unhurried attention.
            </p>
            <p class="mt-7 flex items-center gap-3 font-display text-2xs uppercase tracking-label text-white/60 lg:mt-auto">
              {{ practice.name }}
              <span aria-hidden="true" class="h-1 w-1 rounded-full bg-accent" />
              {{ practice.location }}
            </p>
          </div>
        </div>

        <!-- Lapsed-visit reassurance — the deesha-3 candid beside it peels
             right over this one on hover -->
        <div
          class="reveal col-span-2 flex flex-col rounded-xl p-6 text-white sm:p-8 lg:col-start-5 lg:row-start-4 lg:p-6"
          :style="{ backgroundColor: usePrimaryTint(65) }"
        >
          <p class="font-display text-base font-light leading-relaxed text-white/85 lg:text-lg">
            If it's been years since your last check-up, you won't get a lecture here —
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
          class="reveal col-span-2 flex flex-col rounded-xl p-6 text-white sm:p-8 lg:col-start-1 lg:row-start-4 lg:p-6"
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

        <!-- Booking — the ramp's full-strength endpoint, standing a full
             1x2 column down the grid's bottom-right corner (the deesha-2
             lid slides down over its neighbour, not this). The whole tile
             is the link: hover floods it with the accent, the same orange
             every other CTA resolves to (solid bg-primary class rather than
             an inline style, so hover:bg-accent can win). The action
             carries the serif headline; "Ready when you are." is its
             eyebrow. The extra vertical room lets the type run larger. -->
        <a
          :href="practice.bookingHref"
          class="reveal group col-span-2 flex flex-col items-start justify-center gap-5 rounded-xl bg-primary p-6 text-white outline-none transition-colors duration-250 ease-out hover:bg-accent focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 sm:p-8 lg:col-start-5 lg:row-span-2 lg:row-start-2"
        >
          <p class="font-display text-xs font-semibold uppercase tracking-eyebrow text-white/70">
            Ready when you are.
          </p>
          <p class="m-0 font-serif font-normal leading-snug tracking-heading" style="font-size: clamp(1.5rem, 2.4vw, 2.25rem)">
            Book an appointment
            <span aria-hidden="true" class="inline-block text-accent transition-all duration-250 ease-out group-hover:translate-x-0.5 group-hover:text-white">↗</span>
          </p>
        </a>

        <!-- Below lg deesha-2 stands alone: on desktop it hides under the
             "outside the practice" lid above, and a photo the mosaic paid
             for shouldn't vanish from phones. -->
        <figure
          class="reveal relative col-span-2 m-0 aspect-video overflow-hidden rounded-xl lg:hidden"
          :style="{ backgroundColor: usePrimaryTint(30) }"
        >
          <NuxtImg
            src="/images/deesha-2.jpg"
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

/* Candid hover-peel — desktop only; below lg the photos sit still and the
   captions stay tucked away underneath. The travel distance is one grid
   cell: the tile's own size plus the 1.25rem gutter (the grid's sm:gap-5),
   which works because every tile involved spans the same 2-of-6 columns
   and the lg rows are all the same fixed height. Timing and easing lifted
   from the career deck so the two interactions read as one family. */
@media (min-width: 1024px) {
  .candid-slide {
    transition:
      transform 0.55s cubic-bezier(0.22, 1, 0.36, 1),
      box-shadow 0.5s cubic-bezier(0.22, 1, 0.36, 1);
  }
  /* :hover covers the slid photo too (still a descendant), so following
     the picture with the cursor doesn't snap it shut. */
  .candid:hover > .candid-slide,
  .candid:focus-visible > .candid-slide {
    box-shadow: var(--shadow-card);
  }
  .candid:hover > .candid-slide-down,
  .candid:focus-visible > .candid-slide-down {
    transform: translateY(calc(100% + 1.25rem));
  }
  .candid:hover > .candid-slide-up,
  .candid:focus-visible > .candid-slide-up {
    transform: translateY(calc(-100% - 1.25rem));
  }
  /* Horizontal peel: one 2-col cell across is the tile's own width plus one
     gutter — the same magnitude as the vertical travel, since every cell is
     2-of-6 columns with a matching gap. */
  .candid:hover > .candid-slide-right,
  .candid:focus-visible > .candid-slide-right {
    transform: translateX(calc(100% + 1.25rem));
  }
  /* Caption eases in behind the departing photo, same as career content. */
  .candid-caption {
    opacity: 0;
    transition: opacity 0.5s ease;
  }
  .candid:hover .candid-caption,
  .candid:focus-visible .candid-caption {
    opacity: 1;
  }
}

@media (prefers-reduced-motion: reduce) {
  .candid-slide,
  .candid-caption {
    transition: none !important;
  }
}
</style>
