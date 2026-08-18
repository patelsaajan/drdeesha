<template>
  <!-- The section sits on a light wash of primary rather than the page
       white — a soft lavender ground that gives the card's deeper tints a
       related field to sit on. -->
  <section id="about" ref="root" class="relative z-20 text-foreground" :style="{ backgroundColor: usePrimaryTint(6) }">
    <div class="mx-auto max-w-6xl px-4 py-24 sm:px-6 lg:py-28">

      <p class="reveal font-display text-xs font-semibold uppercase tracking-eyebrow text-primary">
        About
      </p>

      <!-- One card, split 2/5 : 3/5 — a rail of questions on the left, the
           answer to the selected one on the right. It replaces the old
           mosaic of fixed tiles: the same copy, but the visitor chooses
           which part they want rather than scrolling past all of it.

           Standard tablist semantics (roving tabindex, arrow/Home/End keys),
           so it's operable from the keyboard and announced as a tab set.
           Below lg the split becomes a stack, rail above and panel below,
           and the rail scrolls horizontally rather than eating the screen. -->
      <div class="reveal mt-10 grid overflow-hidden rounded-2xl lg:mt-12 lg:grid-cols-5">

        <!-- Rail -->
        <div
          class="lg:col-span-2"
          :style="{ backgroundColor: usePrimaryTint(80) }"
        >
          <div
            role="tablist"
            aria-orientation="vertical"
            aria-label="About Dr Deesha"
            class="flex flex-col"
            @keydown="onKeydown"
          >
            <button
              v-for="(topic, i) in aboutTopics"
              :id="`about-tab-${topic.id}`"
              :key="topic.id"
              ref="tabEls"
              type="button"
              role="tab"
              :aria-selected="topic.id === activeId"
              :aria-controls="`about-panel-${topic.id}`"
              :tabindex="topic.id === activeId ? 0 : -1"
              class="group relative flex cursor-pointer flex-col justify-center gap-1 px-6 py-5 text-left outline-none transition-colors duration-250 ease-out focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-inset sm:px-8 lg:px-8 lg:py-6"
              :style="{ backgroundColor: topic.id === activeId ? usePrimaryTint(67) : 'transparent' }"
              @click="select(i)"
            >
              <!-- The active row takes the panel's own tint so the two read
                   as one surface opening rightward, and the accent rule marks
                   which row that is without relying on the tint alone. -->
              <span
                aria-hidden="true"
                class="absolute inset-y-0 left-0 w-0.5 bg-accent transition-opacity duration-250"
                :class="topic.id === activeId ? 'opacity-100' : 'opacity-0'"
              />
              <span
                class="font-display text-base font-semibold transition-colors duration-250"
                :class="topic.id === activeId ? 'text-white' : 'text-white/75 group-hover:text-white'"
              >
                {{ topic.label }}
              </span>
              <span class="font-display text-2xs uppercase tracking-label text-white/55">
                {{ topic.hint }}
              </span>
            </button>
          </div>
        </div>

        <!-- Panel -->
        <div
          class="lg:col-span-3"
          :style="{ backgroundColor: usePrimaryTint(67) }"
        >
          <div
            v-for="topic in aboutTopics"
            v-show="topic.id === activeId"
            :id="`about-panel-${topic.id}`"
            :key="topic.id"
            role="tabpanel"
            :aria-labelledby="`about-tab-${topic.id}`"
            tabindex="0"
            class="flex h-full flex-col justify-center gap-5 p-6 outline-none sm:p-10 lg:p-14"
          >
            <h2 class="m-0 max-w-xl font-serif font-normal leading-snug tracking-heading text-white" style="font-size: clamp(1.6rem, 2.6vw, 2.25rem)">
              {{ topic.heading }}
            </h2>

            <p
              v-for="(para, i) in topic.body"
              :key="i"
              class="m-0 max-w-xl font-display text-base font-light leading-relaxed text-white/85 lg:text-lg"
            >
              {{ para }}
            </p>

            <figure v-if="topic.image" class="relative m-0 h-48 shrink-0 overflow-hidden rounded-xl lg:h-56" :style="{ backgroundColor: usePrimaryTint(50) }">
              <NuxtImg
                :src="topic.image.src"
                :alt="topic.image.alt"
                sizes="100vw lg:55vw"
                loading="lazy"
                class="absolute inset-0 h-full w-full object-cover"
              />
            </figure>
          </div>
        </div>
      </div>

      <!-- The booking prompt the mosaic used to carry in two places, kept as
           one line under the card so the section still closes on an action. -->
      <a
        :href="practice.bookingHref"
        class="reveal group mt-5 flex flex-col justify-center gap-4 rounded-2xl bg-primary p-6 text-white outline-none transition-colors duration-250 ease-out hover:bg-accent hover:text-primary focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 sm:flex-row sm:items-center sm:justify-between sm:p-8"
      >
        <span class="max-w-2xl font-serif font-normal leading-snug tracking-heading transition-colors" style="font-size: clamp(1.15rem, 1.7vw, 1.55rem)">
          New patients welcome — and you won't get a lecture.
        </span>
        <span class="flex shrink-0 items-center gap-2 font-display text-sm font-semibold uppercase tracking-label text-white transition-colors group-hover:text-primary">
          Book an appointment
          <span aria-hidden="true" class="inline-block text-accent transition-all duration-250 ease-out group-hover:translate-x-0.5 group-hover:text-primary">↗</span>
        </span>
      </a>

    </div>
  </section>
</template>

<script setup lang="ts">
import { aboutTopics } from '../data/about'
import { practice } from '../data/contact'

const root = ref<HTMLElement | null>(null)
useSectionReveal(root, { stagger: 0.12 })

const activeId = ref(aboutTopics[0]!.id)
const tabEls = ref<HTMLElement[]>([])

function select(i: number) {
  const topic = aboutTopics[i]
  if (!topic) return
  activeId.value = topic.id
}

// Arrow keys move selection and focus together — the "automatic activation"
// tablist pattern, which suits a set this small where every panel is cheap
// to show.
function onKeydown(e: KeyboardEvent) {
  const current = aboutTopics.findIndex(t => t.id === activeId.value)
  let next = -1

  if (e.key === 'ArrowDown' || e.key === 'ArrowRight') next = (current + 1) % aboutTopics.length
  else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') next = (current - 1 + aboutTopics.length) % aboutTopics.length
  else if (e.key === 'Home') next = 0
  else if (e.key === 'End') next = aboutTopics.length - 1
  else return

  e.preventDefault()
  select(next)
  nextTick(() => tabEls.value[next]?.focus())
}
</script>

<style scoped>
/* Start hidden only where we'll animate; reduced-motion keeps everything visible. */
@media (prefers-reduced-motion: no-preference) {
  .reveal {
    opacity: 0;
  }
}
</style>
