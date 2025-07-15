import { productProperties } from '~/server/database/schema';
import { useDrizzle } from '~/server/utils/drizzle';
import { defineWrappedResponseHandler } from '~/server/utils/handler';
import ResponseBody from '~/server/models/util/ResponseBody';

export default defineWrappedResponseHandler(async (event) => {
  const db = useDrizzle();
  
  // Fetch all product properties
  const properties = await db.select().from(productProperties);
  
  return new ResponseBody(200, undefined, properties);
}, {
  logRequest: true,
  logResponse: true
}); 