import { drizzle } from "drizzle-orm/mysql2";
export { sql, eq, and, or } from 'drizzle-orm'

import * as schema from '../database/schema'

export const tables = schema

export function useDrizzle() {
    //TODO get database string from nuxt conf
    return drizzle({ connection: { uri: process.env.DATABASE_URL }})
}

export type User = typeof schema.users.$inferSelect
