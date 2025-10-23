import {z} from 'zod'
import {User} from '@server/models/User'
import ResponseBody from "@server/models/util/ResponseBody";

const bodySchema = z.object({
    username: z.string().min(3).max(64),
    password: z.string().min(8)
})

export default defineWrappedResponseHandler(async (event) => {
    const failedMessage = "error.auth.bad-credentials";
    const {username, password} = await readValidatedBody(event, bodySchema.parse)

    console.log(username);

    return User.findByUsername(username)
        .then(async (user: User) => {

            console.log(user);

            if (await verifyPassword(user.password, password)) {
                await setUserSession(event, {
                    user: user
                })
                return new ResponseBody(200, undefined, undefined)
            }
            return new ResponseBody(401, failedMessage, undefined);
        })
        .catch((err: Error) => {
            return new ResponseBody(401, failedMessage, err);
        });
})
