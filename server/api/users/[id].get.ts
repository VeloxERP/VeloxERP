import {defineWrappedResponseHandler} from '@server/utils/handler'
import ResponseBody from '@server/models/util/ResponseBody'
import {auth} from "~~/server/utils/auth";
import {fromNodeHeaders} from "better-auth/node";

export default defineWrappedResponseHandler(async (event) => {
  return await new Promise(async (resolve, reject) => {
    const id = getRouterParam(event, 'id')
    await auth.api.getUser({
      headers: fromNodeHeaders(event.node.req.headers),
      query: {id},
    })
      .then(value => {
        if (!value) {
          resolve(new ResponseBody(404, 'error.user.not_found', undefined))
          // return new ResponseBody(404, 'error.user.not_found', undefined)
        }

        const profile = (value as any).data ?? {};
        const nameParts = (value.name ?? '').split(' ');

        resolve(new ResponseBody(200, undefined, {
          id: value.id,
          username: profile.username ?? value.email,
          email: value.email,
          firstname: profile.firstName ?? nameParts[0] ?? '',
          lastname: profile.lastName ?? nameParts.slice(1).join(' ') ?? '',
          role: profile.role ?? (value as any).role ?? 'user',
          dateOfBirth: profile.dateOfBirth ?? null,
          createdAt: value.createdAt,
          updatedAt: value.updatedAt,
        }))
      })
      .catch(error => {
        console.error('Error fetching user:', error)
        reject(new ResponseBody(500, 'error.user.fetch', undefined))
      });
  })
})