<template>
  <section id="cases" ref="root" class="relative z-20 bg-background text-foreground">
    <div class="mx-auto max-w-6xl px-4 py-24 sm:px-6 lg:py-28">

      <header class="max-w-2xl">
        <p class="reveal font-display text-xs font-semibold uppercase tracking-eyebrow text-primary">
          Selected work
        </p>
        <h2 class="reveal mt-5 font-serif font-normal leading-heading tracking-heading" style="font-size: clamp(2rem, 4vw, 3.25rem)">
          Smiles, up close.
        </h2>
        <p class="reveal mt-4 font-display text-base font-light leading-relaxed text-foreground/65">
          A few of my recent cases. Open one to see the before, the after, and how I did it.
        </p>
      </header>

      <div class="mt-14 grid gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
        <button
          v-for="study in caseStudies"
          :key="study.id"
          type="button"
          class="reveal case-card group block w-full overflow-hidden rounded-xl border border-foreground/10 bg-background text-left outline-none transition-shadow duration-500 hover:shadow-card focus-visible:ring-2 focus-visible:ring-primary/40"
          @click="openCase(study)"
        >
          <div class="relative overflow-hidden bg-foreground/5" style="aspect-ratio: 3 / 2">
            <NuxtImg
              :src="study.image"
              :alt="`${study.title} — ${study.treatment}`"
              sizes="100vw sm:50vw lg:33vw"
              loading="lazy"
              class="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            />
          </div>
          <div class="flex items-start justify-between gap-3 p-5">
            <div>
              <p class="font-display text-3xs font-semibold uppercase tracking-label text-primary">
                {{ study.treatment }}
              </p>
              <p class="mt-2 font-serif text-xl leading-snug text-foreground">
                {{ study.title }}
              </p>
            </div>
            <span
              aria-hidden="true"
              class="mt-1 font-display text-sm text-foreground/40 transition-all duration-300 group-hover:translate-x-0.5 group-hover:text-primary"
            >↗</span>
          </div>
        </button>
      </div>
    </div>

    <!-- Case detail — slides in from the left, sized/styled via app.config.ts (ui.drawer) -->
    <UDrawer
      v-model:open="open"
      direction="left"
      :handle="false"
      :title="selected?.title"
      :description="selected?.summary"
    >
      <template v-if="selected" #header>
        <div class="flex flex-1 items-start justify-between gap-4">
          <div>
            <p class="font-display text-2xs font-semibold uppercase tracking-label text-primary">
              {{ selected.treatment }}
            </p>
            <h3 class="mt-3 font-serif font-normal leading-heading tracking-heading" style="font-size: clamp(1.6rem, 3vw, 2.1rem)">
              {{ selected.title }}
            </h3>
          </div>
          <button
            type="button"
            aria-label="Close case"
            class="grid size-9 shrink-0 place-items-center rounded-full text-lg text-foreground/50 outline-none transition-colors hover:bg-foreground/5 hover:text-foreground focus-visible:ring-2 focus-visible:ring-primary/40"
            @click="open = false"
          >
            &times;
          </button>
        </div>
      </template>

      <template v-if="selected" #body>
        <LazyBeforeAfterSlider :before="selected.before" :after="selected.after" :label="selected.title" />

        <p class="mt-7 font-display text-base font-light leading-relaxed text-foreground/75">
          {{ selected.description }}
        </p>

        <dl class="mt-8 grid grid-cols-3 gap-4 border-t border-foreground/10 pt-6">
          <div v-for="fact in selected.meta" :key="fact.label">
            <dt class="font-display text-3xs uppercase tracking-label text-foreground/45">
              {{ fact.label }}
            </dt>
            <dd class="mt-1 font-serif text-lg leading-tight text-foreground">
              {{ fact.value }}
            </dd>
          </div>
        </dl>
      </template>

      <template v-if="selected" #footer>
        <!-- Bumped past the site's usual subtle/primary treatment (see
             app.config.ts) to a solid fill — this is the one moment we want
             to out-shout the quieter after-pill and slider above it. -->
        <UButton
          color="primary"
          variant="subtle"
          size="lg"
          block
          class="rounded-full bg-primary text-white hover:bg-primary/90 active:bg-primary/90"
        >
          Book a consultation
        </UButton>
      </template>
    </UDrawer>
  </section>
</template>

<script setup lang="ts">
import gsap from 'gsap'
import { type CaseStudy, caseStudies } from '../data/cases'

const open = ref(false)
const selected = ref<CaseStudy | null>(null)

function openCase(study: CaseStudy) {
  selected.value = study
  open.value = true
}

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
/* Avoid a flash before GSAP takes over on capable displays. */
@media (prefers-reduced-motion: no-preference) {
  .reveal {
    opacity: 0;
  }
}
</style>
