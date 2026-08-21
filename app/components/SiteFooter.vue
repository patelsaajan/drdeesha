<template>
  <!-- Curtain exit over the testimonials (lg only, where its pin exists):
       lg:z-30 paints this above the pinned section (z-20), and
       TestimonialsSection pulls this footer's flow position up by the
       deck's measured height (a JS-managed negative margin-top) so it
       starts entering the viewport exactly as the row scrub finishes and
       slides up over the still-pinned section — without that pull-up,
       pinSpacing places the footer at the pin's release point and the
       curtain degrades into dead scroll plus a plain scroll-in. Below lg
       (no pin) the margin is cleared and this stays in normal flow under
       the mobile nav layers at z-10. -->
  <footer id="contact" ref="root" class="relative z-10 flex min-h-dvh flex-col overflow-hidden bg-primary text-white lg:z-30">
    <!-- Top panel: a lighter tint of primary, everything above the shade
         change. flex-1 + items-center: whatever height min-h-dvh leaves
         over after the bottom panel takes its natural cut lands here, with
         the CTA centred in it — breathing room around the closing argument
         instead of a slab of empty primary under the baseline links. -->
    <div class="flex flex-1 items-center py-16 lg:py-20" :style="{ backgroundColor: usePrimaryTint(80) }">
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
            <p class="reveal mt-5 font-serif text-[clamp(2rem,4vw,3.25rem)] font-normal leading-heading tracking-heading text-white">
              Let's find you a time.
            </p>
            <p class="reveal mt-5 max-w-md font-sans text-base font-light leading-relaxed text-white/75">
              Whether it's a routine check-up or the smile you've been picturing, I'll make time to see you. New and returning patients always welcome.
            </p>
            <UButton
              :href="practice.bookingHref"
              color="neutral"
              variant="solid"
              size="xl"
              class="reveal mt-9 rounded-full px-10 text-base duration-250 ease-out hover:bg-accent hover:text-primary"
            >
              Book an appointment
            </UButton>
          </div>

          <LocationCards />
        </div>
      </div>
    </div>

    <!-- Bottom panel: solid primary (inherited from the footer itself),
         everything from the shade change down — capped at its content
         height (shrink-0, no grow) so it never stretches to fill the
         viewport; the CTA panel above absorbs that instead. Extra bottom
         room under lg so the docked mobile nav bar doesn't sit over the
         baseline links. -->
    <div class="shrink-0 pb-28 lg:pb-20">
      <div class="mx-auto w-full max-w-6xl px-4 sm:px-6">

        <!-- Wordmark / section links / socials. One row at every width: on a
             phone the section links drop out (see below), so this is just
             wordmark-left / socials-right; from lg the links reappear as the
             middle item and justify-between spreads all three. gap-8 is only
             the floor between items — justify-between supplies the rest. -->
        <div class="mt-8 flex items-center justify-between gap-8">
          <!-- Brand mark — the same lockup as the hero, so the footer's
               signature matches how the page opened. Artwork is black ink
               on transparency; brightness-0 + invert repaints it white for
               this primary ground rather than shipping a second asset. -->
          <div class="reveal">
            <NuxtImg
              src="/images/logo/dr-deesha-logo.webp"
              alt="Dr Deesha Dental"
              width="288"
              height="108"
              loading="lazy"
              class="h-auto w-32 brightness-0 invert lg:w-36"
            />
          </div>

          <!-- Way back into the page — same section list the top nav carries,
               so the footer isn't a dead end after the CTA. Desktop only:
               below lg the docked mobile nav bar already carries these exact
               section jumps a thumb's reach away, so repeating them here only
               bought a third stacked block of clutter — hidden rather than
               deleted because the desktop footer has no such bar to lean on. -->
          <nav aria-label="Sections" class="reveal hidden flex-wrap items-center gap-x-6 gap-y-2 lg:flex">
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
        <div class="reveal mt-8 flex flex-col gap-2 font-display text-xs uppercase tracking-label text-white/50 sm:flex-row items-center sm:justify-between">
          <p>© {{ year }} Dr Deesha Dental. GDC no 309307.</p>
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

// LinkedIn is the one live handle; Instagram and TikTok are still
// placeholders — swap in the real hrefs when ready.
const socials = [
  { label: 'Instagram', href: '#', icon: 'simple-icons:instagram' },
  { label: 'TikTok', href: '#', icon: 'simple-icons:tiktok' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/deesha-chudasama-b7544428b/', icon: 'simple-icons:linkedin' },
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
