import { z } from 'zod'
import { users } from '@/server/database/schema'
import { InferInsertModel } from 'drizzle-orm'

const bodySchema = z.object({
    email: z.string().email(),
    username: z.string().min(3).max(64),
    firstname: z.string().max(64),
    lastname: z.string().max(64),
})

type NewUser = InferInsertModel<typeof users>

// Use a default parameter and const instead of var
const generatePassword = (length = 8): string => {
    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-.,&%$§!_:'
    let password = ''
    for (let i = 0, n = charset.length; i < length; i++) {
        password += charset.charAt(Math.floor(Math.random() * n))
    }
    return password
}

export default defineEventHandler(async (event) => {
    // Validate and destructure the request body using Zod
    const { email, username, firstname, lastname } = await readValidatedBody(event, bodySchema.parse)

    // Build the new user object
    const newUser: NewUser = {
        email,
        username,
        firstname,
        lastname,
        password: generatePassword(12),
    }

    // Get a singleton drizzle instance
    const drizzle = useDrizzle()

    // Insert the new user and return the inserted id(s)
    console.log(newUser)
    const result = await drizzle.insert(users).values([newUser])//.$returningId()
    return JSON.stringify({id: result});
})

