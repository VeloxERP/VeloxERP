import { rolesSchema } from '@server/database/schema'
import { defineWrappedResponseHandler } from '@server/utils/handler'
import ResponseBody from '@server/models/util/ResponseBody'
import { useDrizzle } from '@server/utils/drizzle'

export default defineWrappedResponseHandler(async (event) => {
  try {
    const db = useDrizzle()
    
    const allRoles = await db
      .select({
        name: rolesSchema.name,
      })
      .from(rolesSchema)
      .orderBy(rolesSchema.name)

    return new ResponseBody(200, undefined, allRoles)
  } catch (error) {
    console.error('Error fetching roles:', error)
    return new ResponseBody(500, 'error.roles.fetch', undefined)
  }
}) 