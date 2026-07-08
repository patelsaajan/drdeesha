<template>
  <section ref="root" class="relative z-20 bg-background text-foreground">
    <div class="mx-auto max-w-6xl px-4 py-24 sm:px-6 lg:py-28">

      <header class="max-w-2xl">
        <p class="reveal font-display text-[0.72rem] font-semibold uppercase tracking-[0.35em] text-primary">
          Selected work
        </p>
        <h2 class="reveal mt-5 font-serif text-[clamp(2rem,4vw,3.25rem)] font-normal leading-[1.02] tracking-[-0.01em]">
          Smiles, up close.
        </h2>
        <p class="reveal mt-4 font-display text-[1rem] font-light leading-relaxed text-foreground/65">
          A few recent cases. Open one to see the before, the after, and how it was done.
        </p>
      </header>

      <div class="mt-14 grid gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
        <button
          v-for="study in caseStudies"
          :key="study.id"
          type="button"
          class="reveal case-card group block w-full overflow-hidden rounded-xl border border-foreground/10 bg-background text-left outline-none transition-shadow duration-500 hover:shadow-[0_24px_60px_-30px_rgba(15,25,35,0.4)] focus-visible:ring-2 focus-visible:ring-primary/40"
          @click="openCase(study)"
        >
          <div class="relative aspect-[4/5] overflow-hidden bg-foreground/5">
            <img
              :src="study.image"
              :alt="`${study.title} — ${study.treatment}`"
              loading="lazy"
              class="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
            >
          </div>
          <div class="flex items-start justify-between gap-3 p-5">
            <div>
              <p class="font-display text-[0.62rem] font-semibold uppercase tracking-[0.2em] text-primary">
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

    <!-- Case detail — slides in from the right -->
    <UDrawer
      v-model:open="open"
      direction="right"
      :handle="false"
      :title="selected?.title"
      :description="selected?.summary"
    >
      <template #content>
        <div v-if="selected" class="flex h-full w-[32rem] max-w-[calc(100vw-2rem)] flex-col bg-background text-foreground">

          <!-- Header -->
          <div class="flex items-start justify-between gap-4 border-b border-foreground/10 px-6 pb-6 pt-8 sm:px-8">
            <div>
              <p class="font-display text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-primary">
                {{ selected.treatment }}
              </p>
              <h3 class="mt-3 font-serif text-[clamp(1.6rem,3vw,2.1rem)] font-normal leading-[1.05] tracking-[-0.01em]">
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

          <!-- Scrollable body -->
          <div class="flex-1 overflow-y-auto px-6 py-6 sm:px-8">
            <div class="grid grid-cols-2 gap-3">
              <figure class="m-0">
                <div class="overflow-hidden rounded-lg bg-foreground/5">
                  <img :src="selected.before" :alt="`${selected.title}, before`" class="aspect-[3/4] w-full object-cover">
                </div>
                <figcaption class="mt-2 font-display text-[0.62rem] uppercase tracking-[0.2em] text-foreground/45">Before</figcaption>
              </figure>
              <figure class="m-0">
                <div class="overflow-hidden rounded-lg bg-foreground/5">
                  <img :src="selected.after" :alt="`${selected.title}, after`" class="aspect-[3/4] w-full object-cover">
                </div>
                <figcaption class="mt-2 font-display text-[0.62rem] uppercase tracking-[0.2em] text-primary">After</figcaption>
              </figure>
            </div>

            <p class="mt-7 font-display text-[1rem] font-light leading-relaxed text-foreground/75">
              {{ selected.description }}
            </p>

            <dl class="mt-8 grid grid-cols-3 gap-4 border-t border-foreground/10 pt-6">
              <div v-for="fact in selected.meta" :key="fact.label">
                <dt class="font-display text-[0.6rem] uppercase tracking-[0.16em] text-foreground/45">
                  {{ fact.label }}
                </dt>
                <dd class="mt-1 font-serif text-lg leading-tight text-foreground">
                  {{ fact.value }}
                </dd>
              </div>
            </dl>
          </div>

          <!-- Footer CTA -->
          <div class="border-t border-foreground/10 px-6 py-5 sm:px-8">
            <UButton color="primary" variant="subtle" size="lg" block class="rounded-full">
              Book a consultation
            </UButton>
          </div>
        </div>
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
