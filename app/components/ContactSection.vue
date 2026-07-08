<template>
  <section id="contact" ref="root" class="relative z-20 bg-background text-foreground">
    <div class="mx-auto max-w-6xl px-4 py-24 sm:px-6 lg:py-28">

      <div class="max-w-3xl">
        <p class="reveal font-display text-[0.72rem] font-semibold uppercase tracking-[0.35em] text-primary">
          Get in touch
        </p>
        <h2 class="reveal mt-5 font-serif text-[clamp(2.25rem,5vw,4rem)] font-normal leading-[1.02] tracking-[-0.01em]">
          Come in for a visit.
        </h2>
        <p class="reveal mt-5 max-w-xl font-display text-[1.05rem] font-light leading-relaxed text-foreground/65">
          New and returning patients across general, cosmetic, and emergency care. For anything else, just drop me a line.
        </p>

        <div class="reveal mt-9 flex flex-wrap items-center gap-4">
          <UButton
            :href="practice.bookingHref"
            color="primary"
            variant="subtle"
            size="xl"
            class="rounded-full px-8"
          >
            Book a visit
          </UButton>
          <UButton
            :href="`mailto:${practice.email}`"
            color="neutral"
            variant="outline"
            size="xl"
            class="rounded-full px-8"
          >
            Email me
          </UButton>
        </div>

        <p class="reveal mt-6 font-display text-sm font-light text-foreground/55">
          {{ practice.name }}, {{ practice.location }}
        </p>
      </div>

      <!-- Professional enquiry routes -->
      <div class="reveal mt-16 max-w-3xl border-t border-foreground/10">
        <a
          v-for="enquiry in enquiries"
          :key="enquiry.id"
          :href="`mailto:${enquiry.email}`"
          class="group flex flex-col gap-2 border-b border-foreground/10 py-7 outline-none transition-colors focus-visible:bg-primary/[0.03] sm:flex-row sm:items-center sm:justify-between sm:gap-6"
        >
          <div>
            <p class="font-serif text-xl leading-snug text-foreground transition-colors group-hover:text-primary">
              {{ enquiry.label }}
            </p>
            <p class="mt-1 font-display text-[0.95rem] font-light leading-relaxed text-foreground/60">
              {{ enquiry.description }}
            </p>
          </div>
          <span class="inline-flex shrink-0 items-center gap-1.5 font-display text-sm font-semibold tracking-wide text-foreground/60 transition-colors group-hover:text-foreground">
            {{ enquiry.email }}
            <span aria-hidden="true" class="transition-transform duration-300 group-hover:translate-x-0.5">↗</span>
          </span>
        </a>
      </div>

    </div>
  </section>
</template>

<script setup lang="ts">
import gsap from 'gsap'
import { enquiries, practice } from '../data/contact'

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
          duration: 0.85,
          stagger: 0.1,
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
