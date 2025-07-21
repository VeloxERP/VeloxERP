import { productCategories } from '~~/server/database/schema';
import { useDrizzle } from '../../utils/drizzle';
import { defineWrappedResponseHandler } from '../../utils/handler';
import ResponseBody from '../../models/util/ResponseBody';

export default defineWrappedResponseHandler(async (event) => {
  const db = useDrizzle();
  const categories = await db.select().from(productCategories);
  return new ResponseBody(200, undefined, categories);
}, {
  logRequest: true,
  logResponse: true
}); 