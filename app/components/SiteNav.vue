<template>
  <!-- Light frosted pill, anchored to the right edge. Two-part rhythm:
       - Rest: a single section chip (the current one) sits directly left of
         a fixed Book Now button. Book Now is the anchor — it never moves.
       - Hover: the section list unfurls leftward from that anchor, each item
         cascading in on a stagger, and only once they've all landed does the
         current item's highlight fade in as a closing beat.
       Sections keep their true page order; each is its own grid column that
       collapses to a real `0fr` (not a flex-basis trick that leaves a width
       sliver behind and shoves Book Now off the true edge). -->
  <nav
    class="site-nav fixed top-6 right-6 z-40 flex h-11 w-fit items-stretch overflow-hidden rounded-lg border border-black/8 bg-white/55 text-foreground shadow-lift backdrop-blur-md"
    @mouseenter="expanded = true"
    @mouseleave="expanded = false"
  >
    <div
      v-for="(section, i) in sections"
      :key="section.id"
      class="site-item grid h-full min-w-0 overflow-hidden"
      :style="{
        gridTemplateColumns: expanded || section.id === current.id ? 'minmax(0, 1fr)' : 'minmax(0, 0fr)',
        transitionDelay: staggerDelay(i),
      }"
    >
      <button
        type="button"
        class="site-btn flex h-full min-w-0 cursor-pointer items-center justify-start overflow-hidden whitespace-nowrap px-4 font-display text-2xs font-semibold uppercase tracking-label"
        :class="[
          section.id === current.id ? 'bg-primary/12 text-primary' : 'bg-transparent text-foreground/50 hover:text-foreground',
          expanded && i > 0 && 'border-l border-black/8',
        ]"
        :style="{
          opacity: expanded || section.id === current.id ? 1 : 0,
          transitionDelay: staggerDelay(i),
        }"
        @click="jumpTo(section.id)"
      >
        <!-- Current chip's odometer. Width comes from a JS measurement of the
             incoming label (the measurer span below reports it) and is
             transitioned, so the chip glides between word lengths in step
             with the roll instead of snapping. Until the first measurement
             (SSR / pre-mount) an invisible in-flow sizer holds the width. -->
        <span
          v-if="section.id === current.id"
          class="site-tick relative block h-3 overflow-hidden"
          :style="tickWidth != null ? { width: `${tickWidth}px` } : undefined"
        >
          <span ref="measureEl" aria-hidden="true" class="invisible absolute left-0 top-0 w-max leading-none">{{ current.label }}</span>
          <span v-if="tickWidth == null" aria-hidden="true" class="invisible block leading-none">{{ current.label }}</span>
          <Transition :name="tickDirection === 'up' ? 'tick-up' : 'tick-down'">
            <span :key="current.id" class="absolute inset-0 flex items-center justify-start">
              {{ current.label }}
            </span>
          </Transition>
        </span>
        <span v-else>{{ section.label }}</span>
      </button>
    </div>

    <UButton
      :href="practice.bookingHref"
      variant="solid"
      color="primary"
      class="site-nav-book h-full shrink-0 cursor-pointer rounded-l-none rounded-r-lg border-l border-black/8 bg-primary! px-6 text-white! transition-colors duration-200 hover:bg-accent!"
    >
      Book Now
    </UButton>
  </nav>
</template>

<script setup lang="ts">
import { practice } from '../data/contact'
import { siteSections as sections } from '../data/sections'

const currentId = ref(sections[0]!.id)
const current = computed(() => sections.find(s => s.id === currentId.value) ?? sections[0]!)

// `expanded` drives the width/opacity unfurl. The active section carries its
// highlight at all times (including the compact state), so there's no separate
// deferred-highlight state to track.
const expanded = ref(false)

const STAGGER_MS = 55

