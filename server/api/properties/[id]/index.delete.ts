import { productProperties } from '~/server/database/schema';
import { eq } from 'drizzle-orm';
import { useDrizzle } from '~/server/utils/drizzle';
import { defineWrappedResponseHandler } from '~/server/utils/handler';
import ResponseBody from '~/server/models/util/ResponseBody';

export default defineWrappedResponseHandler(async (event) => {
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
  
  // Delete property (cascade will delete associated values)
  await db.delete(productProperties)
    .where(eq(productProperties.id, id));
  
  return new ResponseBody(200, 'Property deleted successfully');
}, {
  logRequest: true,
  logResponse: true,
  logError: true,
  rateLimit: {
    max: 5,
    windowMs: 60000
  }
}); 