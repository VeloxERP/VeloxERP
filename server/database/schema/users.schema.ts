import {mysqlTable as table, char, varchar, timestamp} from "drizzle-orm/mysql-core"
import {InferSelectModel, relations} from 'drizzle-orm'
import {timestamps} from "./columns.helpers"
import {v7} from "uuid"

import {address} from "./addresses.schema";
import {rolesSchema} from "~/server/database/schema/roles.schema";

export const users = table('users', {
    id: varchar({length: 36}).$default(() => v7()).primaryKey(),
    username: varchar({length: 32}).notNull().unique(),
    email: varchar({length: 256}).notNull().unique(),
    password: char({length: 134}).notNull(),
    address_id: varchar({length: 36}).references(() => address.id),
    firstname: varchar({length: 64}).notNull(),
    lastname: varchar({length: 64}).notNull(),
    dateOfBirth: timestamp(),
    role: varchar({length: 32}).notNull(),
    ...timestamps
});

export type UserSchemaType = InferSelectModel<typeof users>;

export const addressesRelations = relations(users, ({one}) => ({
    address: one(address, {
        fields: [users.address_id],
        references: [address.id],
    }),
}));

export const roleRelations = relations(users, ({one}) => ({
    role: one(rolesSchema, {
        fields: [users.role],
        references: [rolesSchema.name],
    }),
}));