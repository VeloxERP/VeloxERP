import { productProperties, insertProductPropertySchema } from '~/server/database/schema';
import { eq, and, ne } from 'drizzle-orm';
import { useDrizzle } from '~/server/utils/drizzle';
import { defineWrappedResponseHandler } from '~/server/utils/handler';
import ResponseBody from '~/server/models/util/ResponseBody';

export default defineWrappedResponseHandler(async (event) => {
  const db = useDrizzle();
  const id = getRouterParam(event, 'id');
  const body = await readBody(event);
  
  if (!id) {
    return new ResponseBody(400, 'Property ID is required');
  }
  
  // Validate request body
  const validatedData = insertProductPropertySchema.parse(body);
  
  // Check if property exists
  const property = await db.select()
    .from(productProperties)
    .where(eq(productProperties.id, id))
    .limit(1);
    
  if (property.length === 0) {
    return new ResponseBody(404, 'Property not found');
  }
  
  // Check if property with same code already exists (excluding this property)
  const existingProperty = await db.select()
    .from(productProperties)
    .where(and(
      eq(productProperties.code, validatedData.code),
      ne(productProperties.id, id)
    ))
    .limit(1);
    
  if (existingProperty.length > 0) {
    return new ResponseBody(409, 'Property with this code already exists');
  }
  
  // Update property
  await db.update(productProperties)
    .set(validatedData)
    .where(eq(productProperties.id, id));
  
  // Fetch and return the updated property
  const [updatedProperty] = await db.select()
    .from(productProperties)
    .where(eq(productProperties.id, id));
    
  if (!updatedProperty) {
    return new ResponseBody(500, 'Failed to update property');
  }
  
  return new ResponseBody(200, undefined, updatedProperty);
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