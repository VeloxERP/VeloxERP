import {RolesSchemaType} from "~/server/database/schema/roles.schema";

export class Role implements RolesSchemaType {
    name: string;
    adminLevel: number;

    constructor(name: string, adminLevel: number) {
        this.name = name;
        this.adminLevel = adminLevel;
    }
}