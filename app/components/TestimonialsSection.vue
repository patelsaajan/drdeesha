<template>
  <!-- Pinned (scroll locked) until the row-scrub below finishes: the top and
       bottom rows slide right, the middle row slides left, each revealing
       cards that start hidden off one edge. The footer sits at a lower
       z-index than this section (see SiteFooter.vue), so during the pin it
       stays hidden behind rather than visibly sliding over it — it only
       becomes visible once the pin releases and both are back in normal,
       non-overlapping flow. -->
  <section ref="root" class="relative z-20 flex min-h-dvh flex-col overflow-x-clip bg-background text-foreground">
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
    <div class="flex flex-1 flex-col justify-center gap-5 pb-8 pt-4">
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

const root = ref<HTMLElement | null>(null)
const rowRefs: (HTMLElement | null)[] = []
function setRowRef(el: Element | null, i: number) {
  rowRefs[i] = el as HTMLElement | null
}

let ctx: gsap.Context | undefined
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

    // Once the section fills the screen ('top top'), pin it (locking scroll)
    // and scrub each row horizontally over the extra scroll distance below.
    // Odd rows (top, bottom) start with their overflow hidden off the left
    // and slide right to reveal it; the middle row does the reverse.
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: el,
        start: 'top top',
        end: '+=200%',
        scrub: 0.8,
        pin: true,
        pinSpacing: true,
        anticipatePin: 1,
        invalidateOnRefresh: true,
      },
    })

    rowRefs.forEach((rowEl, i) => {
      if (!rowEl) return
      const revealsRight = i % 2 === 0
      if (revealsRight) {
        gsap.set(rowEl, { x: () => -rowExtra(rowEl) })
        tl.to(rowEl, { x: 0, ease: 'none' }, 0)
      } else {
        gsap.set(rowEl, { x: 0 })
        tl.to(rowEl, { x: () => -rowExtra(rowEl), ease: 'none' }, 0)
      }
    })
  }, el)
})

onUnmounted(() => {
  observer?.disconnect()
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
</style>
