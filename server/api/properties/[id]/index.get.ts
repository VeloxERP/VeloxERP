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
  
  // Fetch property by ID
  const properties = await db.select()
    .from(productProperties)
    .where(eq(productProperties.id, id))
    .limit(1);
  
  if (properties.length === 0) {
    return new ResponseBody(404, 'Property not found');
  }
  
  return new ResponseBody(200, undefined, properties[0]);
}, {
  logRequest: true,
  logResponse: true
}); 