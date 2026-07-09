<template>
  <iframe
    :src="mapSrc"
    class="h-full w-full border-0"
    loading="lazy"
    referrerpolicy="no-referrer-when-downgrade"
    :title="`Map showing ${practice.name}, ${practice.location}`"
  />
</template>

<script setup lang="ts">
import { practice } from '../data/contact'

// No API key needed — Google's public "output=embed" search-based iframe.
const mapSrc = `https://www.google.com/maps?q=${encodeURIComponent(`${practice.name}, ${practice.location}`)}&output=embed`
</script>
