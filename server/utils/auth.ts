import { betterAuth, type InferSession, type InferUser } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { admin, organization, twoFactor, username, lastLoginMethod  } from "better-auth/plugins";
import { passkey } from "better-auth/plugins/passkey";
import type { H3Event } from "h3";
import { createError } from "h3";

import { ac } from "~~/shared/lib/permissions";
import { useDrizzle } from "~~/server/utils/drizzle";
import {fromNodeHeaders, toNodeHandler} from "better-auth/node";

const database = useDrizzle();
const fullSchema = (database as typeof database & { _: { fullSchema?: Record<string, any> } })._?.fullSchema;

export const auth = betterAuth({
  appName: process.env.APPLICATION_NAME ?? "VeloxERP",
  database: drizzleAdapter(database, {
    provider: "mysql",
    schema: fullSchema,
  }),
  emailAndPassword: {
    enabled: true,
  },
  user: {
    additionalFields: {
      firstName: {
        type: "string",
      },
      lastName: {
        type: "string",
      },
    },
  },
  plugins: [
    username(),
    twoFactor(),
    passkey(),
    admin(),
    lastLoginMethod(),
    organization({
      teams: { enabled: true },
      allowUserToCreateOrganization: false,
      ac,
      dynamicAccessControl: {
        enabled: true,
      },
    }),
  ],
});

export const authHandler = toNodeHandler(auth);

export type Session = typeof auth.$Infer.Session.session
export type AuthUser = InferUser<typeof auth>;

export async function getSession(event: H3Event) {
  const response = await auth.api.getSession({
    headers: fromNodeHeaders(event.node.req.headers),
  });

  if (!response?.session) {
    throw createError({
      statusCode: 401,
      statusMessage: "Unauthenticated",
    });
  }
  return response.session ?? null;
}

export async function requireSession(event: H3Event) {
  const session = await getSession(event);

  if (!session) {
    throw createError({ statusCode: 401, statusMessage: "Unauthenticated" });
  }

  return session;
}
