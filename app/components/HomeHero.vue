<template>
  <div class="relative bg-background">

    <!-- Book Now button — appears when empty space is in view -->
    <Transition name="fade">
      <UButton
        v-if="showBookNow"
        variant="solid"
        color="primary"
        size="lg"
        class="fixed top-6 right-6 z-30 rounded-full px-6"
      >
        Book Now
      </UButton>
    </Transition>

    <!-- Intro title -->
    <div class="intro-title pointer-events-none fixed inset-0 z-10 flex flex-col items-center justify-center gap-2">
      <h1 class="m-0 font-serif font-normal leading-none tracking-[-0.01em] text-[clamp(3rem,10vw,7rem)] text-foreground">
        Dr Deesha
      </h1>
      <div class="flex items-center gap-3 w-[clamp(20rem,55vw,48rem)]">
        <span class="flex-1 h-px bg-foreground" />
        <span class="font-display font-semibold tracking-[0.35em] uppercase text-foreground text-[clamp(0.7rem,1.2vw,0.9rem)]">Dental</span>
        <span class="flex-1 h-px bg-foreground" />
      </div>
    </div>

    <!-- Masonry grid — above the title -->
    <div class="relative z-20 columns-3 gap-4 p-4">
      <div
        v-for="(card, i) in cardDefs"
        :key="i"
        :class="['card relative mb-4 break-inside-avoid rounded-sm overflow-hidden', sizeClasses[card.size]]"
      >
        <NuxtImg :src="card.src" alt="" class="absolute inset-0 w-full h-full object-cover" />
      </div>
    </div>

    <!-- Empty space — title scrolls into view here. Observed to trigger the button. -->
    <div ref="sentinel" class="h-dvh" />
  </div>
</template>

<script setup lang="ts">
import gsap from 'gsap'

const images = [
  '/images/smile/smile-1.jpeg',
  '/images/smile/smile-2.jpeg',
  '/images/smile/smile-3.png',
  '/images/smile/smile-4.png',
  '/images/smile/smile-5.png',
]

const sizes = ['a', 'b', 'c', 'd', 'b', 'd', 'a', 'c', 'c']
const cardDefs = sizes.map((size, i) => ({ size, src: images[i % images.length] }))

const sizeClasses: Record<string, string> = {
  a: 'aspect-[16/9]',
  b: 'aspect-[4/3]',
  c: 'aspect-[3/2]',
  d: 'aspect-[2/1]',
}

const showBookNow = ref(false)
const sentinel = ref<HTMLElement | null>(null)
let tl: gsap.core.Timeline | undefined
let observer: IntersectionObserver | undefined
let lastScrollY = 0
let sentinelVisible = false

function onScroll() {
  const scrollingUp = window.scrollY < lastScrollY
  lastScrollY = window.scrollY
  showBookNow.value = sentinelVisible && !scrollingUp
}

onMounted(() => {
  const cardEls = gsap.utils.toArray<HTMLElement>('.card')

  gsap.set(cardEls, { autoAlpha: 0, y: 20, scale: 0.95 })

  const shuffled = gsap.utils.shuffle(cardEls)

  tl = gsap.timeline()

  tl.to({}, { duration: 0.9 })

  tl.to(shuffled, {
    autoAlpha: 1,
    y: 0,
    scale: 1,
    duration: 0.8,
    stagger: { each: 0.35 },
    ease: 'expo.out',
  })

  observer = new IntersectionObserver(
    ([entry]) => {
      sentinelVisible = entry?.isIntersecting ?? false
      if (!sentinelVisible) showBookNow.value = false
    },
    { threshold: 0.05 },
  )
  if (sentinel.value) observer.observe(sentinel.value)
  window.addEventListener('scroll', onScroll, { passive: true })
})

onUnmounted(() => {
  tl?.kill()
  observer?.disconnect()
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
