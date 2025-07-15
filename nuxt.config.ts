// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: {
    enabled: true,

    timeline: {
      enabled: true
    }
  },
  modules: [
    '@nuxtjs/tailwindcss',
    'shadcn-nuxt',
    "nuxt-auth-utils",
    'nuxt-nodemailer',
    '@nuxtjs/i18n',
    '@nuxtjs/color-mode'
  ],
  colorMode: {
    classSuffix: ''
  },
  nitro: {
    esbuild: {
      options: {
        target: 'esnext',
      }
    }
  },
  vite: {
    esbuild: {
      target: 'esnext',
    }
  },
  css: ['/assets/css/tailwind.css'],
  shadcn: {
    /**
     * Prefix for all the imported component
     */
    prefix: '',
    /**
     * Directory that the component lives in.
     * @default "./components/ui"
     */
    componentDir: './components/ui'
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
    // Private keys are only available on the server
    database: {
      host: process.env.DATABASE_HOST,
      port: process.env.DATABASE_PORT,
      name: process.env.DATABASE_NAME,
      user: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD
    },
    redis: {
      host: process.env.REDIS_HOST,
      port: process.env.REDIS_PORT
    }
  },
  // alias:  {
  //   "#server": "~~/server"
  // }
})