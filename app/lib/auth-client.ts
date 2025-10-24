import { createAuthClient } from "better-auth/vue"
import {twoFactorClient} from "better-auth/plugins";
import {adminClient, organizationClient, passkeyClient, usernameClient} from "better-auth/client/plugins";
export const authClient = createAuthClient({
    /** The base URL of the server (optional if you're using the same domain) */
    baseURL: "http://localhost:3000",
    plugins: [
        twoFactorClient(),
        usernameClient(),
        passkeyClient(),
        adminClient(),
        organizationClient({
            dynamicAccessControl: {
                enabled: true,
            },
            teams: {
                enabled: true,
            },
        })
    ]
})