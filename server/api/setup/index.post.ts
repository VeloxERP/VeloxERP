import {promises as fs} from 'node:fs'
import {resolve} from 'node:path'
import {z} from 'zod'
import {v7} from "uuid";
import {defineWrappedResponseHandler} from "@server/utils/handler";
import ResponseBody from "@server/models/util/ResponseBody";
import {auth} from "@server/utils/auth";

const {sendMail} = useNodeMailer()
const bodySchema = z.object({
  email: z.email(),
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

const ENV_FILE_PATH = resolve(process.cwd(), '.env');
const DEFAULT_ADMIN_ENV_KEY = 'DEFAULT_ADMIN_ID';

const persistDefaultAdminId = async (id: string) => {
  const envEntry = `${DEFAULT_ADMIN_ENV_KEY}=${id}`;
  try {
    let content = '';
    try {
      content = await fs.readFile(ENV_FILE_PATH, 'utf8');
    } catch (error: unknown) {
      const err = error as NodeJS.ErrnoException;
      if (err?.code !== 'ENOENT') {
        throw error;
      }
    }

    const regex = new RegExp(`^${DEFAULT_ADMIN_ENV_KEY}=.*$`, 'm');
    if (!content) {
      content = `${envEntry}\n`;
    } else if (regex.test(content)) {
      content = content.replace(regex, envEntry);
      if (!content.endsWith('\n')) {
        content += '\n';
      }
    } else {
      content += (content.endsWith('\n') ? '' : '\n') + envEntry + '\n';
    }

    await fs.writeFile(ENV_FILE_PATH, content, 'utf8');
    process.env[DEFAULT_ADMIN_ENV_KEY] = id;
  } catch (error) {
    console.error(`Failed to persist ${DEFAULT_ADMIN_ENV_KEY} in .env`, error);
  }
}

export default defineWrappedResponseHandler(async (event) => {
  // Validate and destructure the request body using Zod
  const {email, username, firstname, lastname} = await readValidatedBody(event, bodySchema.parse)
  const password = generatePassword(12);

  try {
    const signupResult = await auth.api.signUpEmail({
      body: {
        username,
        name: `${firstname} ${lastname}`.trim(),
        email,
        password
      }
    })

    if (!signupResult?.user?.id) {
      return new ResponseBody(500, 'error.user.not_found', undefined)
    }

    const userId = signupResult.user.id
    await persistDefaultAdminId(userId)

    console.log(`Default user ${username} created with password: ${password}`);
    return new ResponseBody(201, undefined, {id: userId ?? v7()});
  } catch (error) {
    console.error("Failed to create user", error);
    return new ResponseBody(400, 'error.user.exists', undefined)
  }
}, {requireAuth: false})
