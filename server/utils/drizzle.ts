import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import * as schema from '../database/schema'
import {InferInsertModel} from "drizzle-orm";

export {sql, eq, and, or} from 'drizzle-orm'

const poolConnection = mysql.createPool({
    host: process.env.DATABASE_HOST,
    port: process.env.DATABASE_PORT,
    database: process.env.DATABASE_NAME,
    user: process.env.DATABASE_USER,
    password: String(process.env.DATABASE_PASSWORD),
});
const database = drizzle(poolConnection, {schema, mode: "default"});


export const tables = schema
export function useDrizzle() {
    return database;
}