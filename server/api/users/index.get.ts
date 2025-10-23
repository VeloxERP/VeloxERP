import { users, rolesSchema } from '@server/database/schema'
import { eq } from 'drizzle-orm'
import { defineWrappedResponseHandler } from '@server/utils/handler'
import ResponseBody from '@server/models/util/ResponseBody'
import { useDrizzle } from '@server/utils/drizzle'

export default defineWrappedResponseHandler(async (event) => {
  try {
    const db = useDrizzle()
    
    const allUsers = await db
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
      .orderBy(users.createdAt)

    return new ResponseBody(200, undefined, allUsers)
  } catch (error) {
    console.error('Error fetching users:', error)
    return new ResponseBody(500, 'error.users.fetch', undefined)
  }
}) 