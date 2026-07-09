<template>
  <!-- Vertical sibling of the career timeline cards: same spine + hover-reveal
       language (a fixed always-visible tab, full content shown for whichever
       one is active), just stacked top-to-bottom instead of left-to-right. -->
  <div class="reveal flex h-112 w-full flex-col overflow-hidden rounded-xl border border-white/15">
    <article
      v-for="(item, i) in items"
      :key="item.id"
      tabindex="0"
      :aria-label="item.label"
      class="location-card group relative flex flex-col overflow-hidden outline-none focus-visible:ring-2 focus-visible:ring-white/40"
      :class="i > 0 && 'border-t border-white/10'"
      :style="cardStyle(i)"
      @mouseenter="hovered = i"
      @mouseleave="hovered = null"
      @focusin="hovered = i"
      @focusout="hovered = null"
    >
      <!-- Spine — always visible tab -->
      <div class="location-spine flex shrink-0 items-center justify-between gap-3 px-5 py-4">
        <span class="font-display text-sm font-semibold uppercase tracking-label text-white">
          {{ item.label }}
        </span>
        <span
          v-if="item.id === 'map' && status"
          class="font-display text-3xs uppercase tracking-label text-white/70"
        >
          {{ status.label }}
        </span>
      </div>

      <!-- Content — revealed when active -->
      <div class="location-content min-h-0 flex-1" :style="{ opacity: activeIndex === i ? 1 : 0 }">
        <LocationMap v-if="item.id === 'map'" />

        <div v-else class="relative h-full">
          <NuxtImg
            src="/images/smart-smiles.avif"
            :alt="`The front of ${practice.name}, ${practice.location}`"
            sizes="40vw"
            loading="lazy"
            class="absolute inset-0 h-full w-full object-cover"
          />

          <!-- Opening hours -->
          <dl class="pointer-events-none absolute inset-x-0 bottom-0 grid gap-y-1 bg-linear-to-t from-black/90 via-black/70 to-transparent p-5 pt-32">
            <div v-for="g in hourGroups" :key="g.label" class="flex items-baseline justify-between gap-3 font-display text-3xs uppercase tracking-label">
              <dt class="text-white/70">{{ g.label }}</dt>
              <dd class="m-0 text-white">{{ g.open && g.close ? `${formatTime(g.open)} – ${formatTime(g.close)}` : 'Closed' }}</dd>
            </div>
          </dl>
        </div>
      </div>
    </article>
  </div>
</template>

<script setup lang="ts">
import { practice } from '../data/contact'

const items = [
  { id: 'map', label: 'Map' },
  { id: 'photo', label: practice.name },
]

const hovered = ref<number | null>(null)
// Default to the photo — a look at the practice first, map second.
const activeIndex = computed(() => hovered.value ?? 1)

// Fixed spine height, matches the career cards' proportions.
const SPINE_HEIGHT = 52

// Primary-tinted rather than a neutral white wash: darker (closer to full
// primary) at rest so the card recedes into the footer panel behind it,
// lighter when active as a brightness-lift state cue.
function cardStyle(i: number) {
  const active = activeIndex.value === i
  return {
    flexGrow: active ? 1 : 0,
    flexShrink: 0,
    flexBasis: active ? 'auto' : `${SPINE_HEIGHT}px`,
    backgroundColor: usePrimaryTint(active ? 65 : 95),
    transition: 'flex-basis 0.5s cubic-bezier(0.22, 1, 0.36, 1), flex-grow 0.5s cubic-bezier(0.22, 1, 0.36, 1), background-color 0.4s ease',
  }
}

// Collapses consecutive days with identical hours into one row (Mon-Thu /
// Fri / Sat-Sun here) instead of listing all seven separately.
const hourGroups = practice.hours.reduce<{ label: string, open: string | null, close: string | null }[]>((groups, d) => {
  const last = groups[groups.length - 1]
  if (last && last.open === d.open && last.close === d.close) {
    const [start] = last.label.split(' – ')
    last.label = `${start} – ${d.day}`
  } else {
    groups.push({ label: d.day, open: d.open, close: d.close })
  }
  return groups
}, [])

function formatTime(t: string) {
  const [h = 0, m = 0] = t.split(':').map(Number)
  const period = h >= 12 ? 'pm' : 'am'
  const h12 = h % 12 === 0 ? 12 : h % 12
  return m === 0 ? `${h12}${period}` : `${h12}:${String(m).padStart(2, '0')}${period}`
}

// Computed client-side only (depends on the visitor's current time) — stays
// null through SSR/hydration so there's nothing to mismatch, then fills in
// on mount.
const status = ref<{ open: boolean, label: string } | null>(null)

onMounted(() => {
  const now = new Date()
  const todayIndex = (now.getDay() + 6) % 7 // JS getDay is Sun=0; our array starts Monday
  const nowMinutes = now.getHours() * 60 + now.getMinutes()
  const toMinutes = (t: string) => {
    const [h = 0, m = 0] = t.split(':').map(Number)
    return h * 60 + m
  }

  const today = practice.hours[todayIndex]
  if (today?.open && today.close && nowMinutes >= toMinutes(today.open) && nowMinutes < toMinutes(today.close)) {
    status.value = { open: true, label: `Open · closes ${formatTime(today.close)}` }
    return
  }

  for (let offset = 1; offset <= 7; offset++) {
    const day = practice.hours[(todayIndex + offset) % 7]
    if (day?.open) {
      const when = offset === 1 ? 'tomorrow' : day.day
      status.value = { open: false, label: `Closed · opens ${when} ${formatTime(day.open)}` }
      return
    }
  }
  status.value = { open: false, label: 'Closed' }
})
</script>
