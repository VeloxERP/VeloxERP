import { createAccessControl } from "better-auth/plugins/access";
import { defaultStatements, adminAc } from "better-auth/plugins/admin/access";

/**
 * make sure to use `as const` so typescript can infer the type correctly
 */
const statement = {
    ...defaultStatements,
    project: ["create", "share", "update", "delete"],
} as const;

export const ac = createAccessControl(statement);

export const user = ac.newRole({
    project: ["create"],
});

const admin = ac.newRole({
    project: ["create", "update"],
    ...adminAc.statements,
});

export const myCustomRole = ac.newRole({
    project: ["create", "update", "delete"],
    user: ["ban"],
});