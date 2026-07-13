<template>
  <!-- Light frosted pill, anchored to the right edge. Two-part rhythm:
       - Rest: one stationary chip sits directly left of a fixed Book Now
         button. Neither ever moves or restyles as you scroll — a section
         change is told entirely by the odometer inside the chip (the old
         label ticks out, the new one ticks in) over an unchanging tint.
       - Hover: the chip folds away while the section list unfurls leftward
         from the Book Now anchor, each item cascading in on a stagger,
         the current one carrying the highlight.
       Sections keep their true page order; each is its own grid column that
       collapses to a real `0fr` (not a flex-basis trick that leaves a width
       sliver behind and shoves Book Now off the true edge).
       Desktop only — hover has no meaning on touch, so under lg the bottom
       bar further down takes over. -->
  <nav
    class="site-nav fixed top-6 right-6 z-40 hidden h-11 w-fit items-stretch overflow-hidden rounded-lg border border-black/8 bg-white/55 text-foreground shadow-lift backdrop-blur-md lg:flex"
    @mouseenter="expanded = true"
    @mouseleave="expanded = false"
  >
    <div
      v-for="(section, i) in sections"
      :key="section.id"
      class="site-item grid h-full min-w-0 overflow-hidden"
      :style="{
        gridTemplateColumns: expanded ? 'minmax(0, 1fr)' : 'minmax(0, 0fr)',
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
          opacity: expanded ? 1 : 0,
          transitionDelay: staggerDelay(i),
        }"
        @click="jumpTo(section.id)"
      >
        {{ section.label }}
      </button>
    </div>

    <!-- Rest-state chip: a stationary window that never moves or changes
         tint — section changes read purely as the odometer roll inside it.
         Its width comes from a JS measurement of the incoming label (the
         measurer span below reports it) and is transitioned, so the chip
         glides between word lengths in step with the roll instead of
         snapping. Until the first measurement (SSR / pre-mount) an
         invisible in-flow sizer holds the width. Folds away while the
         hover list above has the floor. -->
    <div
      class="site-item grid h-full min-w-0 overflow-hidden"
      :style="{ gridTemplateColumns: expanded ? 'minmax(0, 0fr)' : 'minmax(0, 1fr)' }"
    >
      <button
        type="button"
        class="site-btn flex h-full min-w-0 cursor-pointer items-center justify-start overflow-hidden whitespace-nowrap bg-primary/12 px-4 font-display text-2xs font-semibold uppercase tracking-label text-primary"
        :style="{ opacity: expanded ? 0 : 1 }"
        @click="jumpTo(current.id)"
      >
        <span
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

  <!-- Mobile: the same frosted pill, docked along the bottom edge where the
       thumb actually is. Book Now keeps its permanent right-edge anchor;
       tapping Menu unfolds the section list upward out of the bar, items
       cascading in bottom-first — the vertical cousin of the desktop unfurl. -->
  <div
    v-if="menuOpen"
    class="fixed inset-0 z-30 lg:hidden"
    aria-hidden="true"
    @click="menuOpen = false"
  />

  <nav
    aria-label="Sections"
    class="fixed inset-x-4 z-40 lg:hidden"
    style="bottom: calc(1rem + env(safe-area-inset-bottom, 0px))"
  >
    <div class="menu-fold grid" :class="menuOpen && 'is-open'">
      <div class="min-h-0 overflow-hidden">
        <ul id="mobile-menu" class="m-0 mb-2 list-none rounded-lg border border-black/8 bg-white/85 p-1.5 shadow-lift backdrop-blur-md">
          <li v-for="(section, i) in sections" :key="section.id">
            <button
              type="button"
              class="menu-item flex min-h-11 w-full cursor-pointer items-center justify-between rounded-md px-4 font-display text-2xs font-semibold uppercase tracking-label"
              :class="section.id === current.id ? 'bg-primary/12 text-primary' : 'text-foreground/60'"
              :style="{ transitionDelay: menuStagger(i) }"
              @click="jumpTo(section.id)"
            >
              {{ section.label }}
              <span v-if="section.id === current.id" aria-hidden="true" class="h-1 w-1 rounded-full bg-accent" />
            </button>
          </li>
        </ul>
      </div>
    </div>

    <div class="flex h-12 items-stretch overflow-hidden rounded-lg border border-black/8 bg-white/55 text-foreground shadow-lift backdrop-blur-md">
      <button
        type="button"
        class="flex min-w-0 flex-1 cursor-pointer items-center gap-3 px-5 font-display text-2xs font-semibold uppercase tracking-label text-foreground"
        :aria-expanded="menuOpen"
        aria-controls="mobile-menu"
        @click="menuOpen = !menuOpen"
      >
        <span class="menu-glyph relative block h-2.5 w-3.5 shrink-0" :class="menuOpen && 'is-open'" aria-hidden="true" />
        Menu
      </button>

      <UButton
        :href="practice.bookingHref"
        variant="solid"
        color="primary"
        class="site-nav-book h-full shrink-0 cursor-pointer rounded-l-none rounded-r-lg border-l border-black/8 bg-primary! px-6 text-white! transition-colors duration-200 hover:bg-accent!"
      >
        Book Now
      </UButton>
    </div>
  </nav>
</template>

