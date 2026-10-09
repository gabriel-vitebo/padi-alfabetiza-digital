// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  app: { head: { htmlAttrs: { lang: 'pt-BR' }, title: 'Alfabetiza Digital · PADI' } },
  routeRules: { '/api/**': { headers: { 'cache-control': 'no-store' } }, '/resultado/**': { headers: { 'referrer-policy': 'no-referrer', 'x-robots-tag': 'noindex, nofollow' } } },
  modules: ['@nuxt/ui'],
  css: ['~/assets/css/main.css']
})