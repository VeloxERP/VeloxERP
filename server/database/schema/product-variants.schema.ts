import { mysqlTable, varchar, decimal, int, json, text } from 'drizzle-orm/mysql-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';
import { products } from './products.schema';
import { timestamps, uuid } from './columns.helpers';

// Define the fields that can be inherited from the parent product
export const INHERITABLE_FIELDS = [
  'name',
  'price',
  'cost'
] as const;

export type InheritableField = typeof INHERITABLE_FIELDS[number];

export const productVariants = mysqlTable('prod_vars', {
  ...uuid,
  productId: varchar('product_id', { length: 36 }).references(() => products.id).notNull(),
  name: varchar('name', { length: 255 }),
  description: text('description'),
  productNumber: varchar('product_number', { length: 50 }).notNull().unique(),
  price: decimal('price', { precision: 10, scale: 2 }),
  cost: decimal('cost', { precision: 10, scale: 2 }),
  quantity: int('quantity').default(0).notNull(), // Quantity typically isn't inherited
  attributes: json('attributes').$type<Record<string, string>>().default({}),
  inheritedFields: json('inherited_fields').$type<InheritableField[]>().default([...INHERITABLE_FIELDS]),
  ...timestamps,
});

export const productNumberSequence = mysqlTable('prod_num_seq', {
  ...uuid,
  prefix: varchar('prefix', { length: 10 }).notNull(),
  lastNumber: int('last_number').default(0).notNull(),
  ...timestamps,
});

export const insertProductVariantSchema = createInsertSchema(productVariants);
export const selectProductVariantSchema = createSelectSchema(productVariants);
export const insertProductNumberSequenceSchema = createInsertSchema(productNumberSequence);
export const selectProductNumberSequenceSchema = createSelectSchema(productNumberSequence);

export type ProductVariant = z.infer<typeof selectProductVariantSchema>;
export type NewProductVariant = z.infer<typeof insertProductVariantSchema>;
export type ProductNumberSequence = z.infer<typeof selectProductNumberSequenceSchema>;
export type NewProductNumberSequence = z.infer<typeof insertProductNumberSequenceSchema>; 