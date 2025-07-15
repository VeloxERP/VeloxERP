import { productProperties, insertProductPropertySchema, type NewProductProperty } from '~/server/database/schema';
import { eq } from 'drizzle-orm';
import { useDrizzle } from '~/server/utils/drizzle';
import { defineWrappedResponseHandler } from '~/server/utils/handler';
import ResponseBody from '~/server/models/util/ResponseBody';

export default defineWrappedResponseHandler(async (event) => {
  const db = useDrizzle();
  const body = await readBody(event);
  
  // Validate request body
  const validatedData = insertProductPropertySchema.parse(body);
  
  // Check if property with same code already exists
  const existingProperty = await db.select()
    .from(productProperties)
    .where(eq(productProperties.code, validatedData.code))
    .limit(1);
    
  if (existingProperty.length > 0) {
    return new ResponseBody(409, 'Property with this code already exists');
  }
  
  // Insert new property
  await db.insert(productProperties)
    .values(validatedData);
  
  // Fetch and return the created property
  const [property] = await db.select()
    .from(productProperties)
    .where(eq(productProperties.code, validatedData.code));
    
  if (!property) {
    return new ResponseBody(500, 'Failed to create property');
  }
  
  return new ResponseBody(201, undefined, property);
}, {
  validateBody: (body) => {
    try {
      insertProductPropertySchema.parse(body);
      return true;
    } catch {
      return false;
    }
  },
  logRequest: true,
  logResponse: true,
  logError: true,
  rateLimit: {
    max: 10,
    windowMs: 60000
  }
}); 