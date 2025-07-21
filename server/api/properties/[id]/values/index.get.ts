import { propertyValues, productProperties } from '~~/server/database/schema';
import { useDrizzle } from '~~/server/utils/drizzle';
import { defineWrappedResponseHandler } from '~~/server/utils/handler';
import ResponseBody from '~~/server/models/util/ResponseBody';
import { eq } from 'drizzle-orm';
import type { H3Event } from 'h3';

export default defineWrappedResponseHandler(async (event: H3Event) => {
  const db = useDrizzle();
  const id = getRouterParam(event, 'id');
  
  if (!id) {
    return new ResponseBody(400, 'Property ID is required');
  }
  
  // Check if property exists
  const property = await db.select()
    .from(productProperties)
    .where(eq(productProperties.id, id))
    .limit(1);
    
  if (property.length === 0) {
    return new ResponseBody(404, 'Property not found');
  }
  
  // Fetch values for the specific property
  const values = await db.select()
    .from(propertyValues)
    .where(eq(propertyValues.propertyId, id))
    .orderBy(propertyValues.position);
  
  return new ResponseBody(200, undefined, values);
}, {
  logRequest: true,
  logResponse: true
}); 