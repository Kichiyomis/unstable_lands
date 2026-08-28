export default defineNuxtConfig({
  ssr: false,
  devtools: { enabled: true },
  compatibilityDate: '2025-03-04',
  css: ['~/assets/css/main.css'],
  nitro: {
    preset: 'github-pages'
  },
  experimental: {
    viewTransition: true,
  },
  app: {
    // Для GitHub Pages: должен совпадать с именем репозитория (например unstable_lands).
    // В CI подставляется через NUXT_APP_BASE_URL из workflow.
    baseURL: process.env.NUXT_APP_BASE_URL || '/unstable_lands/',
    pageTransition: { name: 'page', mode: 'out-in' },
    head: {
      title: 'Нестабильные Земли — ALLMIND Memory Index',
      htmlAttrs: {
        lang: 'ru',
      },
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1, viewport-fit=cover' },
        { name: 'description', content: 'Вики по D&D кампании «Нестабильные Земли» — мир, персонажи, фракции, история.' },
        { name: 'theme-color', content: '#05060A' },
      ],
      link: [
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:ital,wght@0,400;0,500;1,400&family=IBM+Plex+Sans:ital,wght@0,400;0,500;0,600;1,400&family=JetBrains+Mono:wght@400;500&family=Unbounded:wght@500;600;700&display=swap' },
      ],
    },
  },
})
