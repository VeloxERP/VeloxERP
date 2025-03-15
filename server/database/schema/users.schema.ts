import {mysqlTable as table, text, varchar, timestamp} from "drizzle-orm/mysql-core"
import {InferSelectModel, relations} from 'drizzle-orm'
import {timestamps} from "./columns.helpers"
import {v4} from "uuid"

import {address} from "./addresses.schema";

export const users = table('users', {
    id: varchar({length: 36}).$default(() => v4()).primaryKey(),
    username: varchar({length: 32}).notNull().unique(),
    email: varchar({length: 256}).notNull().unique(),
    password: text().notNull(),
    address_id: varchar({length: 36}).references(() => address.id),
    firstname: varchar({length: 64}).notNull(),
    lastname: varchar({length: 64}).notNull(),
    dateOfBirth: timestamp(),
    ...timestamps
});

export type User = InferSelectModel<typeof users>;

export const addressesRelations = relations(users, ({one}) => ({
    address: one(address, {
        fields: [users.address_id],
        references: [address.id],
    }),
}));