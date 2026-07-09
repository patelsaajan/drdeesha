<template>
  <section ref="root" class="relative z-20 bg-background text-foreground">
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

      <!-- Content -->
      <div class="flex items-center px-6 py-16 sm:px-10 lg:px-16 xl:px-24">
        <div class="w-full max-w-xl">

          <p class="reveal font-display text-xs font-semibold uppercase tracking-eyebrow text-primary">
            About
          </p>

          <h1 class="reveal m-0 mt-5 font-serif font-normal leading-none tracking-heading" style="font-size: clamp(2.75rem, 5.5vw, 4.75rem)">
            Dr Deesha
          </h1>

          <!-- Qualifications -->
          <h2 class="reveal mt-7 max-w-md font-serif font-normal leading-snug" style="font-size: clamp(1.1rem, 1.9vw, 1.4rem)">
            BDS<span class="mx-2 text-foreground/30">·</span>MJDF RCS<span class="text-foreground/60">&nbsp;(Eng)</span><span class="mx-2 text-foreground/30">·</span>PgDip Restorative &amp; Aesthetic Dentistry
          </h2>
          <p class="reveal mt-3 flex items-center gap-3 font-display text-2xs uppercase tracking-label text-foreground/55">
            <span class="h-px w-8 bg-foreground/25" />
            General Dental Council registered
          </p>

          <!-- First-person description -->
          <div class="reveal mt-9 max-w-prose space-y-5 font-display text-base font-light leading-body text-foreground/80">
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

          <div class="reveal mt-10 flex items-center gap-5">
            <UButton color="primary" variant="subtle" size="lg" class="rounded-full px-6">
              Book an appointment
            </UButton>
            <button
              type="button"
              class="cursor-pointer font-display text-sm font-semibold tracking-wide text-foreground/60 underline-offset-4 transition-colors hover:text-foreground hover:underline"
              @click="scrollToTop"
            >
              Back to smiles
            </button>
          </div>

        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import gsap from 'gsap'

const root = ref<HTMLElement | null>(null)
let ctx: gsap.Context | undefined
let observer: IntersectionObserver | undefined

function scrollToTop() {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' })
}

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
