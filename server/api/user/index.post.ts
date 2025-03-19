import {z} from 'zod'
import {users} from '@/server/database/schema'
import {InferInsertModel} from 'drizzle-orm'
import {v7} from "uuid";
import User from '~/server/models/User';
import {defineWrappedResponseHandler} from "~/server/utils/handler";
import ResponseBody from "~/server/models/util/ResponseBody";

const {sendMail} = useNodeMailer()
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

    console.log(await hashPassword(generatePassword(12)));
    let newUser;
    let password = generatePassword(12);

    try {
        newUser = await User.create({
            id: v7(),
            email: email,
            username: username,
            firstname: firstname,
            lastname: lastname,
            password: await hashPassword(password),
        });
        sendPasswordEmail(email, password);
        return new ResponseBody(201, undefined, {id: newUser.id});
    } catch (e) {
        return new ResponseBody(400, "error.user.exists", undefined);
    }
})

