import {auth} from "@server/utils/auth";
import {defineWrappedResponseHandler} from "@server/utils/handler";
import {z} from "zod";
import ResponseBody from "@server/models/util/ResponseBody";
import {fromNodeHeaders} from "better-auth/node";

const bodySchema = z.object({
  name: z.string().min(3).max(64),
})

const createOrganization = async (name: string, ownerId: string, header: Headers) => {
  return auth.api.createOrganization({
    body: {
      name: name, // required
      slug: slugify(name), // required
      userId: ownerId, // server-only
    },
    headers: header,
  });
}

function slugify(str: string) {
  str = str.replace(/^\s+|\s+$/g, ''); // trim leading/trailing white space
  str = str.toLowerCase(); // convert string to lowercase
  str = str.replace(/[^a-z0-9 -]/g, '') // remove any non-alphanumeric characters
    .replace(/\s+/g, '-') // replace spaces with hyphens
    .replace(/-+/g, '-'); // remove consecutive hyphens
  return str;
}

export default defineWrappedResponseHandler(async (event) => {
  const {name} = await readValidatedBody(event, bodySchema.parse)
  const session = event.context.session;
  try {
    if (!session)
      return new ResponseBody(401, 'error.session.expired', undefined)

    const data = await createOrganization(name, session?.userId, fromNodeHeaders(event.node.req.headers))
    return new ResponseBody(201, undefined, data)
  } catch (error) {
    return new ResponseBody(500, 'error.organization.creation', undefined)
  }
}, {requireAuth: true});