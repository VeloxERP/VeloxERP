// https://nuxt.com/docs/api/configuration/nuxt-config
import { defineNuxtConfig } from 'nuxt/config';
import tailwindcss from '@tailwindcss/vite';

export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: {
    enabled: true,

    timeline: {
      enabled: true
    }
  },
  modules: [
    'nuxt-nodemailer',
    '@nuxtjs/i18n',
    'shadcn-nuxt'
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
  css: ['~/assets/css/tailwind.css'],
  vite: {
    esbuild: {
      target: 'esnext',
    },
    plugins: [tailwindcss()]
  },
  shadcn: {
    /**
     * Prefix for all the imported component
     */
    prefix: '',
    /**
     * Directory that the component lives in.
     * @default "./components/ui"
     */
    componentDir: './app/components/ui'
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