import { defineConfig } from 'drizzle-kit'

export default defineConfig({
    dialect: 'mysql',
    schema: './server/database/schema',
    out: './server/database/migrations',
    dbCredentials: {
        host: process.env.DATABSE_HOST!,
        port: 3306,
        user: process.env.DATABASE_USER!,
        password: process.env.DATABASE_PASSWORD!,
        database: process.env.DATABASE_NAME!
    },
})
