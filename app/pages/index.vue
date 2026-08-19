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
import { practice } from '../data/contact'

// Structured data for local search: Dr Deesha as the subject of the page,
// with the practice she works at carrying the address, coordinates and
// opening hours already held in app/data/contact.ts. Every value here is
// drawn from content the page itself displays — nothing invented.
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Dr Deesha',
  jobTitle: 'Associate Dentist',
  // Shown in the site footer
  identifier: {
    '@type': 'PropertyValue',
    propertyID: 'GDC registration number',
    value: '309307',
  },
  alumniOf: 'University of Leeds Dental School',
  worksFor: {
    '@type': 'Dentist',
    'name': practice.name,
    'url': practice.bookingHref,
    'address': {
      '@type': 'PostalAddress',
      streetAddress: practice.address.street,
      addressLocality: practice.address.locality,
      postalCode: practice.address.postcode,
      addressCountry: practice.address.country,
    },
    'geo': {
      '@type': 'GeoCoordinates',
      latitude: practice.coordinates.lat,
      longitude: practice.coordinates.lng,
    },
    'openingHoursSpecification': practice.hours
      .filter((h) => h.open !== null && h.close !== null)
      .map((h) => ({
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: h.day,
        opens: h.open,
        closes: h.close,
      })),
  },
}

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
  script: [
    { type: 'application/ld+json', innerHTML: JSON.stringify(jsonLd) },
  ],
  link: [
    { rel: 'canonical', href: `${siteUrl}/` },
    { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
    { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
    { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,300;9..144,600&family=Bodoni+Moda:opsz,wght@6..96,400;6..96,700&family=Quicksand:wght@700&display=swap' },
  ],
})
</script>
