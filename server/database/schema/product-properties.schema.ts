import { mysqlTable, text, varchar, int, boolean, mysqlEnum } from 'drizzle-orm/mysql-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';
import { timestamps, uuid } from './columns.helpers';

// Product Properties Schema
export const productProperties = mysqlTable("prod_props", {
  ...uuid,
  name: varchar("name", { length: 255 }).notNull(),
  code: varchar("code", { length: 100 }).notNull().unique(),
  type: mysqlEnum("type", ["select", "color", "text", "number", "boolean"]).notNull().default("select"),
  description: text("description"),
  ...timestamps,
});

// Property Values Schema
export const propertyValues = mysqlTable("prop_values", {
  ...uuid,
  propertyId: varchar("property_id", { length: 36 }).notNull().references(() => productProperties.id, { onDelete: "cascade" }),
  value: varchar("value", { length: 255 }).notNull(),
  displayName: varchar("display_name", { length: 255 }),
  position: int("position").default(0),
  colorCode: varchar("color_code", { length: 7 }),
  ...timestamps,
});

// Export schemas for validation
export const insertProductPropertySchema = createInsertSchema(productProperties);
export const selectProductPropertySchema = createSelectSchema(productProperties);
export const insertPropertyValueSchema = createInsertSchema(propertyValues);
export const selectPropertyValueSchema = createSelectSchema(propertyValues);

// Export types
export type ProductProperty = z.infer<typeof selectProductPropertySchema>;
export type NewProductProperty = z.infer<typeof insertProductPropertySchema>;
export type PropertyValue = z.infer<typeof selectPropertyValueSchema>;
export type NewPropertyValue = z.infer<typeof insertPropertyValueSchema>; 