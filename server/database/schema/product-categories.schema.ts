import { mysqlTable, text, varchar } from 'drizzle-orm/mysql-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';
import { timestamps, uuid } from './columns.helpers';

export const productCategories = mysqlTable('product_categories', {
  ...uuid,
  name: varchar('name', { length: 255 }).notNull(),
  description: text('description'),
  parentId: varchar('parent_id', { length: 36 }).references(() => productCategories.id),
  ...timestamps
});

// Create base schema and override the name validation
const baseInsertSchema = createInsertSchema(productCategories);
export const insertProductCategorySchema = baseInsertSchema.extend({
  name: z.string()
    .min(1, "Name cannot be empty")
    .trim()
    .refine((val) => val.length > 0, {
      message: "Name cannot be empty or contain only whitespace"
    })
});

export const selectProductCategorySchema = createSelectSchema(productCategories);

export type ProductCategory = z.infer<typeof selectProductCategorySchema>;
export type NewProductCategory = z.infer<typeof insertProductCategorySchema>; 