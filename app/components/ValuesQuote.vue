<template>
  <section ref="root" class="relative z-20 flex min-h-dvh flex-col justify-center overflow-hidden bg-primary-soft text-foreground">
    <div class="reveal mx-auto max-w-4xl px-4 py-24 sm:px-6 lg:py-28">
      <p class="font-display text-xs font-semibold uppercase tracking-eyebrow text-primary">
        In my words
      </p>
      <blockquote class="mt-8 font-serif font-normal leading-quote tracking-heading text-foreground" style="font-size: clamp(1.75rem, 4.2vw, 3.25rem)">
        &ldquo;Every patient carries something into that chair. My job starts before the
        drill, with listening. Precision makes the work last, but patience is what
        rebuilds trust.&rdquo;
      </blockquote>
      <p class="mt-8 flex justify-end font-display text-sm font-semibold uppercase tracking-label text-foreground/55">
        — Dr Deesha
      </p>
    </div>
  </section>
</template>

<script setup lang="ts">
import gsap from 'gsap'

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
        })
      },
      { threshold: 0.2 },
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
