<template>
  <!-- No background on this section — the fixed "Dr Deesha Dental" hero title
       shows through the gaps between cards, the same trick the hero grid uses. -->
  <section ref="root" class="relative z-20 overflow-x-hidden text-foreground">
    <div class="mx-auto max-w-6xl px-4 py-24 sm:px-6 lg:py-28">
      <header class="max-w-2xl">
        <p class="reveal font-display text-xs font-semibold uppercase tracking-eyebrow text-primary">
          Kind words
        </p>
        <h2 class="reveal mt-5 font-serif font-normal leading-heading tracking-heading" style="font-size: clamp(2rem, 4vw, 3.25rem)">
          What patients say about me.
        </h2>
        <p class="reveal mt-4 font-display text-base font-light leading-relaxed text-foreground/65">
          A few of the reviews that mean the most to me.
        </p>
      </header>

      <!-- Row 1 — the whole row moves together as one block, sliding in from the left -->
      <div ref="rowOneRef" class="mt-14 grid gap-5 sm:grid-cols-3">
        <article
          v-for="item in rowOne"
          :key="item.id"
          class="testimonial-card flex flex-col gap-5 rounded-xl border border-foreground/10 bg-background p-6 transition-shadow duration-300 hover:shadow-card sm:p-7"
        >
          <blockquote class="m-0 font-serif text-lg leading-snug text-foreground">
            &ldquo;{{ item.quote }}&rdquo;
          </blockquote>
          <div class="mt-auto flex flex-wrap items-center gap-x-3 gap-y-1">
            <span class="font-display text-sm font-semibold tracking-wide text-foreground">{{ item.name }}</span>
            <span class="h-1 w-1 rounded-full bg-foreground/30" />
            <span class="font-display text-sm font-light text-foreground/55">{{ item.context }}</span>
            <span v-if="item.source" class="font-display text-3xs uppercase tracking-label text-foreground/40">· {{ item.source }}</span>
          </div>
        </article>
      </div>

      <!-- Row 2 — wider cards, the row moves together as one block from the right -->
      <div ref="rowTwoRef" class="mt-5 grid gap-5 sm:grid-cols-2">
        <article
          v-for="item in rowTwo"
          :key="item.id"
          class="testimonial-card flex flex-col gap-5 rounded-xl border border-foreground/10 bg-background p-6 transition-shadow duration-300 hover:shadow-card sm:p-7"
        >
          <blockquote class="m-0 font-serif text-lg leading-snug text-foreground">
            &ldquo;{{ item.quote }}&rdquo;
          </blockquote>
          <div class="mt-auto flex flex-wrap items-center gap-x-3 gap-y-1">
            <span class="font-display text-sm font-semibold tracking-wide text-foreground">{{ item.name }}</span>
            <span class="h-1 w-1 rounded-full bg-foreground/30" />
            <span class="font-display text-sm font-light text-foreground/55">{{ item.context }}</span>
            <span v-if="item.source" class="font-display text-3xs uppercase tracking-label text-foreground/40">· {{ item.source }}</span>
          </div>
        </article>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { testimonials } from '../data/testimonials'

const rowOne = testimonials.slice(0, 3)
const rowTwo = testimonials.slice(3)

const rowOneRef = ref<HTMLElement | null>(null)
const rowTwoRef = ref<HTMLElement | null>(null)

const root = ref<HTMLElement | null>(null)
let ctx: gsap.Context | undefined

onMounted(() => {
  const el = root.value
  const rowOneEl = rowOneRef.value
  const rowTwoEl = rowTwoRef.value
  if (!el || !rowOneEl || !rowTwoEl) return

  const reveals = gsap.utils.toArray<HTMLElement>(el.querySelectorAll('.reveal'))
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  if (reduce) {
    gsap.set(reveals, { autoAlpha: 1, y: 0 })
    gsap.set([rowOneEl, rowTwoEl], { x: 0 })
    return
  }

  gsap.registerPlugin(ScrollTrigger)

  gsap.set(reveals, { autoAlpha: 0, y: 28 })
  // Each row is a single rigid block — it moves as one item, so the gap
  // between its cards never changes during the transition.
  gsap.set(rowOneEl, { xPercent: -100 })
  gsap.set(rowTwoEl, { xPercent: 100 })

  ctx = gsap.context(() => {
    // Header: a normal one-shot fade, matching every other section on the site.
    ScrollTrigger.create({
      trigger: el,
      start: 'top 75%',
      once: true,
      onEnter: () => gsap.to(reveals, { autoAlpha: 1, y: 0, duration: 0.9, stagger: 0.12, ease: 'expo.out' }),
    })

    // Rows: tied directly to scroll position, not autoplayed. Doesn't start
    // until this section has scrolled up to fill the whole screen (so the
    // fixed "Dr Deesha Dental" backdrop is already at full height). The
    // section is pinned for the scrub's duration, so scrolling further can't
    // carry you into the footer until the cards have fully arrived — scroll
    // back up and it un-pins the same way in reverse.
    gsap.timeline({
      scrollTrigger: {
        trigger: el,
        start: 'top top',
        end: '+=100%',
        scrub: 0.4,
        pin: true,
        pinSpacing: true,
        anticipatePin: 1,
      },
    })
      .to(rowOneEl, { xPercent: 0, ease: 'none' }, 0)
      .to(rowTwoEl, { xPercent: 0, ease: 'none' }, 0)
  }, el)
})

onUnmounted(() => {
  ctx?.revert()
})
</script>

<style scoped>
@media (prefers-reduced-motion: no-preference) {
  .reveal {
    opacity: 0;
  }
}
</style>
