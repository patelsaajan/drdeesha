<template>
  <UApp>
    <NuxtPage />
  </UApp>
</template>

<script setup lang="ts">
import { practice } from './data/contact'

const DESCRIPTION
  = 'Dr Deesha Chudasama is a general and cosmetic dentist at Smart Smiles, '
    + 'Ystrad Mynach, South Wales — calm, unhurried dentistry, from routine '
    + 'check-ups to composite bonding, whitening and smile makeovers.'

useHead({
  script: [
    {
      // Marks JS as running before first paint. The stylesheet's anti-FOUC
      // rules (.js .reveal etc.) key off this class, so a visitor whose JS
      // fails or is disabled sees the full page rather than opacity-0 holes.
      innerHTML: 'document.documentElement.classList.add("js")',
      tagPriority: 'critical',
    },
    {
      // Local-business rich result: everything here is real practice data
      // from app/data/contact.ts — nothing invented.
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'Dentist',
        'name': 'Dr Deesha Dental',
        'description': DESCRIPTION,
        'url': '/',
        'address': {
          '@type': 'PostalAddress',
          'streetAddress': '19 Bedwlwyn Rd',
          'addressLocality': practice.location,
          'addressRegion': 'Wales',
          'postalCode': 'CF82 7AA',
          'addressCountry': 'GB',
        },
        'geo': {
          '@type': 'GeoCoordinates',
          'latitude': practice.coordinates.lat,
          'longitude': practice.coordinates.lng,
        },
        'openingHoursSpecification': practice.hours
          .filter(h => h.open && h.close)
          .map(h => ({
            '@type': 'OpeningHoursSpecification',
            'dayOfWeek': h.day,
            'opens': h.open,
            'closes': h.close,
          })),
        'identifier': { '@type': 'PropertyValue', 'name': 'GDC number', 'value': practice.gdcNumber },
      }),
    },
  ],
})

useSeoMeta({
  title: 'Dr Deesha Dental — dentist in Ystrad Mynach, South Wales',
  description: DESCRIPTION,
  ogTitle: 'Dr Deesha Dental',
  ogDescription: DESCRIPTION,
  ogType: 'website',
  // 1200x630 crop of the hero photography, generated into public/.
  ogImage: '/og-image.jpg',
  twitterCard: 'summary_large_image',
  twitterTitle: 'Dr Deesha Dental',
  twitterDescription: DESCRIPTION,
  twitterImage: '/og-image.jpg',
})
</script>
