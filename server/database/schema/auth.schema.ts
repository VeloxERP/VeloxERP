import {
  mysqlTable,
  varchar,
  text,
  timestamp,
  boolean,
  int,
} from "drizzle-orm/mysql-core";

export const user = mysqlTable("user", {
  id: varchar("id", { length: 36 }).primaryKey(),
  name: text("name").notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  emailVerified: boolean("email_verified").default(false).notNull(),
  image: text("image"),
  createdAt: timestamp("created_at", { fsp: 3 }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { fsp: 3 })
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
  username: varchar("username", { length: 255 }).unique(),
  displayUsername: text("display_username"),
  twoFactorEnabled: boolean("two_factor_enabled").default(false),
  role: text("role").default("user"),
  banned: boolean("banned").default(false),
  banReason: text("ban_reason"),
  banExpires: timestamp("ban_expires", { fsp: 3 }),
  firstName: text("first_name"),
  lastName: text("last_name"),
});

export const session = mysqlTable("session", {
  id: varchar("id", { length: 36 }).primaryKey(),
  expiresAt: timestamp("expires_at", { fsp: 3 }).notNull(),
  token: varchar("token", { length: 255 }).notNull().unique(),
  createdAt: timestamp("created_at", { fsp: 3 }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { fsp: 3 })
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: varchar("user_id", { length: 36 })
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  impersonatedBy: text("impersonated_by"),
  activeOrganizationId: text("active_organization_id"),
  activeTeamId: text("active_team_id"),
});

export const account = mysqlTable("account", {
  id: varchar("id", { length: 36 }).primaryKey(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: varchar("user_id", { length: 36 })
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: timestamp("access_token_expires_at", { fsp: 3 }),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at", { fsp: 3 }),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("created_at", { fsp: 3 }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { fsp: 3 })
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
});

export const verification = mysqlTable("verification", {
  id: varchar("id", { length: 36 }).primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at", { fsp: 3 }).notNull(),
  createdAt: timestamp("created_at", { fsp: 3 }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { fsp: 3 })
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
});

export const twoFactor = mysqlTable("two_factor", {
  id: varchar("id", { length: 36 }).primaryKey(),
  secret: text("secret").notNull(),
  backupCodes: text("backup_codes").notNull(),
  userId: varchar("user_id", { length: 36 })
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
});

export const passkey = mysqlTable("passkey", {
  id: varchar("id", { length: 36 }).primaryKey(),
  name: text("name"),
  publicKey: text("public_key").notNull(),
  userId: varchar("user_id", { length: 36 })
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  credentialID: text("credential_id").notNull(),
  counter: int("counter").notNull(),
  deviceType: text("device_type").notNull(),
  backedUp: boolean("backed_up").notNull(),
  transports: text("transports"),
  createdAt: timestamp("created_at", { fsp: 3 }),
  aaguid: text("aaguid"),
});

export const organizationRole = mysqlTable("organization_role", {
  id: varchar("id", { length: 36 }).primaryKey(),
  organizationId: varchar("organization_id", { length: 36 })
    .notNull()
    .references(() => organization.id, { onDelete: "cascade" }),
  role: text("role").notNull(),
  permission: text("permission").notNull(),
  createdAt: timestamp("created_at", { fsp: 3 }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { fsp: 3 }).$onUpdate(
    () => /* @__PURE__ */ new Date(),
  ),
});

export const team = mysqlTable("team", {
  id: varchar("id", { length: 36 }).primaryKey(),
  name: text("name").notNull(),
  organizationId: varchar("organization_id", { length: 36 })
    .notNull()
    .references(() => organization.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at", { fsp: 3 }).notNull(),
  updatedAt: timestamp("updated_at", { fsp: 3 }).$onUpdate(
    () => /* @__PURE__ */ new Date(),
  ),
});

export const teamMember = mysqlTable("team_member", {
  id: varchar("id", { length: 36 }).primaryKey(),
  teamId: varchar("team_id", { length: 36 })
    .notNull()
    .references(() => team.id, { onDelete: "cascade" }),
  userId: varchar("user_id", { length: 36 })
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at", { fsp: 3 }),
});

export const organization = mysqlTable("organization", {
  id: varchar("id", { length: 36 }).primaryKey(),
  name: text("name").notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  logo: text("logo"),
  createdAt: timestamp("created_at", { fsp: 3 }).notNull(),
  metadata: text("metadata"),
});

export const member = mysqlTable("member", {
  id: varchar("id", { length: 36 }).primaryKey(),
  organizationId: varchar("organization_id", { length: 36 })
    .notNull()
    .references(() => organization.id, { onDelete: "cascade" }),
  userId: varchar("user_id", { length: 36 })
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  role: text("role").default("member").notNull(),
  createdAt: timestamp("created_at", { fsp: 3 }).notNull(),
});

export const invitation = mysqlTable("invitation", {
  id: varchar("id", { length: 36 }).primaryKey(),
  organizationId: varchar("organization_id", { length: 36 })
    .notNull()
    .references(() => organization.id, { onDelete: "cascade" }),
  email: text("email").notNull(),
  role: text("role"),
  teamId: text("team_id"),
  status: text("status").default("pending").notNull(),
  expiresAt: timestamp("expires_at", { fsp: 3 }).notNull(),
  inviterId: varchar("inviter_id", { length: 36 })
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
});
