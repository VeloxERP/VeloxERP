//import {eq} from "drizzle-orm/expressions";
import type {UserSchemaType} from "@server/database/schema/users.schema";
import {users} from "@server/database/schema/users.schema";
import {v7} from "uuid";

import Entity from '@server/models/util/Entity'

export class User extends Entity implements UserSchemaType {
    username: string;
    email: string;
    password: string;
    dateOfBirth: Date | null;
    firstname: string;
    lastname: string;
    address_id: string | null;
    role: string;

    constructor(data: UserSchemaType) {
        super(data.id, data.created_at, data.updated_at, data.deleted_at);
        this.username = data.username;
        this.email = data.email;
        this.password = data.password;
        this.dateOfBirth = data.dateOfBirth;
        this.firstname = data.firstname;
        this.lastname = data.lastname;
        this.address_id = data.address_id;
        this.role = data.role;
    }

    //TODO: Do
    static getTableName(): string {
        return "";
    }


    static load(id: string): Entity {
        return undefined;
    }

    // //TODO???
    // private constructor(data: {user: UserSchemaType, role: RolesSchemaType }) {
    //     super();
    // }

    static async findById(id: string): Promise<User | null> {
        const result = await useDrizzle().select().from(users).where(eq(users.id, id));
        result
        return result.length ? new User(result[0]) : null;
    }

    static async findByUsername(username: string): Promise<User> {
        const row = await useDrizzle().query.users.findFirst({
            where: eq(users.username, username),
            with: {
                role: true
            }
        })
        if (!row) {
            throw createError({ statusCode: 404, statusMessage: 'User nicht gefunden' })
        }
        return new User(row);
        /* await useDrizzle()
            .select()
            .from(users)
            .where(eq(users.username, username))
            .leftJoin(rolesSchema, eq(users.role, rolesSchema.name))
            .limit(1);
        if (result.length > 0) {
            const ur = result.find
            return new User(result.at(0)?.users.);
        }
        throw new Error("User not found");*/
        //return result.length ? new User(result[0].users) : throw new Error("User not found");
    }

    static async findByEmail(email: string): Promise<User | null> {
        const result = await useDrizzle().select().from(users).where(eq(users.email, email));
        return result.length ? new User(result[0]) : null;
    }

    static async create(newUser: Partial<UserSchemaType>): Promise<string> {
        if (!newUser.username || !newUser.email || !newUser.password || !newUser.firstname || !newUser.lastname || !newUser.role) {
            throw new Error("Missing required fields");
        }
        const id = v7();
        const userData: UserSchemaType = {
            ...newUser,
            id,
            created_at: new Date(),
            updated_at: null,
            deleted_at: null,
        } as UserSchemaType;
        await useDrizzle().insert(users).values(userData);
        return id;
    }

    async update(changes: Partial<UserSchemaType>): Promise<void> {
        await useDrizzle()
            .update(users)
            .set(changes)
            .where(eq(users.id, this.id));
    }

    async delete(): Promise<void> {
        await useDrizzle()
            .update(users)
            .set({ deleted_at: new Date() })
            .where(eq(users.id, this.id));
    }
}

export default User;