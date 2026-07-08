<template>
  <div class="relative bg-background">

    <!-- Book Now button — appears once you scroll down -->
    <Transition name="fade">
      <UButton
        v-if="showBookNow"
        variant="solid"
        color="primary"
        size="lg"
        class="fixed top-6 right-6 z-40 rounded-full px-6"
      >
        Book Now
      </UButton>
    </Transition>

    <!-- Fixed wordmark — stays centred while smiles scroll behind it -->
    <div class="intro-title pointer-events-none fixed inset-0 z-10 flex flex-col items-center justify-center gap-2">
      <h1 class="m-0 font-serif font-normal leading-none tracking-heading text-foreground" style="font-size: clamp(3rem, 10vw, 7rem)">
        Dr Deesha
      </h1>
      <div class="flex items-center gap-3" style="width: clamp(20rem, 55vw, 48rem)">
        <span class="flex-1 h-px bg-foreground" />
        <span class="font-display font-semibold tracking-eyebrow uppercase text-foreground" style="font-size: clamp(0.7rem, 1.2vw, 0.9rem)">Dental</span>
        <span class="flex-1 h-px bg-foreground" />
      </div>
    </div>

    <!-- Smile scroll track — above the wordmark -->
    <div
      class="relative z-20 overflow-x-clip"
      :style="{ height: `${trackHeight}dvh`, '--smile-w': 'min(clamp(12rem, 27vw, 28.5rem), 69dvh)' }"
    >
      <div
        v-for="smile in smiles"
        :key="smile.id"
        class="smile absolute -translate-x-1/2"
        :style="{ top: `${smile.top}dvh`, left: colLeft(smile.col) }"
      >
        <div class="overflow-hidden rounded-sm bg-foreground/5" style="width: var(--smile-w); aspect-ratio: 3 / 2">
          <NuxtImg :src="smile.src" alt="" sizes="12rem md:27vw" class="h-full w-full object-cover" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const images = [
  '/images/smile/smile-1.jpeg',
  '/images/smile/smile-2.jpeg',
  '/images/smile/smile-3.png',
  '/images/smile/smile-4.png',
  '/images/smile/smile-5.png',
]

const COLUMN_GAP = 20 // fixed px gap between adjacent smile columns, at any viewport size
const COUNT = 6
// dvh between consecutive smiles. Tuned so ~2-3 (avg ~2.5) are visible at once:
// tight enough to overlap two steps sometimes, but never three (100dvh viewport +
// 46dvh worst-case smile height = 146dvh max co-visible span; 3 * STEP = 162 > 146).
const STEP = 54
const OFFSET = 104 // dvh before the first smile — clears a full viewport so none show on initial load

// Fixed, deliberately non-sequential column order (1-indexed: 2,4,1,3,1,4).
// Columns 2 and 3 flank the wordmark and are never adjacent here — and since a
// smile 3 steps away can never share the screen (see STEP above), only smiles
// 1-2 steps apart can co-appear, and none of those pairings put col 2 next to
// col 3.
const colOrder = [1, 3, 0, 2, 0, 3]

const smiles = Array.from({ length: COUNT }, (_, i) => ({
  id: i,
  col: colOrder[i % colOrder.length] ?? 0,
  top: OFFSET + i * STEP,
  src: images[i % images.length],
}))

const trackHeight = OFFSET + (COUNT - 1) * STEP + 96

const EDGE_MARGIN = 24 // px, minimum clearance between a smile's outer edge and the viewport edge

// Centre-to-centre column position: 4 equal-width columns, COLUMN_GAP apart,
// centred on the track. `factor` is the column's offset from the middle in
// units of column spacing: -1.5, -0.5, 0.5, 1.5 for columns 0-3.
// The spacing is the smaller of the ideal (width + gap) and whatever keeps the
// outermost columns (factor 1.5) from clipping past the viewport edge —
// otherwise, on a viewport narrower than 3 * (width + gap), columns 0 and 3
// would be pushed off-screen.
function colLeft(col: number) {
  const factor = col - 1.5
  const sign = factor < 0 ? '-' : '+'
  const idealSpacing = `(var(--smile-w) + ${COLUMN_GAP}px)`
  const maxSpacing = `((50% - ${EDGE_MARGIN}px - (var(--smile-w) / 2)) / 1.5)`
  const spacing = `min(${idealSpacing}, ${maxSpacing})`
  return `calc(50% ${sign} ${Math.abs(factor)} * ${spacing})`
}

const showBookNow = ref(false)

let lastY = 0

function onScroll() {
  const y = window.scrollY
  const up = y < lastY
  lastY = y
  showBookNow.value = y > window.innerHeight * 0.6 && !up
}

onMounted(() => {
  window.addEventListener('scroll', onScroll, { passive: true })
})

onUnmounted(() => {
  window.removeEventListener('scroll', onScroll)
})
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
