import { z } from 'zod'
import { defineWrappedResponseHandler } from '@server/utils/handler'
import ResponseBody from '@server/models/util/ResponseBody'
import { auth } from "~~/server/utils/auth";
import { fromNodeHeaders } from "better-auth/integrations/node";

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
    const updatePayload: Record<string, unknown> = {
      ...(body.email ? { email: body.email } : {}),
      ...(body.username ? { username: body.username } : {}),
      ...(body.firstname ? { firstName: body.firstname } : {}),
      ...(body.lastname ? { lastName: body.lastname } : {}),
      ...(body.role ? { role: body.role } : {}),
      ...(body.dateOfBirth ? { dateOfBirth: body.dateOfBirth } : {}),
    }

    if (!Object.keys(updatePayload).length) {
      return new ResponseBody(400, 'error.user.update.empty', undefined)
    }

    const { error } = await auth.api.adminUpdateUser({
      headers: fromNodeHeaders(event.node.req.headers),
      body: {
        userId: id,
        data: updatePayload,
      },
    })

    if (error) {
      throw error
    }

    return new ResponseBody(200, 'User updated successfully', undefined)
  } catch (error) {
    console.error('Error updating user:', error)
    return new ResponseBody(500, 'error.user.update', undefined)
  }
})