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
        // favicon.ico is a real ICO container (16px + 32px members), so
        // the declared type must match — image/png here made compliant
        // browsers free to skip the icon.
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
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

  // Deploy target is Cloudflare Workers. The preset fixes the .output layout
  // that wrangler.jsonc points at (server/index.mjs + public/), so the two
  // files have to agree.
  nitro: {
    preset: 'cloudflare_module',
  },

  // One static page, no per-request data: bake the HTML at build time so a
  // server deploy answers from the prerender cache instead of running SSR on
  // every request (and a static host just serves the file).
  routeRules: {
    '/': { prerender: true },
  },

  // Retina candidates. Without this the hero row's srcset topped out at the
  // 1x width and 2x screens upscaled it, which read as a soft, low-quality
  // image next to the crisp source file.
  image: {
    densities: [1, 2],
    quality: 82,
  },
})