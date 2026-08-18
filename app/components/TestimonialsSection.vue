<template>
  <section id="testimonials" ref="root" class="relative z-20 bg-background text-foreground">
    <!-- Mobile: the pinned scrub below needs a pointer and a tall viewport,
         so under lg the same cards become a thumb-driven carousel — one card
         mostly full-width, the next peeking in from the edge as the swipe
         affordance, with a plain running count underneath. -->
    <div class="px-4 pt-24 pb-20 sm:px-6 lg:hidden">
      <p class="reveal font-display text-xs font-semibold uppercase tracking-eyebrow text-primary">
        Kind words
      </p>
      <h2 class="reveal mt-4 font-serif font-normal leading-heading tracking-heading" style="font-size: clamp(2rem, 4vw, 3.25rem)">
        What patients say about me.
      </h2>

      <!-- Full-bleed viewport (negative margins undo the section padding) so
           the peeking card runs to the screen edge; ms-0 + per-item ps keeps
           the first card aligned with the heading above.
           items-stretch keeps every card the height of the tallest, which is
           why the quote has to be clamped here even though only one card is
           read at a time: unclamped, the single longest review in the set
           sizes ALL eight, and a ~660-character one runs past 640px on a
           narrow screen. Ten lines caps the tallest at ~324px and every other
           card follows it down. -->
      <UCarousel
        v-slot="{ item }"
        :items="mobileTestimonials"
        loop
        align="start"
        class="reveal testimonial-carousel mt-10 -mx-4 sm:-mx-6"
        :ui="{ container: 'ms-0 items-stretch', item: 'basis-[82%] ps-4 sm:basis-96 sm:ps-6' }"
        @select="(i: number) => (slide = i)"
      >
        <article class="flex h-full select-none flex-col justify-between gap-2 rounded-xl border border-foreground/10 bg-background p-6">
          <blockquote class="m-0 line-clamp-10 font-serif text-lg leading-snug text-foreground">
            &ldquo;{{ item.quote }}&rdquo;
          </blockquote>
          <p class="m-0 text-right font-display text-sm font-semibold tracking-wide text-foreground">
            {{ item.name }}
          </p>
        </article>
      </UCarousel>

      <p class="reveal mt-6 font-display text-2xs uppercase tracking-label tabular-nums text-foreground/45">
        {{ slide + 1 }} / {{ mobileTestimonials.length }}
      </p>
    </div>

    <!-- Desktop: pinned (scroll locked) until the row-scrub finishes: the top
         and bottom rows slide right, the middle row slides left, each
         revealing cards that start hidden off one edge. The pin then holds
         for one extra viewport while the footer — z-raised above this
         section on lg (see SiteFooter.vue) — pulls up over it like a
         curtain, so the section exits covered rather than scrolled past. -->
    <div ref="desk" class="hidden min-h-dvh flex-col overflow-x-clip lg:flex">
      <!-- Reserved band: exactly the top 1/5 of the section, eyebrow + heading
           centred within it. -->
      <div class="flex h-[20dvh] w-full items-center px-4 sm:px-6">
        <div class="mx-auto w-full max-w-6xl">
          <p class="reveal font-display text-xs font-semibold uppercase tracking-eyebrow text-primary">
            Kind words
          </p>
          <h2 class="reveal mt-4 font-serif font-normal leading-heading tracking-heading" style="font-size: clamp(2rem, 4vw, 3.25rem)">
            What patients say about me.
          </h2>
        </div>
      </div>

      <!-- Each row is its own full-viewport-width band, not capped by any
           max-width container — matches the career timeline's row treatment
           elsewhere on the page. Cards are fixed-width and don't wrap, so each
           row's content runs wider than the viewport; the clip wrapper hides
           the overflow until the scrub above reveals it. -->
      <div class="flex flex-1 flex-col justify-center gap-5 py-4">
        <div
          v-for="(row, i) in rows"
          :key="i"
          class="testimonial-row-clip w-full overflow-hidden px-2 sm:px-3"
        >
          <div :ref="(el) => setRowRef(el, i)" class="flex w-max gap-5">
            <article
              v-for="(item, j) in row"
              :key="`${item.id}-${j}`"
              class="testimonial-card flex min-h-53 shrink-0 flex-col justify-between gap-2 overflow-hidden rounded-xl border border-foreground/10 bg-background p-6 transition-all duration-300 hover:border-primary/20 hover:bg-primary/5 hover:shadow-card"
            >
              <blockquote class="m-0 line-clamp-5 font-serif text-lg leading-snug text-foreground">
                &ldquo;{{ item.quote }}&rdquo;
              </blockquote>
              <p class="m-0 text-right font-display text-sm font-semibold tracking-wide text-foreground">
                {{ item.name }}
              </p>
            </article>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { testimonials } from '../data/testimonials'

