// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  app: {  
    head: {
      title: 'Dr Deesha Dental',
      htmlAttrs: {
        lang: 'en'
      },
      // viewport-fit=cover so env(safe-area-inset-bottom) is real on iOS —
      // the mobile nav docks against the home indicator and offsets by it.
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1, viewport-fit=cover' }
      ],
      link: [
        { rel: 'icon', type: 'image/png', href: '/favicon.ico' }
      ]
    },
},
  modules: [
    '@nuxt/eslint',
    '@nuxt/hints',
    '@nuxt/image',
    '@nuxt/ui'
  ],

  css: ['~/assets/css/main.css'],

  // Retina candidates. Without this the hero row's srcset topped out at the
  // 1x width and 2x screens upscaled it, which read as a soft, low-quality
  // image next to the crisp source file.
  image: {
    densities: [1, 2],
    quality: 82,
  },
})