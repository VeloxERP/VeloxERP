import { productVariants } from '../../database/schema';
import { eq } from 'drizzle-orm';
import { useDrizzle } from '../../utils/drizzle';
import { defineWrappedResponseHandler } from '../../utils/handler';
import ResponseBody from '../../models/util/ResponseBody';
import { InheritableField, INHERITABLE_FIELDS } from '../../database/schema/product-variants.schema';
import { applyInheritance, makeFieldInherited, makeFieldLocal } from '../../utils/product-inheritance';

interface InheritanceUpdateRequest {
  variantId: string;
  field: InheritableField;
  inherit: boolean;
  value?: any; // Used when setting field to local (not inherited)
}

export default defineWrappedResponseHandler(async (event) => {
  const db = useDrizzle();
  const body = await readBody(event) as InheritanceUpdateRequest;
  
  // Validate variant exists
  const variant = await db.select()
    .from(productVariants)
    .where(eq(productVariants.id, body.variantId))
    .limit(1)
    .then(rows => rows[0]);
    
  if (!variant) {
    return new ResponseBody(404, 'Variant not found');
  }
  
  // Validate field is inheritable
  if (!INHERITABLE_FIELDS.includes(body.field)) {
    return new ResponseBody(400, `Field '${body.field}' cannot be inherited`);
  }
  
  // Update inheritance settings
  if (body.inherit) {
    // Make field inherit from parent
    await makeFieldInherited(body.variantId, body.field);
  } else {
    // Make field local to variant (stop inheriting)
    await makeFieldLocal(body.variantId, body.field);
    
    // If value provided, update the field with local value
    if (body.value !== undefined) {
      await db.update(productVariants)
        .set({ [body.field]: body.value })
        .where(eq(productVariants.id, body.variantId));
    }
  }
  
  // Retrieve updated variant with inheritance applied
  const updatedVariant = await db.select()
    .from(productVariants)
    .where(eq(productVariants.id, body.variantId))
    .limit(1)
    .then(rows => rows[0]);
  
  if (!updatedVariant) {
    return new ResponseBody(500, 'Failed to retrieve updated variant');
  }
  
  // Apply inheritance to get the final result
  const variantWithInheritance = await applyInheritance(updatedVariant);
  
  return new ResponseBody(200, undefined, variantWithInheritance);
}, {
  validateBody: (body) => {
    return body &&
           typeof body.variantId === 'string' &&
           typeof body.field === 'string' &&
           typeof body.inherit === 'boolean';
  },
  logRequest: true,
  logResponse: true,
  logError: true,
  rateLimit: {
    max: 30,
    windowMs: 60000
  }
}); 