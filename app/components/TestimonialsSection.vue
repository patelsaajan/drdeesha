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
           the first card aligned with the heading above. Quotes aren't
           line-clamped here — the carousel is the only way these are read on
           mobile, and items-stretch keeps every card the height of the
           tallest. -->
      <UCarousel
        v-slot="{ item }"
        :items="mobileTestimonials"
        loop
        align="start"
        class="reveal testimonial-carousel mt-10 -mx-4 sm:-mx-6"
        :ui="{ container: 'ms-0 items-stretch', item: 'basis-[82%] ps-4 sm:basis-96 sm:ps-6' }"
        @select="(i: number) => (slide = i)"
      >
        <article class="flex h-full select-none flex-col justify-between gap-4 rounded-xl border border-foreground/10 bg-background p-6">
          <blockquote class="m-0 font-serif text-lg leading-snug text-foreground">
            &ldquo;{{ item.quote }}&rdquo;
          </blockquote>
          <div class="flex flex-wrap items-center gap-x-3 gap-y-1">
            <span class="font-display text-sm font-semibold tracking-wide text-foreground">{{ item.name }}</span>
            <span class="h-1 w-1 rounded-full bg-foreground/30" />
            <span class="font-display text-sm font-light text-foreground/55">{{ item.context }}</span>
            <span v-if="item.source" class="font-display text-3xs uppercase tracking-label text-foreground/40">· {{ item.source }}</span>
          </div>
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
              v-for="item in row"
              :key="item.id"
              class="testimonial-card flex h-52 w-72 shrink-0 flex-col justify-center gap-4 overflow-hidden rounded-xl border border-foreground/10 bg-background p-6 transition-all duration-300 hover:border-primary/20 hover:bg-primary/5 hover:shadow-card sm:w-80"
            >
              <blockquote class="m-0 line-clamp-3 font-serif text-lg leading-snug text-foreground">
                &ldquo;{{ item.quote }}&rdquo;
              </blockquote>
              <div class="flex flex-wrap items-center gap-x-3 gap-y-1">
                <span class="font-display text-sm font-semibold tracking-wide text-foreground">{{ item.name }}</span>
                <span class="h-1 w-1 rounded-full bg-foreground/30" />
                <span class="font-display text-sm font-light text-foreground/55">{{ item.context }}</span>
                <span v-if="item.source" class="font-display text-3xs uppercase tracking-label text-foreground/40">· {{ item.source }}</span>
              </div>
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

// Always exactly 3 rows (top/middle/bottom, alternating scrub direction) —
// however many testimonials there are get split evenly across them.
const ROW_COUNT = 3
const perRow = Math.ceil(testimonials.length / ROW_COUNT)
const rows = Array.from(
  { length: ROW_COUNT },
  (_, i) => testimonials.slice(i * perRow, i * perRow + perRow),
)

// Mobile shows a short loop, not the full set — eight swipes is plenty to
// make the point, and the counter stays legible.
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

// How far a row's content runs past its clip wrapper — the distance the
// scrub has to travel to bring the hidden cards fully into view.
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
