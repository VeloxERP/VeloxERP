import {drizzle} from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import * as schema from '../database/schema'
import {InferInsertModel} from "drizzle-orm";

export {sql, eq, and, or} from 'drizzle-orm'

const runtimeConfig = useRuntimeConfig()
const poolConnection = mysql.createPool({
    host: runtimeConfig.databaseHost,
    port: runtimeConfig.port,
    database: runtimeConfig.databaseDatabase,
    user: runtimeConfig.databaseUser,
    password: runtimeConfig.databasePassword
});

export const tables = schema

export function useDrizzle() {
    return drizzle(poolConnection, {schema, mode: "default"})
}