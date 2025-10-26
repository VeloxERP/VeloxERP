import { defineWrappedResponseHandler } from '@server/utils/handler'
import ResponseBody from '@server/models/util/ResponseBody'
import { auth } from "~~/server/utils/auth";
import { fromNodeHeaders } from "better-auth/integrations/node";

export default defineWrappedResponseHandler(async (event) => {
  try {
    const { data, error } = await auth.api.listUsers({
      headers: fromNodeHeaders(event.node.req.headers),
      query: {
        limit: String(getQuery(event).limit ?? 100),
        offset: String(getQuery(event).offset ?? 0),
        searchValue: typeof getQuery(event).search === 'string' ? getQuery(event).search : undefined,
      },
    });

    if (error) {
      throw error;
    }

    const users = data?.users?.map((user) => {
      const profile = (user as any).data ?? {};
      const nameParts = (user.name ?? '').split(' ');

      return {
        id: user.id,
        username: profile.username ?? nameParts[0] ?? user.email,
        email: user.email,
        firstname: profile.firstName ?? nameParts[0] ?? '',
        lastname: profile.lastName ?? nameParts.slice(1).join(' ') ?? '',
        role: profile.role ?? (user as any).role ?? 'user',
        dateOfBirth: profile.dateOfBirth ?? null,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      };
    }) ?? [];

    return new ResponseBody(200, undefined, users)
  } catch (error) {
    console.error('Error fetching users:', error)
    return new ResponseBody(500, 'error.users.fetch', undefined)
  }
})