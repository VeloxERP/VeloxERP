import {z} from 'zod'
import {v7} from "uuid";
import {defineWrappedResponseHandler} from "~~/server/utils/handler";
import ResponseBody from "~~/server/models/util/ResponseBody";
import { auth } from "~~/server/utils/auth";
import { fromNodeHeaders } from "better-auth/integrations/node";

const {sendMail} = useNodeMailer()
const bodySchema = z.object({
    email: z.string().email(),
    username: z.string().min(3).max(64),
    firstname: z.string().max(64),
    lastname: z.string().max(64),
})

// Use a default parameter and const instead of var
const generatePassword = (length = 8): string => {
    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-.,&%$§!_:'
    let password = ''
    for (let i = 0, n = charset.length; i < length; i++) {
        password += charset.charAt(Math.floor(Math.random() * n))
    }
    return password
}

//TODO make mail better please
const sendPasswordEmail = async (email: string, password: string) => {
    return sendMail({
        to: email,
        subject: 'User Created',
        text: "A account for you was just created!\n Login with this password: " + password,
    });
}

export default defineWrappedResponseHandler(async (event) => {
    // Validate and destructure the request body using Zod
    const {email, username, firstname, lastname} = await readValidatedBody(event, bodySchema.parse)

    const password = generatePassword(12);

    try {
        const { data, error } = await auth.api.createUser({
            headers: fromNodeHeaders(event.node.req.headers),
            body: {
                email,
                password,
                name: `${firstname} ${lastname}`.trim(),
                data: {
                    username,
                    firstName: firstname,
                    lastName: lastname,
                    role: "user",
                    invitedBy: event.context.authSession?.user.id ?? null,
                    temporaryPassword: true,
                },
            },
        });

        if (error) {
            throw error;
        }

        console.log(`User ${username} created with password: ${password}`);
        //sendPasswordEmail(email, password);
        return new ResponseBody(201, undefined, {id: data?.user.id ?? v7()});
    } catch (e) {
        console.error("Failed to create user", e);
        return new ResponseBody(400, "error.user.exists", undefined);
    }
})

