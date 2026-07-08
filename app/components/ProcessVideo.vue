<template>
  <section class="relative z-20 bg-foreground">
    <div class="relative h-dvh w-full overflow-hidden">

      <!-- Real clip: flip `hasVideo` to true once public/videos/process.mp4 exists. -->
      <video
        v-if="hasVideo"
        ref="video"
        class="h-full w-full object-cover"
        :autoplay="!reduce"
        muted
        loop
        playsinline
        preload="metadata"
        :controls="reduce"
        poster="/images/process-poster.svg"
      >
        <source :src="videoSrc" type="video/mp4">
      </video>

      <!-- Placeholder: animated brand wash while there's no footage yet. -->
      <div v-else class="video-placeholder absolute inset-0 bg-[#e7ebf1]">
        <div class="drift absolute -inset-[15%]" />
        <div class="absolute inset-0 grid place-items-center">
          <div class="flex flex-col items-center gap-4 text-center">
            <svg width="72" height="72" viewBox="0 0 72 72" fill="none" aria-hidden="true">
              <circle cx="36" cy="36" r="35" stroke="#aeb9c6" stroke-width="1.5" />
              <path d="M30 26 L48 36 L30 46 Z" fill="#aeb9c6" />
            </svg>
            <span class="font-display text-[0.7rem] font-semibold uppercase tracking-[0.3em] text-foreground/40">
              Footage to follow
            </span>
          </div>
        </div>
      </div>

      <!-- Caption over a legibility scrim -->
      <div class="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/55 via-black/15 to-transparent p-6 sm:p-10 lg:p-14">
        <p class="font-display text-[0.72rem] font-semibold uppercase tracking-[0.35em] text-white/80">
          In the chair
        </p>
        <p class="mt-2 max-w-md font-serif text-[clamp(1.5rem,3vw,2.5rem)] font-normal leading-tight tracking-[-0.01em] text-white">
          A tooth, rebuilt.
        </p>
      </div>

      <!-- Scroll cue -->
      <div class="pointer-events-none absolute inset-x-0 bottom-6 flex justify-center">
        <svg class="scroll-cue text-white/70" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true">
          <path d="M6 9l6 6 6-6" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
// Set to true once the real clip lives at public/videos/process.mp4.
const hasVideo = false
// Dynamic binding (not a static `src`) so Vite doesn't try to resolve it as an
// import before the file exists.
const videoSrc = '/videos/process.mp4'

const video = ref<HTMLVideoElement | null>(null)
const reduce = ref(false)

onMounted(() => {
  reduce.value = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const el = video.value
  if (!el) return

  // Vue can be unreliable setting `muted` as an attribute; enforce it for autoplay.
  el.muted = true
  if (reduce.value) el.pause()
})
</script>

<style scoped>
.video-placeholder .drift {
  background:
    radial-gradient(55% 55% at 22% 28%, #f2f5f9, transparent 70%),
    radial-gradient(45% 45% at 82% 72%, #d3dbe6, transparent 70%),
    linear-gradient(125deg, #e9edf2 0%, #dde5ee 100%);
  will-change: transform;
  animation: drift 18s ease-in-out infinite;
}

@keyframes drift {
  0% {
    transform: translate3d(-3%, -2%, 0) scale(1.1);
  }
  50% {
    transform: translate3d(3%, 2%, 0) scale(1.16);
  }
  100% {
    transform: translate3d(-3%, -2%, 0) scale(1.1);
  }
}

.scroll-cue {
  animation: scroll-hint 2s ease-in-out infinite;
}

@keyframes scroll-hint {
  0%,
  100% {
    transform: translateY(0);
    opacity: 0.5;
  }
  50% {
    transform: translateY(6px);
    opacity: 1;
  }
}

@media (prefers-reduced-motion: reduce) {
  .video-placeholder .drift,
  .scroll-cue {
    animation: none;
  }
}
</style>
