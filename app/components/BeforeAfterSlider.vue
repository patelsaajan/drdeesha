<template>
  <!-- data-vaul-no-drag: stop the enclosing Vaul drawer from reading a slider
       drag (or an image swipe) as a swipe-to-dismiss and closing itself. -->
  <figure class="m-0" data-vaul-no-drag>
    <div
      ref="containerRef"
      class="relative cursor-ew-resize touch-none select-none overflow-hidden rounded-lg bg-foreground/5"
      style="aspect-ratio: 3 / 2"
      @pointerdown="onPointerDown"
      @pointermove="onPointerMove"
      @pointerup="onPointerUp"
      @pointercancel="onPointerUp"
    >
      <!-- After sits underneath, always fully painted -->
      <NuxtImg
        :src="after"
        :alt="`${label}, after`"
        sizes="40vw"
        loading="lazy"
        draggable="false"
        class="pointer-events-none absolute inset-0 h-full w-full object-cover"
      />

      <!-- Before layered on top, revealed from the left up to `position`% -->
      <NuxtImg
        :src="before"
        :alt="`${label}, before`"
        sizes="40vw"
        loading="lazy"
        draggable="false"
        class="pointer-events-none absolute inset-0 h-full w-full object-cover"
        :style="{ clipPath: `inset(0 ${100 - position}% 0 0)` }"
      />

      <!-- Split line -->
      <div
        class="pointer-events-none absolute inset-y-0 w-0.5 bg-white/80 shadow-[0_0_0_1px_rgba(0,0,0,0.15)]"
        :style="{ left: `${position}%` }"
      />

      <!-- Drag handle — the line itself is the control. Dragging anywhere on
           the image works too (the pointer handlers are on the container),
           this is just the focusable, keyboard-operable target. -->
      <div
        role="slider"
        tabindex="0"
        aria-label="Reveal before or after"
        aria-orientation="horizontal"
        :aria-valuenow="Math.round(position)"
        aria-valuemin="0"
        aria-valuemax="100"
        class="absolute top-1/2 grid size-8 -translate-x-1/2 -translate-y-1/2 cursor-ew-resize place-items-center rounded-full bg-background shadow-md outline-none ring-1 ring-black/10 focus-visible:ring-2 focus-visible:ring-primary/50"
        :style="{ left: `${position}%` }"
        @keydown="onKeydown"
      >
        <!-- Opposing triangles read as "drag left-right" rather than the
             two vertical bars this used to be, which looked like a pause
             button and had nothing to do with dragging. -->
        <svg width="14" height="10" viewBox="0 0 14 10" fill="none" aria-hidden="true">
          <path d="M5 1 L1 5 L5 9" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="text-foreground/50" />
          <path d="M9 1 L13 5 L9 9" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="text-foreground/50" />
        </svg>
      </div>

      <!-- Corner labels -->
      <UBadge
        color="neutral"
        variant="solid"
        class="pointer-events-none absolute left-3 top-3 font-display text-3xs font-semibold uppercase tracking-label"
      >
        Before
      </UBadge>
      <UBadge
        color="primary"
        variant="solid"
        class="pointer-events-none absolute right-3 top-3 font-display text-3xs font-semibold uppercase tracking-label"
      >
        After
      </UBadge>
    </div>
  </figure>
</template>

<script setup lang="ts">
defineProps<{
  before: string
  after: string
  label: string
}>()

// 0 = show all "after", 100 = show all "before". Start at an even split.
const position = ref(50)

const containerRef = ref<HTMLElement | null>(null)
let dragging = false

function updateFromClientX(clientX: number) {
  const el = containerRef.value
  if (!el) return
  const rect = el.getBoundingClientRect()
  const pct = ((clientX - rect.left) / rect.width) * 100
  position.value = Math.min(100, Math.max(0, pct))
}

function onPointerDown(e: PointerEvent) {
  dragging = true
  containerRef.value?.setPointerCapture(e.pointerId)
  updateFromClientX(e.clientX)
}

function onPointerMove(e: PointerEvent) {
  if (!dragging) return
  updateFromClientX(e.clientX)
}

function onPointerUp(e: PointerEvent) {
  dragging = false
  containerRef.value?.releasePointerCapture(e.pointerId)
}

const KEY_STEP = 5

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
    position.value = Math.max(0, position.value - KEY_STEP)
  } else if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
    position.value = Math.min(100, position.value + KEY_STEP)
  } else if (e.key === 'Home') {
    position.value = 0
  } else if (e.key === 'End') {
    position.value = 100
  } else {
    return
  }
  e.preventDefault()
}
</script>
