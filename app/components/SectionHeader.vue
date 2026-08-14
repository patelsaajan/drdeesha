<template>
  <!-- The eyebrow + heading block every section opens with, written once.
       An optional default slot carries a lede paragraph (each caller styles
       its own measure). Both lines are .reveal so they ride the section's
       shared entrance. -->
  <header class="max-w-2xl">
    <p class="reveal font-body text-xs font-semibold uppercase tracking-eyebrow text-primary">
      {{ eyebrow }}
    </p>
    <h2 class="reveal mt-5 font-display font-normal text-section-heading tracking-heading">
      {{ title }}
    </h2>
    <slot />
  </header>
</template>

<script setup lang="ts">
defineProps<{
  eyebrow: string
  title: string
}>()
</script>
