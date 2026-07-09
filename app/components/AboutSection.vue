<template>
  <section ref="root" class="relative z-20 bg-background text-foreground">
    <!-- Stepped shade transition: the white hero above fades into the
         solid-purple panel below through five ascending tints rather than
         a hard cut — flat bands, not a gradient. -->
    <div aria-hidden="true" class="flex flex-col">
      <div v-for="pct in TRANSITION_STEPS" :key="pct" class="about-transition-row" :style="{ backgroundColor: transitionTint(pct) }" />
    </div>

    <div class="about-grid grid min-h-dvh">

      <!-- Portrait: full-height, dark studio frame -->
      <figure class="portrait-figure relative m-0 overflow-hidden bg-foreground">
        <NuxtImg
          src="/images/dr-deesha.jpeg"
          alt="Dr Deesha, smiling in a black roll-neck against a dark studio backdrop"
          sizes="100vw lg:44vw"
          preload
          loading="eager"
          class="portrait-img h-full w-full origin-center object-cover"
          style="object-position: 50% 22%"
        />
      </figure>

      <!-- Content — solid primary purple, matching the footer's own CTA
           panel. Bookends the page: this is the first committed-purple
           moment, the footer is the last, and everything between stays
           light. Ties About back into the rest of the site instead of
           leaving it as the one plain white/black holdover. -->
      <div class="about-content relative flex items-center overflow-hidden bg-primary px-6 py-16 text-white sm:px-10 lg:px-16 xl:px-24">
        <!-- Oversized watermark — same device as the career timeline's
             rotated spine mark, reused upright here since this column is
             wide rather than a narrow spine. Purely texture: kept faint
             enough to stay behind the copy, never compete with it. -->
        <span aria-hidden="true" class="about-mark pointer-events-none absolute select-none whitespace-nowrap font-serif font-normal leading-none text-white/8">
          Smart Smiles
        </span>

        <div class="relative w-full max-w-xl">

          <p class="reveal font-display text-xs font-semibold uppercase tracking-eyebrow text-white/70">
            About
          </p>

          <h1 class="reveal m-0 mt-5 font-serif font-normal leading-none tracking-heading text-white" style="font-size: clamp(2.75rem, 5.5vw, 4.75rem)">
            Dr Deesha
          </h1>

          <!-- Qualifications -->
          <h2 class="reveal mt-7 max-w-md font-serif font-normal leading-snug text-white" style="font-size: clamp(1.1rem, 1.9vw, 1.4rem)">
            BDS<span class="mx-2 text-white/35">·</span>MJDF RCS<span class="text-white/70">&nbsp;(Eng)</span><span class="mx-2 text-white/35">·</span>PgDip Restorative &amp; Aesthetic Dentistry
          </h2>
          <p class="reveal mt-3 flex items-center gap-3 font-display text-2xs uppercase tracking-label text-white/60">
            <span class="h-px w-8 bg-white/30" />
            General Dental Council registered
          </p>

          <!-- First-person description -->
          <div class="reveal mt-9 max-w-prose space-y-5 font-display text-base font-light leading-body text-white/80">
            <p>
              I became a dentist for the mix of precision and people: the quiet craft of getting
              something exactly right, and the person in the chair who walks out feeling better for
              it. The nervous first visits are the ones I care about most, and turning them into
              easy ones is the part of this job I'm proudest of.
            </p>
            <p>
              Away from the practice I'm usually outdoors on a long walk, cooking for far too many
              people, or hunting down a decent flat white. Whatever brings you in, a routine
              check-up or a whole new smile, you'll get the same unhurried attention.
            </p>
          </div>

          <UButton
            color="neutral"
            variant="solid"
            size="lg"
            class="reveal mt-10 rounded-full px-6 duration-250 ease-out hover:bg-accent hover:text-white"
          >
            Book an appointment
          </UButton>

        </div>
      </div>
    </div>

    <!-- Mirrored on the way out: purple steps back down to white before
         the case studies section below. -->
    <div aria-hidden="true" class="flex flex-col">
      <div v-for="pct in TRANSITION_STEPS_REVERSE" :key="pct" class="about-transition-row" :style="{ backgroundColor: transitionTint(pct) }" />
    </div>
  </section>
</template>

<script setup lang="ts">
import gsap from 'gsap'

// Five even steps toward full primary — flat bands rather than a smooth
// gradient, so the white-to-purple handoff at this section's edges reads
// as deliberate print-like steps.
const TRANSITION_STEPS = [17, 33, 50, 67, 83]
const TRANSITION_STEPS_REVERSE = [...TRANSITION_STEPS].reverse()

function transitionTint(primaryPct: number) {
  return `color-mix(in oklab, var(--color-primary) ${primaryPct}%, white)`
}

const root = ref<HTMLElement | null>(null)
let ctx: gsap.Context | undefined
let observer: IntersectionObserver | undefined

onMounted(() => {
  const el = root.value
  if (!el) return

  const reveals = gsap.utils.toArray<HTMLElement>(el.querySelectorAll('.reveal'))
  const img = el.querySelector<HTMLElement>('.portrait-img')
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  if (reduce) {
    gsap.set([...reveals, img].filter(Boolean), { autoAlpha: 1, y: 0, scale: 1 })
    return
  }

  ctx = gsap.context(() => {
    observer = new IntersectionObserver(
      ([entry], obs) => {
        if (!entry?.isIntersecting) return
        obs.disconnect()

        const tl = gsap.timeline({ defaults: { ease: 'expo.out' } })
        if (img) tl.to(img, { autoAlpha: 1, scale: 1, duration: 1.4 })
        tl.to(reveals, { autoAlpha: 1, y: 0, duration: 0.9, stagger: 0.12 }, img ? '-=1.0' : 0)
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
/* Responsive layout values that inline styles can't express. */
@media (min-width: 1024px) {
  .about-grid {
    grid-template-columns: 44% 1fr;
  }
}

.portrait-figure {
  height: 58vh;
}
@media (min-width: 1024px) {
  .portrait-figure {
    height: 100dvh;
  }
}

.about-transition-row {
  height: 1.1rem;
}

/* Anchored bottom-right, clear of the fixed "Book Now" pill that's already
   showing by the time this section is in view (top-right of the viewport) —
   real padding from the panel's edges, not a bleeding corner crop. */
.about-mark {
  right: 2rem;
  bottom: 2.5rem;
  font-size: clamp(1.75rem, 3vw, 3.5rem);
}
@media (min-width: 1024px) {
  .about-mark {
    right: 3rem;
    bottom: 3rem;
  }
}

/* Start hidden only where we'll animate; reduced-motion keeps everything visible. */
@media (prefers-reduced-motion: no-preference) {
  .reveal {
    opacity: 0;
  }
  .portrait-img {
    opacity: 0;
    transform: scale(1.08);
  }
}
</style>
