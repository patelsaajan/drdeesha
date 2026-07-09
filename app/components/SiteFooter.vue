<template>
  <!-- Higher z-index + normal flow (vs. the testimonials section's `sticky`)
       means this slides up and over it as you keep scrolling, rather than the
       two just trading places. -->
  <footer id="contact" ref="root" class="relative z-30 flex min-h-dvh flex-col justify-center overflow-hidden bg-primary text-white">
    <div class="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 lg:py-20">

      <!-- Motto + CTA (left) / map to the practice (right, opposite) -->
      <div class="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
        <div>
          <p class="reveal font-display text-xs font-semibold uppercase tracking-eyebrow text-white/70">
            Get in touch
          </p>
          <p class="reveal mt-5 font-serif font-normal leading-heading tracking-heading text-white" style="font-size: clamp(1.5rem, 2.4vw, 1.875rem)">
            Careful hands, easy smiles.
          </p>
          <p class="reveal mt-4 max-w-md font-display text-base font-light leading-relaxed text-white/75">
            I welcome new and returning patients across general, cosmetic, and emergency care.
          </p>
          <UButton
            :href="practice.bookingHref"
            color="neutral"
            variant="solid"
            size="xl"
            class="reveal mt-8 rounded-full px-9"
          >
            Book an appointment
          </UButton>
          <p class="reveal mt-5 font-display text-sm font-light text-white/60">
            {{ practice.name }}, {{ practice.location }}
          </p>
        </div>

        <div class="reveal aspect-[4/3] w-full overflow-hidden rounded-xl border border-white/15 lg:aspect-auto lg:h-72">
          <iframe
            :src="mapSrc"
            class="h-full w-full border-0"
            loading="lazy"
            referrerpolicy="no-referrer-when-downgrade"
            :title="`Map showing ${practice.name}, ${practice.location}`"
          />
        </div>
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

// Placeholder hrefs — swap in the real handles when ready.
const socials = [
  { label: 'Instagram', href: '#', icon: 'simple-icons:instagram' },
  { label: 'Facebook', href: '#', icon: 'simple-icons:facebook' },
  { label: 'TikTok', href: '#', icon: 'simple-icons:tiktok' },
]

// No API key needed — Google's public "output=embed" search-based iframe.
// Swap in the exact address once the real practice location is confirmed.
const mapSrc = `https://www.google.com/maps?q=${encodeURIComponent(`${practice.name}, ${practice.location}`)}&output=embed`

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
