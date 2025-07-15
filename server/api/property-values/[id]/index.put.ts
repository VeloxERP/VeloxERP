import { propertyValues, insertPropertyValueSchema, productProperties } from '~/server/database/schema';
import { eq, and, ne } from 'drizzle-orm';
import { useDrizzle } from '~/server/utils/drizzle';
import { defineWrappedResponseHandler } from '~/server/utils/handler';
import ResponseBody from '~/server/models/util/ResponseBody';
import type { H3Event } from 'h3';

export default defineWrappedResponseHandler(async (event: H3Event) => {
  const db = useDrizzle();
  const id = getRouterParam(event, 'id');
  const body = await readBody(event);
  
  if (!id) {
    return new ResponseBody(400, 'Property Value ID is required');
  }
  
  // Validate request body
  const validatedData = insertPropertyValueSchema.parse(body);
  
  // Fetch the current property value
  const currentValue = await db.select()
    .from(propertyValues)
    .where(eq(propertyValues.id, id))
    .limit(1);
  
  if (currentValue.length === 0) {
    return new ResponseBody(404, 'Property value not found');
  }
  
  // Check if property exists
  const property = await db.select()
    .from(productProperties)
    .where(eq(productProperties.id, validatedData.propertyId))
    .limit(1);
    
  if (property.length === 0) {
    return new ResponseBody(404, 'Property not found');
  }
  
  // Check if value already exists for this property (excluding this value)
  const existingValue = await db.select()
    .from(propertyValues)
    .where(and(
      eq(propertyValues.propertyId, validatedData.propertyId),
      eq(propertyValues.value, validatedData.value),
      ne(propertyValues.id, id)
    ))
    .limit(1);
    
  if (existingValue.length > 0) {
    return new ResponseBody(409, 'Value already exists for this property');
  }
  
  // Update property value
  await db.update(propertyValues)
    .set(validatedData)
    .where(eq(propertyValues.id, id));
  
  // Fetch and return the updated value
  const [updatedValue] = await db.select()
    .from(propertyValues)
    .where(eq(propertyValues.id, id));
    
  if (!updatedValue) {
    return new ResponseBody(500, 'Failed to update property value');
  }
  
  return new ResponseBody(200, undefined, updatedValue);
}, {
  validateBody: (body: unknown) => {
    try {
      insertPropertyValueSchema.parse(body);
      return true;
    } catch {
      return false;
    }
  },
  logRequest: true,
  logResponse: true,
  logError: true
}); 