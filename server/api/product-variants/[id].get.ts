import { productVariants } from '../../database/schema';
import { eq } from 'drizzle-orm';
import { useDrizzle } from '../../utils/drizzle';
import { defineWrappedResponseHandler } from '../../utils/handler';
import ResponseBody from '../../models/util/ResponseBody';
import { applyInheritance } from '../../utils/product-inheritance';
import { InheritableField } from '../../database/schema/product-variants.schema';

interface InheritanceInfo {
  isInherited: boolean;
  parentValue: any;
  localValue: any;
}

export default defineWrappedResponseHandler(async (event) => {
  const db = useDrizzle();
  const variantId = event.context.params?.id;
  
  if (!variantId) {
    return new ResponseBody(400, 'Variant ID is required');
  }
  
  // Get variant
  const variant = await db.select()
    .from(productVariants)
    .where(eq(productVariants.id, variantId))
    .limit(1)
    .then(rows => rows[0]);
    
  if (!variant) {
    return new ResponseBody(404, 'Variant not found');
  }
  
  // Apply inheritance
  const variantWithInheritance = await applyInheritance(variant);
  
  // Add flag for each field to indicate if it's inherited
  const result = {
    ...variantWithInheritance,
    inheritanceInfo: {} as Record<InheritableField, InheritanceInfo>
  };
  
  // Check each inheritable field
  const inheritedFields = variant.inheritedFields as InheritableField[] || [];
  
  for (const field of inheritedFields) {
    // If variant's field is null/undefined and parent field exists, it's inherited
    const isInherited = !!(
      (variant[field] === null || variant[field] === undefined) && 
      variantWithInheritance.parent && 
      variantWithInheritance.parent[field] !== undefined
    );
    
    // Type-safe way to add to the inheritance info
    result.inheritanceInfo[field] = {
      isInherited,
      parentValue: variantWithInheritance.parent ? variantWithInheritance.parent[field] : null,
      localValue: variant[field]
    };
  }
  
  return new ResponseBody(200, undefined, result);
}, {
  logRequest: true,
  logResponse: true
}); 