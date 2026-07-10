<template>
  <!-- Lower z-index than the testimonials section above (z-20): while that
       section is pinned/scroll-locked, this stays hidden behind it instead
       of visibly sliding over it — it's only actually seen once the pin
       releases and both are back in normal, non-overlapping flow. -->
  <footer id="contact" ref="root" class="relative z-10 flex min-h-dvh flex-col justify-start overflow-hidden bg-primary text-white">
    <!-- Top panel: a lighter tint of primary, everything above the shade change. -->
    <div class="py-16 lg:py-20" :style="{ backgroundColor: usePrimaryTint(80) }">
      <div class="mx-auto w-full max-w-6xl px-4 sm:px-6">

        <!-- CTA (left) / map to the practice (right, opposite). items-start,
             not items-center: centering a short text block against the much
             taller location cards left it looking small and adrift instead of
             like the page's actual closing argument. -->
        <div class="grid items-start gap-10 lg:grid-cols-2 lg:gap-16">
          <div>
            <p class="reveal font-display text-xs font-semibold uppercase tracking-eyebrow text-white/70">
              Get in touch
            </p>
            <p class="reveal mt-5 font-serif font-normal leading-heading tracking-heading text-white" style="font-size: clamp(2rem, 4vw, 3.25rem)">
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
      </div>
    </div>

    <!-- Bottom panel: solid primary (inherited from the footer itself), everything
         from the shade change down. Extra bottom room under lg so the docked
         mobile nav bar doesn't sit over the baseline links. -->
    <div class="pb-36 lg:pb-20">
      <div class="mx-auto w-full max-w-6xl px-4 sm:px-6">

        <!-- Wordmark / section links / socials -->
        <div class="mt-8 flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
          <div class="reveal flex items-center gap-3">
            <span class="font-serif text-xl leading-none tracking-heading text-white">Dr Deesha</span>
            <span class="h-4 w-px bg-white/25" />
            <span class="font-display text-3xs font-semibold uppercase tracking-eyebrow text-white/70">Dental</span>
          </div>

          <!-- Way back into the page — same section list the top nav carries,
               so the footer isn't a dead end after the CTA. -->
          <nav aria-label="Sections" class="reveal flex flex-wrap items-center gap-x-6 gap-y-2">
            <a
              v-for="link in sectionLinks"
              :key="link.id"
              :href="`#${link.id}`"
              class="font-display text-2xs font-semibold uppercase tracking-label text-white/55 transition-colors hover:text-white"
            >
              {{ link.label }}
            </a>
          </nav>

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

        <!-- Baseline: legal on the left, place on the right — the same
             name-dot-location line About signs off with. -->
        <div class="reveal mt-8 flex flex-col gap-2 font-display text-xs uppercase tracking-label text-white/50 sm:flex-row sm:items-center sm:justify-between">
          <p>© {{ year }} Dr Deesha Dental. General Dental Council registered.</p>
          <p class="flex items-center gap-3">
            {{ practice.name }}
            <span aria-hidden="true" class="h-1 w-1 rounded-full bg-accent" />
            {{ practice.location }}
          </p>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { practice } from '../data/contact'
import { siteSections } from '../data/sections'

// The page's canonical section list, minus the two that don't make sense as
// footer links (you're already at contact; home is the wordmark's job).
const sectionLinks = siteSections.filter(s => !['home', 'contact'].includes(s.id))

// Placeholder hrefs — swap in the real handles when ready.
const socials = [
  { label: 'Instagram', href: '#', icon: 'simple-icons:instagram' },
  { label: 'Facebook', href: '#', icon: 'simple-icons:facebook' },
  { label: 'TikTok', href: '#', icon: 'simple-icons:tiktok' },
]

const year = new Date().getFullYear()

const root = ref<HTMLElement | null>(null)
useSectionReveal(root)
</script>

<style scoped>
/* Avoid a flash of un-animated content before GSAP takes over on capable displays. */
@media (prefers-reduced-motion: no-preference) {
  .reveal {
    opacity: 0;
  }
}
</style>
