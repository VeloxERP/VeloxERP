import { productVariants } from '../../database/schema';
import { products } from '../../database/schema/products.schema';
import { eq } from 'drizzle-orm';
import { useDrizzle } from '../../utils/drizzle';
import { defineWrappedResponseHandler } from '../../utils/handler';
import ResponseBody from '../../models/util/ResponseBody';
import { applyInheritanceToMany } from '../../utils/product-inheritance';

interface UpdateProductWithVariantsRequest {
  productId: string;
  name?: string;
  price?: number;
  cost?: number;
  quantity?: number;
}

export default defineWrappedResponseHandler(async (event) => {
  const db = useDrizzle();
  const body = await readBody(event) as UpdateProductWithVariantsRequest;
  
  // Validate product exists
  const product = await db.select()
    .from(products)
    .where(eq(products.id, body.productId))
    .limit(1);
    
  if (product.length === 0) {
    return new ResponseBody(404, 'Product not found');
  }
  
  // Create product update data
  const updateData: Record<string, any> = {};
  
  if (body.name !== undefined) updateData.name = body.name;
  if (body.price !== undefined) updateData.price = body.price;
  if (body.cost !== undefined) updateData.cost = body.cost;
  if (body.quantity !== undefined) updateData.quantity = body.quantity;
  
  // Update product
  if (Object.keys(updateData).length > 0) {
    await db.update(products)
      .set(updateData)
      .where(eq(products.id, body.productId));
  }
  
  // Get all variants for this product (no need to update them individually anymore)
  const variants = await db.select()
    .from(productVariants)
    .where(eq(productVariants.productId, body.productId));
  
  // Apply inheritance to all variants to get their current values
  const variantsWithInheritance = await applyInheritanceToMany(variants);
  
  // Fetch updated product
  const updatedProduct = await db.select()
    .from(products)
    .where(eq(products.id, body.productId))
    .limit(1)
    .then(rows => rows[0]);
    
  return new ResponseBody(200, undefined, {
    product: updatedProduct,
    variants: variantsWithInheritance
  });
}, {
  validateBody: (body) => {
    return body && 
           typeof body.productId === 'string' &&
           (
             typeof body.name === 'string' ||
             typeof body.price === 'number' ||
             typeof body.cost === 'number' ||
             typeof body.quantity === 'number'
           );
  },
  logRequest: true,
  logResponse: true,
  logError: true,
  rateLimit: {
    max: 20,
    windowMs: 60000
  }
}); 