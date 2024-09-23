// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },
  modules: ['@nuxtjs/supabase', '@nuxt/ui'],
  supabase: { redirect: false },
  colorMode: {
    preference: 'light'
  }
})