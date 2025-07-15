import { propertyValues, insertPropertyValueSchema, type NewPropertyValue, productProperties } from '~/server/database/schema';
import { eq, and } from 'drizzle-orm';
import { useDrizzle } from '~/server/utils/drizzle';
import { defineWrappedResponseHandler } from '~/server/utils/handler';
import ResponseBody from '~/server/models/util/ResponseBody';
import { sql } from 'drizzle-orm';
import type { H3Event } from 'h3';

export default defineWrappedResponseHandler(async (event: H3Event) => {
  const db = useDrizzle();
  const id = getRouterParam(event, 'id');
  const body = await readBody(event);
  
  if (!id) {
    return new ResponseBody(400, 'Property ID is required');
  }
  
  // Validate request body
  const validatedData = insertPropertyValueSchema.parse(body);
  
  // Ensure the propertyId matches the route parameter
  if (validatedData.propertyId !== id) {
    return new ResponseBody(400, 'Property ID mismatch');
  }
  
  // Check if property exists
  const property = await db.select()
    .from(productProperties)
    .where(eq(productProperties.id, id))
    .limit(1);
    
  if (property.length === 0) {
    return new ResponseBody(404, 'Property not found');
  }
  
  // Check if value already exists for this property
  const existingValue = await db.select()
    .from(propertyValues)
    .where(and(
      eq(propertyValues.propertyId, id),
      eq(propertyValues.value, validatedData.value)
    ))
    .limit(1);
    
  if (existingValue.length > 0) {
    return new ResponseBody(409, 'Value already exists for this property');
  }
  
  // Get highest position for this property
  const highestPosition = await db.select({ max: sql`MAX(${propertyValues.position})` })
    .from(propertyValues)
    .where(eq(propertyValues.propertyId, id));
  
  // Set position to highest + 1 if not provided
  if (validatedData.position === undefined || validatedData.position === null) {
    validatedData.position = ((highestPosition[0]?.max as number) || 0) + 1;
  }
  
  // Insert new property value
  await db.insert(propertyValues)
    .values(validatedData);
  
  // Fetch and return the created value
  const [value] = await db.select()
    .from(propertyValues)
    .where(and(
      eq(propertyValues.propertyId, id),
      eq(propertyValues.value, validatedData.value)
    ));
    
  if (!value) {
    return new ResponseBody(500, 'Failed to create property value');
  }
  
  return new ResponseBody(201, undefined, value);
}, {
  validateBody: (body: unknown) => {
    try {
      console.log("123", insertPropertyValueSchema.safeParse(body))
      insertPropertyValueSchema.parse(body);
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