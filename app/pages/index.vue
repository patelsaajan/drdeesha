<template>
  <div class="min-h-dvh bg-background">
    <SiteNav />
    <main>
      <HomeHero />
      <MeetSection />
      <AboutSection />
      <ProcessVideo />
      <CaseStudies />
      <CareerTimeline />
      <TestimonialsSection />
    </main>
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
  // No Google Fonts link here. @nuxt/fonts (bundled with @nuxt/ui) already
  // resolves Fraunces and Bodoni Moda from the font-family declarations in
  // main.css and self-hosts them under /_fonts, with metric-compatible
  // fallbacks generated alongside. The <link rel=stylesheet> was fetching
  // both families a second time from a third-party origin, and because a
  // stylesheet blocks rendering the browser had to open a connection to
  // fonts.googleapis.com, parse the CSS, then go to fonts.gstatic.com for
  // the files before it could paint anything at all.
  link: [
    { rel: 'canonical', href: `${siteUrl}/` },
  ],
})
</script>