function reduceMotion() {
  return import.meta.client && window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

// Unfurl reads as rolling out from behind Book Now: the rightmost section
// moves first, the leftmost last. On collapse everything closes together.
function staggerDelay(i: number) {
  if (!expanded.value || reduceMotion()) return '0ms'
  return `${(sections.length - 1 - i) * STAGGER_MS}ms`
}

// Direction mirrors scroll direction: moving further down the page ticks
// upward (like an odometer rolling forward); moving back up reverses it.
const tickDirection = ref<'up' | 'down'>('up')
watch(currentId, (newId, oldId) => {
  const newIndex = sections.findIndex(s => s.id === newId)
  const oldIndex = sections.findIndex(s => s.id === oldId)
  tickDirection.value = newIndex >= oldIndex ? 'up' : 'down'
})

// Measured width of the incoming label, so the odometer window can *glide*
// between word lengths (a CSS width transition) instead of snapping the
// moment the label swaps. `w-max` on the measurer keeps it reporting the
// label's full width even while the window itself is still mid-transition.
const measureEl = ref<HTMLElement | null>(null)
const tickWidth = ref<number | null>(null)

function measureTick() {
  if (measureEl.value) tickWidth.value = measureEl.value.offsetWidth
}

watch(currentId, () => nextTick(measureTick))

function jumpTo(id: string) {
  const el = document.getElementById(id)
  if (!el) return
  el.scrollIntoView({ behavior: reduceMotion() ? 'auto' : 'smooth', block: 'start' })
  expanded.value = false
}

let observer: IntersectionObserver | undefined

onMounted(() => {
  // First width measurement, then re-measure once webfonts land (Fraunces
  // arriving after mount changes the label's rendered width).
  measureTick()
  document.fonts?.ready.then(measureTick)

  const els = sections
    .map(s => document.getElementById(s.id))
    .filter((el): el is HTMLElement => !!el)

  // Whichever section crosses a thin band through the viewport's vertical
  // centre is "current" — a standard scrollspy pivot, rather than reacting
  // to any part of a (often very tall) section merely being on screen.
  observer = new IntersectionObserver(
    (entries) => {
      const visible = entries.filter(e => e.isIntersecting)
      if (visible.length === 0) return
      const topmost = visible.reduce((a, b) => (a.boundingClientRect.top < b.boundingClientRect.top ? a : b))
      currentId.value = topmost.target.id
    },
    { rootMargin: '-45% 0px -45% 0px', threshold: 0 },
  )
  els.forEach(el => observer!.observe(el))
})

onUnmounted(() => {
  observer?.disconnect()
})
</script>

<style scoped>
.site-item {
  transition: grid-template-columns 0.42s cubic-bezier(0.16, 1, 0.3, 1);
}
.site-btn {
  transition:
    opacity 0.3s ease,
    color 0.3s ease,
    background-color 0.35s ease,
    border-color 0.3s ease;
}

/* Odometer window glides between label widths in step with the roll. */
.site-tick {
  transition: width 0.45s cubic-bezier(0.16, 1, 0.3, 1);
}

/* The roll itself: outgoing label leaves at once, incoming follows a beat
   behind (60ms) so the two never overlap mid-window; both fade through the
   move so edges dissolve instead of clipping hard against the window. */
.tick-up-enter-active,
.tick-down-enter-active {
  transition:
    transform 0.4s cubic-bezier(0.16, 1, 0.3, 1) 60ms,
    opacity 0.3s ease 60ms;
}
.tick-up-leave-active,
.tick-down-leave-active {
  transition:
    transform 0.4s cubic-bezier(0.16, 1, 0.3, 1),
    opacity 0.25s ease;
}
/* Scrolling forward: new label rolls up into place, old one rolls up and out. */
.tick-up-enter-from {
  transform: translateY(110%);
  opacity: 0;
}
.tick-up-leave-to {
  transform: translateY(-110%);
  opacity: 0;
}
/* Scrolling back up the page: reversed, both roll downward. */
.tick-down-enter-from {
  transform: translateY(-110%);
  opacity: 0;
}
.tick-down-leave-to {
  transform: translateY(110%);
  opacity: 0;
}

@media (prefers-reduced-motion: reduce) {
  .site-item,
  .site-btn,
  .site-tick,
  .tick-up-enter-active,
  .tick-up-leave-active,
  .tick-down-enter-active,
  .tick-down-leave-active {
    transition: none !important;
  }
}
</style>
