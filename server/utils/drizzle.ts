import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import * as schema from '../database/schema'
import {InferInsertModel} from "drizzle-orm";

export {sql, eq, and, or} from 'drizzle-orm'

const runtimeConfig = useRuntimeConfig()
const poolConnection = mysql.createPool({
    host: runtimeConfig.database.host,
    port: runtimeConfig.database.port,
    database: runtimeConfig.database.name,
    user: runtimeConfig.database.user,
    password: String(runtimeConfig.database.password),
});
const database = drizzle(poolConnection, {schema, mode: "default"});


export const tables = schema
export function useDrizzle() {
    return database;
}