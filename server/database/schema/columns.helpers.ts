import {timestamp, varchar} from "drizzle-orm/mysql-core";
import {v4} from "uuid";

export const timestamps = {
    updated_at: timestamp().onUpdateNow(),
    created_at: timestamp().defaultNow().notNull(),
    deleted_at: timestamp(),
}

export const uuid = {
    id: varchar({length: 36}).$default(() => v4()).primaryKey(),
}