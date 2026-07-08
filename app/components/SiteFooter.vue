<template>
  <footer ref="root" class="relative z-20 overflow-hidden border-t border-foreground/10 bg-background">
    <!-- Opaque base above covers the fixed hero title; this adds the subtle brand wash on top. -->
    <div aria-hidden="true" class="pointer-events-none absolute inset-0 bg-primary/[0.04]" />
    <div class="relative mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:py-28">

      <!-- Motto + CTA -->
      <div class="flex flex-col gap-12 lg:flex-row lg:items-end lg:justify-between">
        <div class="max-w-2xl">
          <p class="reveal font-display text-[0.72rem] font-semibold uppercase tracking-[0.35em] text-primary">
            Book your visit
          </p>
          <p class="reveal mt-6 font-serif text-[clamp(2.25rem,5vw,4rem)] font-normal leading-[1.03] tracking-[-0.01em] text-foreground">
            Careful hands,<br class="hidden sm:block"> <span class="text-primary">easy smiles.</span>
          </p>
          <p class="reveal mt-5 max-w-md font-display text-[1rem] font-light leading-relaxed text-foreground/65">
            New patients welcome across general, cosmetic, and emergency care.
          </p>
        </div>

        <div class="reveal shrink-0">
          <UButton color="primary" variant="subtle" size="lg" class="rounded-full px-7">
            Book an appointment
          </UButton>
        </div>
      </div>

      <div class="reveal mt-16 h-px w-full origin-left bg-foreground/10 lg:mt-24" />

      <!-- Wordmark + socials -->
      <div class="mt-8 flex flex-col gap-8 sm:flex-row sm:items-center sm:justify-between">
        <div class="reveal flex items-center gap-3">
          <span class="font-serif text-xl leading-none tracking-[-0.01em] text-foreground">Dr Deesha</span>
          <span class="h-4 w-px bg-foreground/20" />
          <span class="font-display text-[0.62rem] font-semibold uppercase tracking-[0.3em] text-foreground/55">Dental</span>
        </div>

        <nav aria-label="Dr Deesha on social media" class="reveal flex flex-wrap items-center gap-x-6 gap-y-2">
          <a
            v-for="social in socials"
            :key="social.label"
            :href="social.href"
            target="_blank"
            rel="noopener noreferrer"
            class="group inline-flex items-center gap-1.5 font-display text-sm font-semibold tracking-wide text-foreground/60 transition-colors hover:text-foreground"
          >
            {{ social.label }}
            <span aria-hidden="true" class="transition-transform duration-300 group-hover:translate-x-0.5">↗</span>
          </a>
        </nav>
      </div>

      <p class="reveal mt-8 font-display text-[0.72rem] uppercase tracking-[0.15em] text-foreground/40">
        © {{ year }} Dr Deesha Dental. General Dental Council registered.
      </p>
    </div>
  </footer>
</template>

<script setup lang="ts">
import gsap from 'gsap'

// Placeholder hrefs — swap in the real handles when ready.
const socials = [
  { label: 'Instagram', href: '#' },
  { label: 'Facebook', href: '#' },
  { label: 'TikTok', href: '#' },
]

const year = new Date().getFullYear()

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
/* Avoid a flash of un-animated content before GSAP takes over on capable displays. */
@media (prefers-reduced-motion: no-preference) {
  .reveal {
    opacity: 0;
  }
}
</style>
