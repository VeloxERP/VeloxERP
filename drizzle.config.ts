import { defineConfig } from 'drizzle-kit'

export default defineConfig({
    dialect: 'mysql',
    schema: './server/database/schema',
    out: './server/database/migrations',
    dbCredentials: {
        host: process.env.NUXT_DATABSE_HOST!,
        port: 3306,
        user: process.env.NUXT_DATABASE_USER!,
        password: process.env.NUXT_DATABASE_PASSWORD!,
        database: process.env.NUXT_DATABASE_NAME!
    },
})
