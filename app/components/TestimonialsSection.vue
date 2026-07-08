<template>
  <section ref="root" class="relative z-20 bg-background text-foreground">
    <div class="mx-auto flex min-h-dvh max-w-6xl flex-col justify-center px-4 py-24 sm:px-6">

      <p class="reveal font-display text-[0.72rem] font-semibold uppercase tracking-[0.35em] text-primary">
        Kind words
      </p>

      <!-- Rotating quote -->
      <div
        class="reveal relative mt-10 min-h-[15rem] sm:min-h-[17rem] lg:min-h-[20rem]"
        @mouseenter="pause"
        @mouseleave="resume"
      >
        <Transition name="quote">
          <figure :key="current.id" class="m-0">
            <blockquote class="max-w-5xl font-serif text-[clamp(1.6rem,4.4vw,3.5rem)] font-normal leading-[1.16] tracking-[-0.01em] text-foreground">
              &ldquo;{{ current.quote }}&rdquo;
            </blockquote>
            <figcaption class="mt-8 flex flex-wrap items-center gap-x-3 gap-y-1">
              <span class="font-display text-sm font-semibold tracking-wide text-foreground">{{ current.name }}</span>
              <span class="h-1 w-1 rounded-full bg-foreground/30" />
              <span class="font-display text-sm font-light text-foreground/55">{{ current.context }}</span>
              <span v-if="current.source" class="font-display text-[0.62rem] uppercase tracking-[0.18em] text-foreground/40">· {{ current.source }}</span>
            </figcaption>
          </figure>
        </Transition>
      </div>

      <!-- Indicators -->
      <div class="reveal mt-12 flex items-center gap-3">
        <button
          v-for="(item, i) in testimonials"
          :key="item.id"
          type="button"
          :aria-label="`Show review from ${item.name}`"
          :aria-current="i === index"
          class="group -m-1 p-1 outline-none"
          @click="goTo(i)"
        >
          <span
            class="block h-2 w-2 rounded-full transition-all duration-300 group-focus-visible:ring-2 group-focus-visible:ring-primary/40"
            :class="i === index ? 'w-6 bg-primary' : 'bg-foreground/20 group-hover:bg-foreground/40'"
          />
        </button>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import gsap from 'gsap'
import { testimonials } from '../data/testimonials'

const INTERVAL = 7000

const index = ref(0)
const current = computed(() => testimonials[index.value]!)

let timer: ReturnType<typeof setInterval> | undefined
let hovered = false

function start() {
  stop()
  if (hovered || testimonials.length < 2) return
  timer = setInterval(() => {
    index.value = (index.value + 1) % testimonials.length
  }, INTERVAL)
}
function stop() {
  if (timer) {
    clearInterval(timer)
    timer = undefined
  }
}
function goTo(i: number) {
  index.value = i
  start() // reset the timer on manual selection
}
function pause() {
  hovered = true
  stop()
}
function resume() {
  hovered = false
  start()
}
function onVisibility() {
  if (document.hidden) stop()
  else start()
}

const root = ref<HTMLElement | null>(null)
let ctx: gsap.Context | undefined
let observer: IntersectionObserver | undefined

onMounted(() => {
  start()
  document.addEventListener('visibilitychange', onVisibility)

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
          stagger: 0.12,
        })
      },
      { threshold: 0.2 },
    )
    observer.observe(el)
  }, el)
})

onUnmounted(() => {
  stop()
  document.removeEventListener('visibilitychange', onVisibility)
  observer?.disconnect()
  ctx?.revert()
})
</script>

<style scoped>
@media (prefers-reduced-motion: no-preference) {
  .reveal {
    opacity: 0;
  }
}

/* Crossfade between quotes; the leaving quote is pulled out of flow so the
   entering one sets the container height. */
.quote-enter-active,
.quote-leave-active {
  transition:
    opacity 0.6s ease,
    transform 0.6s cubic-bezier(0.22, 1, 0.36, 1);
}
.quote-enter-from {
  opacity: 0;
  transform: translateY(14px);
}
.quote-leave-to {
  opacity: 0;
  transform: translateY(-14px);
}
.quote-leave-active {
  position: absolute;
  inset: 0;
}

@media (prefers-reduced-motion: reduce) {
  .quote-enter-active,
  .quote-leave-active {
    transition: opacity 0.2s ease;
    transform: none;
  }
  .quote-enter-from,
  .quote-leave-to {
    transform: none;
  }
}
</style>
