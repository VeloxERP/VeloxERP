import { defineWrappedResponseHandler } from '@server/utils/handler'
import ResponseBody from '@server/models/util/ResponseBody'
import { auth } from "~~/server/utils/auth";
import { fromNodeHeaders } from "better-auth/integrations/node";

export default defineWrappedResponseHandler(async (event) => {
  try {
    const id = getRouterParam(event, 'id')

    const { data, error } = await auth.api.getUser({
      headers: fromNodeHeaders(event.node.req.headers),
      query: { id },
    });

    if (error) {
      throw error;
    }

    if (!data) {
      return new ResponseBody(404, 'error.user.not_found', undefined)
    }

    const profile = (data as any).data ?? {};
    const nameParts = (data.name ?? '').split(' ');

    return new ResponseBody(200, undefined, {
      id: data.id,
      username: profile.username ?? data.email,
      email: data.email,
      firstname: profile.firstName ?? nameParts[0] ?? '',
      lastname: profile.lastName ?? nameParts.slice(1).join(' ') ?? '',
      role: profile.role ?? (data as any).role ?? 'user',
      dateOfBirth: profile.dateOfBirth ?? null,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    })
  } catch (error) {
    console.error('Error fetching user:', error)
    return new ResponseBody(500, 'error.user.fetch', undefined)
  }
})