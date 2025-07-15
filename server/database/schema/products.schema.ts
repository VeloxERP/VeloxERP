import { mysqlTable, text, varchar, decimal, int, boolean } from 'drizzle-orm/mysql-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';
import { productCategories } from './product-categories.schema';
import { timestamps, uuid } from './columns.helpers';

export const products = mysqlTable('products', {
  ...uuid,
  name: varchar('name', { length: 255 }).notNull(),
  description: text('description'),
  sku: varchar('sku', { length: 50 }).notNull().unique(),
  categoryId: varchar('category_id', { length: 36 }).references(() => productCategories.id),
  price: decimal('price', { precision: 10, scale: 2 }).notNull(),
  cost: decimal('cost', { precision: 10, scale: 2 }),
  quantity: int('quantity').default(0).notNull(),
  minQuantity: int('min_quantity').default(0).notNull(),
  maxQuantity: int('max_quantity'),
  isActive: boolean('is_active').default(true).notNull(),
  ...timestamps
});

export const insertProductSchema = createInsertSchema(products);
export const selectProductSchema = createSelectSchema(products);

export type Product = z.infer<typeof selectProductSchema>;
export type NewProduct = z.infer<typeof insertProductSchema>; 