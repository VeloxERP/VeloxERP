import {mysqlTable, varchar} from "drizzle-orm/mysql-core";
import {InferSelectModel} from "drizzle-orm";
import {users} from "~/server/database/schema/users.schema";

export const rolesSchema = mysqlTable('roles', {
    name: varchar({length: 32}).primaryKey(),
});
export type RolesSchemaType = InferSelectModel<typeof rolesSchema>;