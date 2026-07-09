<template>
  <!-- Lower z-index than the testimonials section above (z-20): while that
       section is pinned/scroll-locked, this stays hidden behind it instead
       of visibly sliding over it — it's only actually seen once the pin
       releases and both are back in normal, non-overlapping flow. -->
  <footer id="contact" ref="root" class="relative z-10 flex min-h-dvh flex-col justify-center overflow-hidden bg-primary text-white">
    <!-- Stepped shade transition: the white testimonials section above fades
         into this solid-purple footer through five ascending tints rather
         than a hard cut — same device as AboutSection's own purple entry. -->
    <div aria-hidden="true" class="absolute inset-x-0 top-0 flex flex-col">
      <div v-for="pct in TRANSITION_STEPS" :key="pct" class="footer-transition-row" :style="{ backgroundColor: transitionTint(pct) }" />
    </div>

    <div class="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 lg:py-20">

      <!-- CTA (left) / map to the practice (right, opposite). items-start,
           not items-center: centering a short text block against the much
           taller location cards left it looking small and adrift instead of
           like the page's actual closing argument. -->
      <div class="grid items-start gap-10 lg:grid-cols-2 lg:gap-16">
        <div>
          <p class="reveal font-display text-xs font-semibold uppercase tracking-eyebrow text-white/70">
            Get in touch
          </p>
          <p class="reveal mt-5 font-serif font-normal leading-heading tracking-heading text-white" style="font-size: clamp(2rem, 3.6vw, 3rem)">
            Let's find you a time.
          </p>
          <p class="reveal mt-5 max-w-md font-display text-base font-light leading-relaxed text-white/75">
            Whether it's a routine check-up or the smile you've been picturing, I'll make time to see you. New and returning patients always welcome.
          </p>
          <UButton
            :href="practice.bookingHref"
            color="neutral"
            variant="solid"
            size="xl"
            class="reveal mt-9 rounded-full px-10 text-base duration-250 ease-out hover:bg-accent hover:text-white"
          >
            Book an appointment
          </UButton>
        </div>

        <LocationCards />
      </div>

      <div class="reveal mt-16 h-px w-full origin-left bg-white/20 lg:mt-20" />

      <!-- Wordmark + socials -->
      <div class="mt-8 flex flex-col gap-8 sm:flex-row sm:items-center sm:justify-between">
        <div class="reveal flex items-center gap-3">
          <span class="font-serif text-xl leading-none tracking-heading text-white">Dr Deesha</span>
          <span class="h-4 w-px bg-white/25" />
          <span class="font-display text-3xs font-semibold uppercase tracking-eyebrow text-white/70">Dental</span>
        </div>

        <nav aria-label="Dr Deesha on social media" class="reveal flex items-center gap-2">
          <a
            v-for="social in socials"
            :key="social.label"
            :href="social.href"
            target="_blank"
            rel="noopener noreferrer"
            :aria-label="social.label"
            class="grid size-10 place-items-center rounded-full text-white/75 transition-colors hover:bg-white/10 hover:text-white"
          >
            <Icon :name="social.icon" class="size-5" />
          </a>
        </nav>
      </div>

      <p class="reveal mt-8 font-display text-xs uppercase tracking-label text-white/50">
        © {{ year }} Dr Deesha Dental. General Dental Council registered.
      </p>
    </div>
  </footer>
</template>

<script setup lang="ts">
import gsap from 'gsap'
import { practice } from '../data/contact'

// Five even steps toward full primary — matches AboutSection's own
// white-to-purple transition device.
const TRANSITION_STEPS = [17, 33, 50, 67, 83]

function transitionTint(primaryPct: number) {
  return `color-mix(in oklab, var(--color-primary) ${primaryPct}%, white)`
}

// Placeholder hrefs — swap in the real handles when ready.
const socials = [
  { label: 'Instagram', href: '#', icon: 'simple-icons:instagram' },
  { label: 'Facebook', href: '#', icon: 'simple-icons:facebook' },
  { label: 'TikTok', href: '#', icon: 'simple-icons:tiktok' },
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

.footer-transition-row {
  height: 1.1rem;
}
</style>
