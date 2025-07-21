import { propertyValues } from '~~/server/database/schema';
import { eq } from 'drizzle-orm';
import { useDrizzle } from '~~/server/utils/drizzle';
import { defineWrappedResponseHandler } from '~~/server/utils/handler';
import ResponseBody from '~~/server/models/util/ResponseBody';
import type { H3Event } from 'h3';

export default defineWrappedResponseHandler(async (event: H3Event) => {
  const db = useDrizzle();
  const id = getRouterParam(event, 'id');
  
  if (!id) {
    return new ResponseBody(400, 'Property Value ID is required');
  }
  
  // Check if property value exists
  const value = await db.select()
    .from(propertyValues)
    .where(eq(propertyValues.id, id))
    .limit(1);
    
  if (value.length === 0) {
    return new ResponseBody(404, 'Property value not found');
  }
  
  // Delete property value
  await db.delete(propertyValues)
    .where(eq(propertyValues.id, id));
  
  return new ResponseBody(200, 'Property value deleted successfully');
}, {
  logRequest: true,
  logResponse: true,
  logError: true,
  rateLimit: {
    max: 5,
    windowMs: 60000
  }
}); 