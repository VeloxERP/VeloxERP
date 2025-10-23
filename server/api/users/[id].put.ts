import { z } from 'zod'
import { users } from '@server/database/schema'
import { eq } from 'drizzle-orm'
import { defineWrappedResponseHandler } from '@server/utils/handler'
import ResponseBody from '@server/models/util/ResponseBody'
import { useDrizzle } from '@server/utils/drizzle'

const updateUserSchema = z.object({
  username: z.string().min(3).max(64).optional(),
  email: z.string().email().optional(),
  firstname: z.string().max(64).optional(),
  lastname: z.string().max(64).optional(),
  role: z.string().max(32).optional(),
  dateOfBirth: z.string().optional(),
})

export default defineWrappedResponseHandler(async (event) => {
  try {
    const id = getRouterParam(event, 'id')
    const body = await readValidatedBody(event, updateUserSchema.parse)
    const db = useDrizzle()
    
    // Check if user exists
    const existingUser = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.id, id))
      .limit(1)

    if (!existingUser.length) {
      return new ResponseBody(404, 'error.user.not_found', undefined)
    }

    // Update user
    await db
      .update(users)
      .set({
        ...body,
        updatedAt: new Date(),
      })
      .where(eq(users.id, id))

    return new ResponseBody(200, 'User updated successfully', undefined)
  } catch (error) {
    console.error('Error updating user:', error)
    return new ResponseBody(500, 'error.user.update', undefined)
  }
}) 