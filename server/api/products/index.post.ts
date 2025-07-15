import { products, insertProductSchema, type NewProduct } from '../../database/schema';
import { eq } from 'drizzle-orm';
import { useDrizzle } from '../../utils/drizzle';
import { defineWrappedResponseHandler } from '../../utils/handler';
import ResponseBody from '../../models/util/ResponseBody';

export default defineWrappedResponseHandler(async (event) => {
  const db = useDrizzle();
  const body = await readBody(event);
  
  // Validate request body
  const validatedData = insertProductSchema.parse(body);
  
  // Check if product with same SKU already exists
  const existingProduct = await db.select()
    .from(products)
    .where(eq(products.sku, validatedData.sku))
    .limit(1);
    
  if (existingProduct.length > 0) {
    return new ResponseBody(409, 'Product with this SKU already exists');
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
  
  if (validatedData.maxQuantity && quantity > validatedData.maxQuantity) {
    return new ResponseBody(400, 'Quantity cannot exceed maximum quantity');
  }
  
  // Insert new product
  await db.insert(products)
    .values(validatedData);
  
  // Fetch and return the created product
  const [product] = await db.select()
    .from(products)
    .where(eq(products.sku, validatedData.sku));
    
  if (!product) {
    return new ResponseBody(500, 'Failed to create product');
  }
  
  return new ResponseBody(201, undefined, product);
}, {
  validateBody: (body) => {
    try {
      insertProductSchema.parse(body);
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