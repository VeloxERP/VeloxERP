// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  modules: [
    '@nuxtjs/tailwindcss',
    'shadcn-nuxt',
    "nuxt-auth-utils",
    'nuxt-nodemailer'
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
  nodemailer: {
    from: '"John Doe" <john@doe.com>',
    host: 'smtp.mailtrap.io',
    port: 465,
    secure: true,
    auth: {
      user: 'john@doe.com',
      pass: '',
    },
  },
  runtimeConfig: {
    database: {
      host: 'localhost',
      port: 3306,
      user: 'veloxerp',
      password: '&lD4!8PJe8RIXE',
      name: 'veloxerp'
    },
  },
  alias:  {
    "#server": "~~/server"
  }
})