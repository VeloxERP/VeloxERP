import { betterAuth, type InferSession, type InferUser } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { fromNodeHeaders, toNodeHandler } from "better-auth/integrations/node";
import { admin, organization, twoFactor, username } from "better-auth/plugins";
import { passkey } from "better-auth/plugins/passkey";
import type { H3Event } from "h3";
import { createError } from "h3";

import { ac } from "~~/shared/lib/permissions";
import { useDrizzle } from "~~/server/utils/drizzle";

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
      username: {
        type: "string",
        sortable: true,
        unique: true,
      },
      firstName: {
        type: "string",
      },
      lastName: {
        type: "string",
      },
      role: {
        type: "string",
        defaultValue: "user",
      },
    },
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
        enabled: true,
      },
    }),
  ],
});

export const authHandler = toNodeHandler(auth);

export type AuthSession = InferSession<typeof auth>;
export type AuthUser = InferUser<typeof auth>;

export async function getAuthSession(event: H3Event) {
  const response = await auth.api.getSession({
    headers: fromNodeHeaders(event.node.req.headers),
  });

  if (response.error) {
    throw createError({
      statusCode: response.error.status ?? 401,
      statusMessage: response.error.message ?? "Unable to determine session",
    });
  }

  return response.data ?? null;
}

export async function requireAuthSession(event: H3Event) {
  const session = await getAuthSession(event);

  if (!session) {
    throw createError({ statusCode: 401, statusMessage: "Unauthenticated" });
  }

  return session;
}
