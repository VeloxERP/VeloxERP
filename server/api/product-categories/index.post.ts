import { productCategories, insertProductCategorySchema, type NewProductCategory } from '../../database/schema/product-categories.schema';
import { eq } from 'drizzle-orm';
import { useDrizzle } from '../../utils/drizzle';
import { defineWrappedResponseHandler } from '../../utils/handler';
import ResponseBody from '../../models/util/ResponseBody';

export default defineWrappedResponseHandler(async (event) => {
  const db = useDrizzle();
  const body = await readBody(event);
  
  // Validate request body
  const validatedData = insertProductCategorySchema.parse(body);
  
  // Check if category with same name already exists
  const existingCategory = await db.select()
    .from(productCategories)
    .where(eq(productCategories.name, validatedData.name))
    .limit(1);
    
  if (existingCategory.length > 0) {
    return new ResponseBody(409, 'Category with this name already exists');
  }
  
  // Insert new category
  await db.insert(productCategories)
    .values(validatedData);
  
  // Fetch and return the created category
  const [category] = await db.select()
    .from(productCategories)
    .where(eq(productCategories.name, validatedData.name));
    
  if (!category) {
    return new ResponseBody(500, 'Failed to create category');
  }
  
  return new ResponseBody(201, undefined, category);
}, {
  validateBody: (body) => {
    try {
      insertProductCategorySchema.parse(body);
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