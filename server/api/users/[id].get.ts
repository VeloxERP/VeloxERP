import { users } from '@server/database/schema'
import { eq } from 'drizzle-orm'
import { defineWrappedResponseHandler } from '@server/utils/handler'
import ResponseBody from '@server/models/util/ResponseBody'
import { useDrizzle } from '@server/utils/drizzle'

export default defineWrappedResponseHandler(async (event) => {
  try {
    const id = getRouterParam(event, 'id')
    const db = useDrizzle()
    
    const user = await db
      .select({
        id: users.id,
        username: users.username,
        email: users.email,
        firstname: users.firstname,
        lastname: users.lastname,
        role: users.role,
        dateOfBirth: users.dateOfBirth,
        createdAt: users.createdAt,
        updatedAt: users.updatedAt,
      })
      .from(users)
      .where(eq(users.id, id))
      .limit(1)

    if (!user.length) {
      return new ResponseBody(404, 'error.user.not_found', undefined)
    }

    return new ResponseBody(200, undefined, user[0])
  } catch (error) {
    console.error('Error fetching user:', error)
    return new ResponseBody(500, 'error.user.fetch', undefined)
  }
}) 