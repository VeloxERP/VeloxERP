import { productVariants } from '../../database/schema';
import { useDrizzle } from '../../utils/drizzle';
import { defineWrappedResponseHandler } from '../../utils/handler';
import ResponseBody from '../../models/util/ResponseBody';

export default defineWrappedResponseHandler(async (event) => {
  const db = useDrizzle();
  const allVariants = await db.select().from(productVariants);
  return new ResponseBody(200, undefined, allVariants);
}, {
  logRequest: true,
  logResponse: true
}); 