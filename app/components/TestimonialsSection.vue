<template>
  <!-- Sticky + full-height: once its top hits the viewport, it holds in place
       while the footer (next in flow) scrolls up and slides over it. -->
  <section ref="root" class="sticky top-0 z-20 flex min-h-dvh flex-col justify-center bg-background text-foreground">
    <div class="mx-auto w-full max-w-6xl px-4 py-24 sm:px-6 lg:py-28">
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

      <!-- Row 1 -->
      <div class="mt-14 grid gap-5 sm:grid-cols-3">
        <article
          v-for="item in rowOne"
          :key="item.id"
          class="reveal testimonial-card flex flex-col gap-5 rounded-xl border border-foreground/10 bg-background p-6 transition-shadow duration-300 hover:shadow-card sm:p-7"
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

      <!-- Row 2 — wider cards -->
      <div class="mt-5 grid gap-5 sm:grid-cols-2">
        <article
          v-for="item in rowTwo"
          :key="item.id"
          class="reveal testimonial-card flex flex-col gap-5 rounded-xl border border-foreground/10 bg-background p-6 transition-shadow duration-300 hover:shadow-card sm:p-7"
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
import { testimonials } from '../data/testimonials'

const rowOne = testimonials.slice(0, 3)
const rowTwo = testimonials.slice(3)

const root = ref<HTMLElement | null>(null)
let ctx: gsap.Context | undefined
let observer: IntersectionObserver | undefined

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
</style>
