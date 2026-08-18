<template>
  <div class="min-h-dvh bg-background">
    <SiteNav />
    <HomeHero />
    <MeetSection />
    <AboutSection />
    <ProcessVideo />
    <CaseStudies />
    <CareerTimeline />
    <TestimonialsSection />
    <SiteFooter />
  </div>
</template>

<script setup lang="ts">
import { site, siteUrl } from '../data/site'

useSeoMeta({
  title: site.title,
  description: site.description,
  ogTitle: site.title,
  ogDescription: site.description,
  ogType: 'website',
  ogUrl: `${siteUrl}/`,
  ogSiteName: site.name,
  ogImage: site.ogImage,
  twitterCard: 'summary_large_image',
  twitterTitle: site.title,
  twitterDescription: site.description,
  twitterImage: site.ogImage,
})

useHead({
  link: [
    { rel: 'canonical', href: `${siteUrl}/` },
    { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
    { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
    { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,300;9..144,600&family=Bodoni+Moda:opsz,wght@6..96,400;6..96,700&family=Quicksand:wght@700&display=swap' },
  ],
})
</script>