// The row count follows the data. A row needs roughly five 28vw cards to
// out-measure the viewport and have any distance left to scrub, so the set
// is spread over as many rows as it can genuinely fill, capped at the
// design's three. At 10 reviews that is 2 rows of 5; it becomes 3 rows
// at 15, which is the count the three-band layout really wants.
const MIN_PER_ROW = 5
const ROW_COUNT = Math.max(1, Math.min(3, Math.floor(testimonials.length / MIN_PER_ROW)))

// Split by proportional boundaries rather than Math.ceil(n / ROW_COUNT) slices.
// Ceil front-loads the early rows and dumps the remainder on the last one —
// 16 reviews would go 6/6/4 — and since the SHORTEST row is what decides
// whether a band has room to scrub, that runt row is exactly what stalls.
// Proportional boundaries even it out to 6/5/5 instead.
const baseRows = Array.from({ length: ROW_COUNT }, (_, i) => testimonials.slice(
  Math.floor((i * testimonials.length) / ROW_COUNT),
  Math.floor(((i + 1) * testimonials.length) / ROW_COUNT),
))

// Each row then repeats its own first few reviews at its tail, stretching the
// strip so the scrub has real distance to cover. Repeating WITHIN the row is
// the only safe direction: all rows are on screen at once, so borrowing a
// review from another row would put the copy in plain sight beside its twin.
// In-row, a card and its repeat are a full base row apart — at least five
// 28vw cards, ~140vw — wider than the 100vw window, so the pair is never
// visible together at any scrub position. (That guarantee is why REPEAT_EXTRA
// must stay ≤ MIN_PER_ROW's separation: the repeats never wrap far enough to
// close the gap.)
const REPEAT_EXTRA = 3
const rows = baseRows.map(row => [...row, ...row.slice(0, REPEAT_EXTRA)])

// Mobile shows a short loop of the real set — never the padded one, since a
// carousel you swipe through would make the repeats obvious. Eight swipes is
// plenty to make the point, and the counter stays legible.
const mobileTestimonials = testimonials.slice(0, 8)

// Mobile carousel position, for the running count under it.
const slide = ref(0)

const root = ref<HTMLElement | null>(null)
const desk = ref<HTMLElement | null>(null)
const rowRefs: (HTMLElement | null)[] = []
function setRowRef(el: Element | null, i: number) {
  rowRefs[i] = el as HTMLElement | null
}

let ctx: gsap.Context | undefined
let mm: gsap.MatchMedia | undefined
let observer: IntersectionObserver | undefined

// How far a row's content shifts during the scrub: its full overflow, so the
// repeated tail cards each get their moment before the footer curtain rises.
// With the padded rows that lands around 1.2–1.4 viewport widths of travel
// spread over 2.8 viewport heights of scroll — a proper glide rather than
// the old 200px drift, still front-loaded by the ease so the rows are
// creeping by the time the footer crosses in.
function rowExtra(rowEl: HTMLElement) {
  const clip = rowEl.parentElement
  if (!clip) return 0
  return Math.max(0, rowEl.scrollWidth - clip.clientWidth)
}

