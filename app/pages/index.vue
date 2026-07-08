<template>
  <div class="min-h-dvh bg-background">
    <HomeHero />
    <AboutSection />
    <ProcessVideo />
    <CaseStudies />
    <CareerTimeline />
    <TestimonialsSection />
    <ContactSection />
    <SiteFooter />
  </div>
</template>

<script setup lang="ts">
useHead({
  title: 'Dr Deesha Dental',
  link: [
    { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
    { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
    { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,300;9..144,600&family=Bodoni+Moda:opsz,wght@6..96,400;6..96,700&display=swap' },
  ],
})
</script>
