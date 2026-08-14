// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  app: {
    head: {
      // Title + meta live in app.vue (useSeoMeta); this block only carries
      // what has to be in the raw shell.
      htmlAttrs: {
        lang: 'en',
      },
      // viewport-fit=cover so env(safe-area-inset-bottom) is real on iOS —
      // the mobile nav docks against the home indicator and offsets by it.
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1, viewport-fit=cover' },
      ],
      link: [
        { rel: 'icon', type: 'image/png', href: '/favicon.png' },
      ],
    },
  },
  modules: [
    '@nuxt/eslint',
    '@nuxt/hints',
    '@nuxt/image',
    '@nuxt/ui',
  ],

  css: ['~/assets/css/main.css'],

  // Self-hosted webfonts (@nuxt/fonts ships with @nuxt/ui) — replaces the
  // render-blocking Google Fonts stylesheet the page used to carry. Only the
  // weights actually used: Fraunces 300 (font-light body copy), 400
  // (unweighted labels) and 600 (font-semibold labels); Bodoni Moda 400 is
  // the display face's single weight.
  fonts: {
    families: [
      { name: 'Fraunces', provider: 'google', weights: [300, 400, 600], styles: ['normal'] },
      { name: 'Bodoni Moda', provider: 'google', weights: [400], styles: ['normal'] },
    ],
  },

  // IPX stays the provider; format lets it serve AVIF/WebP instead of
  // passing the (often PNG) source format straight through.
  image: {
    format: ['avif', 'webp'],
    quality: 78,
  },
})
