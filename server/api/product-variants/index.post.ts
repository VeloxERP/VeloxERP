import { productVariants, insertProductVariantSchema, type NewProductVariant } from '../../database/schema';
import { eq } from 'drizzle-orm';
import { useDrizzle } from '../../utils/drizzle';
import { defineWrappedResponseHandler } from '../../utils/handler';
import ResponseBody from '../../models/util/ResponseBody';

export default defineWrappedResponseHandler(async (event) => {
  const db = useDrizzle();
  const body = await readBody(event);
  
  // Validate request body
  const validatedData = insertProductVariantSchema.parse(body);
  
  // Check if variant with same SKU already exists
  const existingVariant = await db.select()
    .from(productVariants)
    .where(eq(productVariants.sku, validatedData.sku))
    .limit(1);
    
  if (existingVariant.length > 0) {
    return new ResponseBody(409, 'Variant with this SKU already exists');
  }
  
  // Validate price and cost
  if (validatedData.cost && validatedData.cost > validatedData.price) {
    return new ResponseBody(400, 'Cost cannot be greater than price');
  }
  
  // Validate quantity
  const quantity = validatedData.quantity ?? 0;
  if (quantity < 0) {
    return new ResponseBody(400, 'Quantity cannot be negative');
  }
  
  // Insert new variant
  await db.insert(productVariants)
    .values(validatedData);
  
  // Fetch and return the created variant
  const [variant] = await db.select()
    .from(productVariants)
    .where(eq(productVariants.sku, validatedData.sku));
    
  if (!variant) {
    return new ResponseBody(500, 'Failed to create variant');
  }
  
  return new ResponseBody(201, undefined, variant);
}, {
  validateBody: (body) => {
    try {
      insertProductVariantSchema.parse(body);
      return true;
    } catch {
      return false;
    }
  },
  logRequest: true,
  logResponse: true,
  logError: true,
  rateLimit: {
    max: 10,        // 10 requests
    windowMs: 60000 // per minute
  }
}); 