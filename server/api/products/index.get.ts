import { products } from '../../database/schema';
import { useDrizzle } from '../../utils/drizzle';
import { defineWrappedResponseHandler } from '../../utils/handler';
import ResponseBody from '../../models/util/ResponseBody';

export default defineWrappedResponseHandler(async (event) => {
  const db = useDrizzle();
  const allProducts = await db.select().from(products);
  return new ResponseBody(200, undefined, allProducts);
}, {
  logRequest: true,
  logResponse: true
}); 