import { mysqlTable, varchar, boolean } from 'drizzle-orm/mysql-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';
import { products } from './products.schema';
import { productProperties, propertyValues } from './product-properties.schema';
import { timestamps, uuid } from './columns.helpers';

// Product-Property Associations
export const productPropertyAssociations = mysqlTable("prod_prop_assoc", {
  ...uuid,
  productId: varchar("product_id", { length: 36 }).notNull().references(() => products.id, { onDelete: "cascade" }),
  propertyId: varchar("property_id", { length: 36 }).notNull().references(() => productProperties.id, { onDelete: "cascade" }),
  ...timestamps,
});

// Product Variant-Property Value Associations
export const variantPropertyValues = mysqlTable("var_prop_vals", {
  ...uuid,
  variantId: varchar("variant_id", { length: 36 }).notNull(),
  propertyId: varchar("property_id", { length: 36 }).notNull().references(() => productProperties.id, { onDelete: "cascade" }),
  valueId: varchar("value_id", { length: 36 }).notNull().references(() => propertyValues.id, { onDelete: "cascade" }),
  isLinked: boolean("is_linked").default(true),
  customValue: varchar("custom_value", { length: 255 }),
  ...timestamps,
});

// Export schemas for validation
export const insertProductPropertyAssociationSchema = createInsertSchema(productPropertyAssociations);
export const selectProductPropertyAssociationSchema = createSelectSchema(productPropertyAssociations);
export const insertVariantPropertyValueSchema = createInsertSchema(variantPropertyValues);
export const selectVariantPropertyValueSchema = createSelectSchema(variantPropertyValues);

// Export types
export type ProductPropertyAssociation = z.infer<typeof selectProductPropertyAssociationSchema>;
export type NewProductPropertyAssociation = z.infer<typeof insertProductPropertyAssociationSchema>;
export type VariantPropertyValue = z.infer<typeof selectVariantPropertyValueSchema>;
export type NewVariantPropertyValue = z.infer<typeof insertVariantPropertyValueSchema>; 