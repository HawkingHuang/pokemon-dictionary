// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  modules: ['@nuxt/ui'],
  plugins: ['~/plugins/jquery.client.ts'],
  app: {
    head: {
      title: 'Pokémon Dictionary',
      meta: [
        { name: 'description', content: 'An Experimental Pokémon Elementary Guide' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' }
      ],
      link: [
        { rel: 'icon', type: 'image/png', href: '/favicon-24.png' },
        { rel: 'apple-touch-icon', sizes: '512x512', href: '/apple-touch-icon.png' }
      ]
    }
  }
})