<script setup lang="ts">
import gsap from 'gsap'
import { ScrollToPlugin } from 'gsap/ScrollToPlugin'
import { practice } from '../data/contact'
import { siteSections as sections } from '../data/sections'

const currentId = ref(sections[0]!.id)
const current = computed(() => sections.find(s => s.id === currentId.value) ?? sections[0]!)

// `expanded` drives the width/opacity unfurl. The active section carries its
// highlight at all times (including the compact state), so there's no separate
// deferred-highlight state to track.
const expanded = ref(false)

// Mobile bottom bar's unfolded section list.
const menuOpen = ref(false)

const STAGGER_MS = 55
const MENU_STAGGER_MS = 40

function reduceMotion() {
  return import.meta.client && window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

// Unfurl reads as rolling out from behind Book Now: the rightmost section
// moves first, the leftmost last. On collapse everything closes together.
function staggerDelay(i: number) {
  if (!expanded.value || reduceMotion()) return '0ms'
  return `${(sections.length - 1 - i) * STAGGER_MS}ms`
}

// The mobile list grows out of the bar beneath it, so the cascade runs
// bottom-first — the item nearest the bar lands first.
function menuStagger(i: number) {
  if (!menuOpen.value || reduceMotion()) return '0ms'
  return `${(sections.length - 1 - i) * MENU_STAGGER_MS}ms`
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

// Section jumps ride a GSAP tween instead of native smooth scroll: the
// duration scales with distance (clamped both ends) on a symmetric ease, so
// a hop to the neighbouring section feels immediate while a full-page
// journey sweeps through the pinned scrub sections at a deliberate pace
// instead of the browser's. autoKill hands control straight back to the
// visitor's own wheel or touch the moment they use it.
function jumpTo(id: string) {
  const el = document.getElementById(id)
  if (!el) return
  expanded.value = false
  menuOpen.value = false

  if (reduceMotion()) {
    el.scrollIntoView({ behavior: 'auto', block: 'start' })
    return
  }

  // The stylesheet's scroll-behavior:smooth (kept for the footer's plain
  // anchor links) would fight the tween: the browser re-animates every
  // incremental position the tween sets, the real position never matches
  // the expected one, and autoKill reads that as the visitor scrolling —
  // killing the tween on its first tick. Park it on 'auto' for the ride.
  const htmlStyle = document.documentElement.style
  htmlStyle.scrollBehavior = 'auto'
  const restore = () => { htmlStyle.scrollBehavior = '' }

  const targetY = window.scrollY + el.getBoundingClientRect().top
  const duration = gsap.utils.clamp(0.7, 1.6, Math.abs(targetY - window.scrollY) / 2600)
  gsap.to(window, {
    scrollTo: { y: targetY, autoKill: true },
    duration,
    ease: 'power3.inOut',
    overwrite: 'auto',
    onComplete: restore,
    onInterrupt: restore,
  })
}

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape') menuOpen.value = false
}

let observer: IntersectionObserver | undefined

onMounted(() => {
  gsap.registerPlugin(ScrollToPlugin)

  // First width measurement, then re-measure once webfonts land (Fraunces
  // arriving after mount changes the label's rendered width). Also on resize:
  // the desktop pill is display:none under lg, where the measurer reports 0.
  measureTick()
  document.fonts?.ready.then(measureTick)
  window.addEventListener('resize', measureTick)
  window.addEventListener('keydown', onKeydown)

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
  window.removeEventListener('resize', measureTick)
  window.removeEventListener('keydown', onKeydown)
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

/* Mobile menu: the sheet's row folds open (0fr -> 1fr) while the bar stays
   bottom-anchored, so growth reads as unfolding upward. Items ride a small
   fade/lift on a per-item delay for the cascade. */
.menu-fold {
  grid-template-rows: 0fr;
  transition: grid-template-rows 0.45s cubic-bezier(0.16, 1, 0.3, 1);
}
.menu-fold.is-open {
  grid-template-rows: 1fr;
}
.menu-item {
  opacity: 0;
  transform: translateY(8px);
  transition:
    opacity 0.25s ease,
    transform 0.4s cubic-bezier(0.16, 1, 0.3, 1),
    background-color 0.3s ease,
    color 0.3s ease;
}
.menu-fold.is-open .menu-item {
  opacity: 1;
  transform: none;
}

/* Two bars folding into a close cross. */
.menu-glyph::before,
.menu-glyph::after {
  content: "";
  position: absolute;
  left: 0;
  right: 0;
  height: 1.5px;
  background: currentColor;
  transition:
    transform 0.35s cubic-bezier(0.16, 1, 0.3, 1),
    top 0.35s cubic-bezier(0.16, 1, 0.3, 1);
}
.menu-glyph::before {
  top: 1px;
}
.menu-glyph::after {
  top: 7px;
}
.menu-glyph.is-open::before {
  top: 4px;
  transform: rotate(45deg);
}
.menu-glyph.is-open::after {
  top: 4px;
  transform: rotate(-45deg);
}

@media (prefers-reduced-motion: reduce) {
  .site-item,
  .site-btn,
  .site-tick,
  .tick-up-enter-active,
  .tick-up-leave-active,
  .tick-down-enter-active,
  .tick-down-leave-active,
  .menu-fold,
  .menu-item,
  .menu-glyph::before,
  .menu-glyph::after {
    transition: none !important;
  }
}
</style>
