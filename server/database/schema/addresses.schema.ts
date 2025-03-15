import {mysqlEnum, mysqlTable as table, text, varchar} from "drizzle-orm/mysql-core"
import {timestamps, uuid} from "./columns.helpers"

export const address = table('addresses', {
    ...uuid,
    type: mysqlEnum(['company', 'person']).notNull(),
    name: varchar({length: 128}).notNull(),
    street: varchar({length: 128}).notNull(),
    city: varchar({length: 128}).notNull(),
    zip: varchar({length: 128}).notNull(),
    state: varchar({length: 128}).notNull(),
    country: varchar({length: 2}).notNull(),
    ...timestamps
});