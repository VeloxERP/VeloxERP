// import { z } from 'zod'
// import { rolesSchema } from '@server/database/schema'
// import { defineWrappedResponseHandler } from '@server/utils/handler'
// import ResponseBody from '@server/models/util/ResponseBody'
// import { eq } from 'drizzle-orm'
// import { useDrizzle } from '@server/utils/drizzle'
//
// const createRoleSchema = z.object({
//   name: z.string().min(1).max(32),
// })
//
// export default defineWrappedResponseHandler(async (event) => {
//   try {
//     const { name } = await readValidatedBody(event, createRoleSchema.parse)
//     const db = useDrizzle();
//
//     // Check if role already exists
//     const existingRole = await db
//       .select({ name: rolesSchema.name })
//       .from(rolesSchema)
//       .where(eq(rolesSchema.name, name))
//       .limit(1)
//
//     if (existingRole.length) {
//       return new ResponseBody(400, 'error.role.exists', undefined)
//     }
//
//     // Create new role
//     await db.insert(rolesSchema).values({ name })
//
//     return new ResponseBody(201, 'Role created successfully', { name })
//   } catch (error) {
//     console.error('Error creating role:', error)
//     return new ResponseBody(500, 'error.role.create', undefined)
//   }
// })