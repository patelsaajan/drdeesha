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

      <!-- Editorial mosaic, not a uniform card grid: the first case runs as a
           2x2 feature, the rest fill around it. Each card is full-bleed
           photography with the caption sat over a warm scrim — the same
           image-forward treatment as the process film and location cards,
           rather than a clinical white label strip under a thumbnail. -->
      <div class="mt-14 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 lg:auto-rows-62">
        <button
          v-for="(study, i) in caseStudies"
          :key="study.id"
          type="button"
          :aria-label="`${study.title} — ${study.treatment}`"
          class="reveal case-card group relative overflow-hidden rounded-xl bg-foreground text-left outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2"
          :class="i === 0
            ? 'aspect-4/3 sm:col-span-2 sm:aspect-video lg:col-span-2 lg:row-span-2 lg:aspect-auto'
            : 'aspect-4/3 lg:aspect-auto lg:h-full'"
          @click="openCase(study)"
        >
          <NuxtImg
            :src="study.image"
            :alt="`${study.title} — ${study.treatment}`"
            :sizes="i === 0 ? '100vw lg:66vw' : '100vw sm:50vw lg:33vw'"
            loading="lazy"
            class="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
          />

          <!-- Warm legibility scrim, deepening a touch on hover -->
          <div aria-hidden="true" class="absolute inset-0 bg-linear-to-t from-black/85 via-black/30 to-black/5 transition-opacity duration-500 group-hover:from-black/90" />

          <!-- Caption stays put; only the text under the eyebrow trades places
               with the CTA on hover. Both occupy the same footprint (the CTA
               overlays the title zone on pointer devices), so nothing climbs
               up over the photo. -->
          <div class="case-caption absolute inset-x-0 bottom-0 z-10 px-5 pb-5 lg:px-6 lg:pb-6">
            <p class="font-display text-3xs font-semibold uppercase tracking-label text-accent">
              {{ study.treatment }}
            </p>

            <div class="case-swap relative mt-1">
              <div class="case-title">
                <p class="font-serif leading-snug text-white" :class="i === 0 ? 'text-2xl lg:text-3xl' : 'text-xl'">
                  {{ study.title }}
                </p>
                <p v-if="i === 0" class="mt-1.5 max-w-md font-display text-sm font-light leading-relaxed text-white/75">
                  {{ study.summary }}
                </p>
              </div>

              <span class="case-cta inline-flex items-center gap-1.5 font-display text-2xs font-semibold uppercase tracking-label text-white">
                See the detail
                <span class="case-arrow text-accent">↗</span>
              </span>
            </div>
          </div>
        </button>
      </div>
    </div>

    <!-- Case detail — a left side-panel on desktop, a draggable bottom sheet
         on mobile (thumb-dismissable, so it keeps its handle there).
         Sized/styled via app.config.ts (ui.drawer). -->
    <UDrawer
      v-model:open="open"
      :direction="isDesktop ? 'left' : 'bottom'"
      :handle="!isDesktop"
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
          class="rounded-full bg-primary text-white duration-250 ease-out hover:bg-accent active:bg-accent"
        >
          Book a consultation
        </UButton>
      </template>
    </UDrawer>
  </section>
</template>

<script setup lang="ts">
import { type CaseStudy, caseStudies } from '../data/cases'

const open = ref(false)
const selected = ref<CaseStudy | null>(null)
const isDesktop = useIsDesktop()

function openCase(study: CaseStudy) {
  selected.value = study
  open.value = true
}

const root = ref<HTMLElement | null>(null)
useSectionReveal(root)
</script>

<style scoped>
/* Avoid a flash before GSAP takes over on capable displays. */
@media (prefers-reduced-motion: no-preference) {
  .reveal {
    opacity: 0;
  }
}

/* Warm accent-tinted lift on hover — a friendlier echo of the career cards'
   primary-tinted shadow. Shadow only (not transform), so it never fights the
   inline transform GSAP leaves on the card after the entrance reveal. */
.case-card {
  transition: box-shadow 0.5s cubic-bezier(0.16, 1, 0.3, 1);
}
.case-card:hover {
  box-shadow: 0 24px 48px -22px color-mix(in oklab, var(--color-accent) 42%, transparent);
}

.case-arrow {
  transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}
.case-card:hover .case-arrow,
.case-card:focus-visible .case-arrow {
  transform: translateX(0.15rem);
}

/* In-place swap. The title keeps the caption's footprint (it's the sizer);
   the CTA overlays its bottom line, hidden at rest, and on hover/focus the
   two trade places — title drifts up and out as the CTA rises in. The
   caption block itself never moves, so the eyebrow stays off the photo. */
.case-title {
  transition:
    opacity 0.3s ease,
    transform 0.45s cubic-bezier(0.16, 1, 0.3, 1);
}
.case-cta {
  position: absolute;
  left: 0;
  bottom: 0.125rem;
  opacity: 0;
  transform: translateY(0.5rem);
  transition:
    opacity 0.3s ease,
    transform 0.45s cubic-bezier(0.16, 1, 0.3, 1);
}
.case-card:hover .case-title,
.case-card:focus-visible .case-title {
  opacity: 0;
  transform: translateY(-0.5rem);
}
.case-card:hover .case-cta,
.case-card:focus-visible .case-cta {
  opacity: 1;
  transform: translateY(0);
}

@media (prefers-reduced-motion: reduce) {
  .case-card,
  .case-arrow,
  .case-title,
  .case-cta {
    transition: none !important;
  }
}
</style>
