import {z} from 'zod'
import type {User} from '~/server/database/schema'

const bodySchema = z.object({
    username: z.string().min(3).max(64),
    password: z.string().min(8)
})

export default defineEventHandler(async (event) => {
    const {username, password} = await readValidatedBody(event, bodySchema.parse)
    const user: User | undefined = await useDrizzle().query.users.findFirst({
        where: (users, { eq }) => eq(users.username, username),
    });

    if (user !== undefined && await verifyPassword(user.password, password)) {
        await setUserSession(event, {
            user: user
        })
        return {}
    }
    throw createError({
        statusCode: 401,
        message: 'Bad credentials'
    })
})
