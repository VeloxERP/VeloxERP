import { propertyValues } from '~/server/database/schema';
import { eq } from 'drizzle-orm';
import { useDrizzle } from '~/server/utils/drizzle';
import { defineWrappedResponseHandler } from '~/server/utils/handler';
import ResponseBody from '~/server/models/util/ResponseBody';
import type { H3Event } from 'h3';

export default defineWrappedResponseHandler(async (event: H3Event) => {
  const db = useDrizzle();
  const id = getRouterParam(event, 'id');
  
  if (!id) {
    return new ResponseBody(400, 'Property Value ID is required');
  }
  
  // Fetch the property value
  const values = await db.select()
    .from(propertyValues)
    .where(eq(propertyValues.id, id))
    .limit(1);
  
  if (values.length === 0) {
    return new ResponseBody(404, 'Property value not found');
  }
  
  return new ResponseBody(200, undefined, values[0]);
}, {
  logRequest: true,
  logResponse: true
}); 