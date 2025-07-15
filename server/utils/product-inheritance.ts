import { eq } from 'drizzle-orm';
import { useDrizzle } from './drizzle';
import { products } from '../database/schema/products.schema';
import { productVariants, InheritableField, INHERITABLE_FIELDS } from '../database/schema/product-variants.schema';
import type { Product } from '../database/schema/products.schema';
import type { ProductVariant } from '../database/schema/product-variants.schema';

/**
 * Applies inheritance to a variant, filling in values from the parent product
 * where the values are inherited (null in the variant)
 */
export async function applyInheritance(variant: ProductVariant): Promise<ProductVariant & { parent?: Product }> {
  const db = useDrizzle();
  
  // If no product ID, return variant as is
  if (!variant.productId) {
    return { ...variant };
  }
  
  // Get the parent product
  const parent = await db.select()
    .from(products)
    .where(eq(products.id, variant.productId))
    .limit(1)
    .then(rows => rows[0]);
    
  if (!parent) {
    return { ...variant };
  }
  
  // Create a new object with the variant's properties
  const result = { ...variant, parent };
  
  // Apply inheritance for each field
  const inheritedFields = variant.inheritedFields as InheritableField[] || [];
  
  for (const field of inheritedFields) {
    // If variant's value is null or undefined, use parent's value
    if (variant[field] === null || variant[field] === undefined) {
      if (field === 'name' && parent.name) {
        result.name = parent.name;
      } else if (field === 'price' && parent.price) {
        result.price = parent.price;
      } else if (field === 'cost' && parent.cost) {
        result.cost = parent.cost;
      }
    }
  }
  
  return result;
}

/**
 * Apply inheritance to a list of variants
 */
export async function applyInheritanceToMany(variants: ProductVariant[]): Promise<(ProductVariant & { parent?: Product })[]> {
  // Group variants by parent product to minimize DB queries
  const variantsByProduct: Record<string, ProductVariant[]> = {};
  
  variants.forEach(variant => {
    if (!variant.productId) return;
    
    if (!variantsByProduct[variant.productId]) {
      variantsByProduct[variant.productId] = [];
    }
    
    variantsByProduct[variant.productId].push(variant);
  });
  
  const db = useDrizzle();
  const result: (ProductVariant & { parent?: Product })[] = [];
  
  // Process each group
  for (const [productId, productVariants] of Object.entries(variantsByProduct)) {
    // Get the parent product
    const parent = await db.select()
      .from(products)
      .where(eq(products.id, productId))
      .limit(1)
      .then(rows => rows[0]);
      
    if (!parent) {
      result.push(...productVariants.map(v => ({ ...v })));
      continue;
    }
    
    // Apply inheritance to each variant
    for (const variant of productVariants) {
      const inheritedVariant = { ...variant, parent };
      const inheritedFields = variant.inheritedFields as InheritableField[] || [];
      
      for (const field of inheritedFields) {
        // If variant's value is null or undefined, use parent's value
        if (variant[field] === null || variant[field] === undefined) {
          if (field === 'name' && parent.name) {
            inheritedVariant.name = parent.name;
          } else if (field === 'price' && parent.price) {
            inheritedVariant.price = parent.price;
          } else if (field === 'cost' && parent.cost) {
            inheritedVariant.cost = parent.cost;
          }
        }
      }
      
      result.push(inheritedVariant);
    }
  }
  
  return result;
}

/**
 * Check if a variant field is inherited from parent
 */
export function isFieldInherited(variant: ProductVariant, field: string): boolean {
  if (!variant.inheritedFields) return false;
  const inheritedFields = variant.inheritedFields as InheritableField[];
  return inheritedFields.includes(field as InheritableField);
}

/**
 * Makes a field local to the variant (stops inheriting from parent)
 */
export async function makeFieldLocal(variantId: string, field: InheritableField): Promise<void> {
  const db = useDrizzle();
  
  // Get current variant
  const variant = await db.select()
    .from(productVariants)
    .where(eq(productVariants.id, variantId))
    .limit(1)
    .then(rows => rows[0]);
    
  if (!variant) return;
  
  // Get current inheritance settings
  const inheritedFields = variant.inheritedFields as InheritableField[] || [];
  
  // Remove the field from inherited fields
  const updatedInheritedFields = inheritedFields.filter(f => f !== field);
  
  // Update the variant
  await db.update(productVariants)
    .set({ 
      inheritedFields: updatedInheritedFields 
    })
    .where(eq(productVariants.id, variantId));
}

/**
 * Makes a field inherit from parent again
 */
export async function makeFieldInherited(variantId: string, field: InheritableField): Promise<void> {
  const db = useDrizzle();
  
  // Get current variant
  const variant = await db.select()
    .from(productVariants)
    .where(eq(productVariants.id, variantId))
    .limit(1)
    .then(rows => rows[0]);
    
  if (!variant) return;
  
  // Get current inheritance settings
  const inheritedFields = variant.inheritedFields as InheritableField[] || [];
  
  // Add the field to inherited fields if not already there
  if (!inheritedFields.includes(field)) {
    const updatedInheritedFields = [...inheritedFields, field];
    
    // Update the variant with the field set to null (to use parent's value)
    await db.update(productVariants)
      .set({ 
        inheritedFields: updatedInheritedFields,
        [field]: null 
      })
      .where(eq(productVariants.id, variantId));
  }
}

/**
 * Gets all variant fields that can potentially be inherited
 */
export function getInheritableFields(): InheritableField[] {
  return [...INHERITABLE_FIELDS];
} 