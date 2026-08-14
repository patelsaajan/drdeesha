<template>
  <!-- Site-wide reading progress, vertical, fixed to the left edge,
       vertically centred regardless of scroll position (top-1/2 +
       -translate-y-1/2, not top/bottom anchored like the nav chrome).
       Desktop only — no mobile/tablet equivalent. Track/fill colours match
       the before/after slider's (bg-foreground/25, primary fill) so
       "progress" reads as one visual language site-wide. Milestone ticks
       (siteSections — the same source SiteNav's scrollspy uses) mark where
       each section begins along the track. -->
  <!-- Purely decorative chrome — the scrollbar already conveys position, so
       this stays out of the accessibility tree rather than announcing itself
       as a progressbar. -->
  <div
    aria-hidden="true"
    class="pointer-events-none fixed left-2 top-1/2 z-40 hidden h-40 w-2 -translate-y-1/2 overflow-hidden rounded-full bg-foreground/25 sm:h-48 lg:block lg:h-60"
  >
    <div
      class="scroll-progress-fill absolute inset-x-0 top-0 w-full rounded-full"
      :class="complete ? 'bg-accent' : 'bg-primary'"
      :style="{ height: `${progress * 100}%` }"
    />
    <span
      v-for="m in milestones"
      :key="m.id"
      aria-hidden="true"
      class="absolute inset-x-0 h-px bg-background/70"
      :style="{ top: `${m.offset * 100}%` }"
    />
  </div>
</template>

<script setup lang="ts">
import { siteSections } from '../data/sections'

const progress = ref(0)
const milestones = ref<{ id: string, offset: number }[]>([])
const complete = computed(() => progress.value >= 1)

function clamp01(n: number) {
  return Math.min(1, Math.max(0, n))
}

function scrollableHeight() {
  return document.documentElement.scrollHeight - window.innerHeight
}

function updateProgress() {
  const scrollable = scrollableHeight()
  progress.value = scrollable > 0 ? clamp01(window.scrollY / scrollable) : 0
}

// A tick this close to the start of the track is indistinguishable from the
// track's own top edge, so it reads as a rendering artefact on the rounded cap
// rather than a marker. `home` begins at scrollY 0 and so always lands there;
// this is expressed as an offset rather than an id so any section pinned to
// the top of the page is treated the same way.
const MILESTONE_MIN_OFFSET = 0.02

// Section offsets don't change as you scroll, only on layout shifts — kept
// separate from updateProgress so it isn't recomputed on every scroll tick.
function updateMilestones() {
  const scrollable = scrollableHeight()
  if (scrollable <= 0) {
    milestones.value = []
    return
  }
  milestones.value = siteSections.flatMap((section) => {
    const el = document.getElementById(section.id)
    if (!el) return []
    const top = el.getBoundingClientRect().top + window.scrollY
    const offset = clamp01(top / scrollable)
    if (offset < MILESTONE_MIN_OFFSET) return []
    return [{ id: section.id, offset }]
  })
}

let ticking = false
function onScroll() {
  if (ticking) return
  ticking = true
  requestAnimationFrame(() => {
    updateProgress()
    ticking = false
  })
}

function onResize() {
  updateProgress()
  updateMilestones()
}

onMounted(() => {
  updateProgress()
  updateMilestones()
  window.addEventListener('scroll', onScroll, { passive: true })
  window.addEventListener('resize', onResize)
  // Webfonts landing (Fraunces/Bodoni after mount) reflows section heights.
  document.fonts?.ready.then(updateMilestones)
  window.addEventListener('load', updateMilestones)
})

onUnmounted(() => {
  window.removeEventListener('scroll', onScroll)
  window.removeEventListener('resize', onResize)
  window.removeEventListener('load', updateMilestones)
})
</script>

<style scoped>
.scroll-progress-fill {
  transition: height 0.1s linear, background-color 0.2s ease;
}

@media (prefers-reduced-motion: reduce) {
  .scroll-progress-fill {
    transition: none;
  }
}
</style>