onMounted(() => {
  const el = root.value
  const deskEl = desk.value
  if (!el) return

  const reveals = gsap.utils.toArray<HTMLElement>(el.querySelectorAll('.reveal'))
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  if (reduce) {
    gsap.set(reveals, { autoAlpha: 1, y: 0 })
    return
  }

  gsap.set(reveals, { autoAlpha: 0, y: 28 })
  gsap.registerPlugin(ScrollTrigger)

  ctx = gsap.context(() => {
    observer = new IntersectionObserver(
      ([entry], obs) => {
        if (!entry?.isIntersecting) return
        obs.disconnect()

        gsap.timeline({ defaults: { ease: 'expo.out' } }).to(reveals, {
          autoAlpha: 1,
          y: 0,
          duration: 0.9,
          stagger: 0.08,
        })
      },
      { threshold: 0.15 },
    )
    observer.observe(el)
  }, el)

  // The pin + row scrub is desktop-only (the mobile layout is the carousel
  // above, display:none'd out of lg). gsap.matchMedia builds it when the lg
  // query matches and reverts it — inline transforms included — when it
  // stops matching, so crossing the breakpoint by resize/rotation is safe.
  if (!deskEl) return
  mm = gsap.matchMedia()
  mm.add('(min-width: 1024px)', () => {
    // Once the section fills the screen ('top top'), pin it (locking scroll)
    // and scrub each row horizontally over the extra scroll distance below.
    // Odd rows (top, bottom) start with their overflow hidden off the left
    // and slide right to reveal it; the middle row does the reverse.
    // Over the 3-viewport pin the rows run eased (power2.out) for 1.4 of
    // the 1.5-long timeline: quick out of the gate, decelerating so that
    // by the 2-viewport mark (timeline 1.0) they're ~90% home and creeping
    // — which is exactly where the footer's top edge crosses into view, so
    // the curtain starts climbing while the cards are still drifting the
    // last few pixels. The footer's flow position is pulled up by the
    // deck's full MEASURED height — not 100dvh, because on shorter
    // viewports the deck runs taller than one viewport and that difference
    // opens a dead-scroll gap between rows and curtain. With margin
    // -deskHeight and exactly 3 viewports of pin, the footer fully covers
    // the screen at the moment the pin releases.
    const footerEl = document.getElementById('contact')

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: deskEl,
        start: 'top top',
        end: () => `+=${window.innerHeight * 3}`,
        scrub: 0.8,
        pin: true,
        pinSpacing: true,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        // Runs before every refresh's measurements (including the initial
        // one), so resizes keep the pull-up in step with the deck's
        // current height.
        onRefreshInit: () => {
          if (footerEl) gsap.set(footerEl, { marginTop: -deskEl.offsetHeight })
        },
      },
    })

    rowRefs.forEach((rowEl, i) => {
      if (!rowEl) return
      const revealsRight = i % 2 === 0
      if (revealsRight) {
        gsap.set(rowEl, { x: () => -rowExtra(rowEl) })
        tl.to(rowEl, { x: 0, ease: 'power2.out', duration: 1.4 }, 0)
      } else {
        gsap.set(rowEl, { x: 0 })
        tl.to(rowEl, { x: () => -rowExtra(rowEl), ease: 'power2.out', duration: 1.4 }, 0)
      }
    })

    // Dead tail to 1.5 — pads the timeline so the full pin distance stays
    // 3 viewports and the rows' 1.4 lands at 2.8 viewports of scroll.
    tl.to({}, { duration: 0.5 }, 1)

    // Leaving lg: hand the footer its normal flow position back.
    return () => {
      if (footerEl) footerEl.style.marginTop = ''
    }
  })
})

onUnmounted(() => {
  observer?.disconnect()
  mm?.revert()
  ctx?.revert()
})
</script>

<style scoped>
/* Card width is fluid rather than fixed, and that is load-bearing, not
   cosmetic: a row only scrubs while it out-measures the viewport, so a fixed
   width silently stops working once the screen outgrows it. At the previous
   flat 408px the five-card rows were narrower than the screen from ~2100px
   up — no travel at all, and the band left-aligned with dead space beside it.
   Tying the card to 28vw keeps the invariant at any width: a row of n cards
   spans n × 28vw, which clears 100vw for any n ≥ 4, so the rows scale with
   the screen instead of being outrun by it. 28vw is the value that lands on
   ~400px at 1440, matching the size the design was tuned at. The bounds stop
   it turning silly on the extremes; past roughly 3400px the max takes over
   and the invariant lapses, which is well beyond any real desktop. */
.testimonial-card {
  width: clamp(20rem, 28vw, 44rem);
}

@media (prefers-reduced-motion: no-preference) {
  .reveal {
    opacity: 0;
  }
}

/* Fades each row's edges toward transparent rather than cutting cards off
   with a hard clip — an alpha mask, not an overlay, so it always matches
   whatever's actually behind it. */
.testimonial-row-clip {
  -webkit-mask-image: linear-gradient(to right, transparent, black 6%, black 94%, transparent);
  mask-image: linear-gradient(to right, transparent, black 6%, black 94%, transparent);
}

/* Same device on the mobile carousel, sized in rems so the fade stays a
   sliver at the screen edges instead of eating into the active card. */
.testimonial-carousel {
  -webkit-mask-image: linear-gradient(to right, transparent, black 1.25rem, black calc(100% - 1.25rem), transparent);
  mask-image: linear-gradient(to right, transparent, black 1.25rem, black calc(100% - 1.25rem), transparent);
}
</style>
