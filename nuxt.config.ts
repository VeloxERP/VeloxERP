// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  modules: [
    '@nuxtjs/tailwindcss',
    'shadcn-nuxt',
    "nuxt-auth-utils"
  ],
  css: ['/assets/css/tailwind.css'],
  shadcn: {
    /**
     * Prefix for all the imported component
     */
    prefix: '',
    /**
     * Directory that the component lives in.
     * @default "./components"
     */
    componentDir: './components'
  },
  runtimeConfig: {
    databaseHost: "localhost",
    databasePort: 3306,
    databaseUser: "velox_erp",
    databasePassword: "&lD4!8PJe8RIXE",
    databaseDatabase: "velox_erp"
  },
  alias:  {
    "#server": "<rootDir>/server"
  }
})