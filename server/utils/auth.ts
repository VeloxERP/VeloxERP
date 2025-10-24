import { betterAuth } from "better-auth";
import {drizzleAdapter} from "better-auth/adapters/drizzle";
import {admin, organization, twoFactor, username} from "better-auth/plugins";
import {passkey} from "better-auth/plugins/passkey";

import {ac} from '~~/shared/lib/permissions'

export const auth = betterAuth({
    name: process.env.APPLIATION_NAME,
    database: drizzleAdapter(useDrizzle(), {
        provider: "mysql", // or "mysql", "sqlite"
    }),
    emailAndPassword: {
        enabled: true,
    },
    plugins: [
        username(),
        twoFactor(),
        passkey(),
        admin(),
        organization({
            teams: { enabled: true },
            allowUserToCreateOrganization: false,
            ac,
            dynamicAccessControl: {
                enabled: true
            }
        })
    ]
});