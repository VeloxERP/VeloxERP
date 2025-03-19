// /server/models/User.ts
import {eq} from "drizzle-orm/expressions";
import type {UserSchemaType} from "~/server/database/schema";
import {users} from "~/server/database/schema";
import {v7} from "uuid";
import Entity from "~/server/models/util/Entity";
import {rolesSchema, RolesSchemaType} from "~/server/database/schema/roles.schema";

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
        super(data.id, data.createdAt, data.updatedAt, data.deletedAt);
        this.username = data.username;
        this.email = data.email;
        this.password = data.password;
        this.dateOfBirth = data.dateOfBirth;
        this.firstname = data.firstname;
        this.lastname = data.lastname;
        this.address_id = data.address_id;
        this.role = data.role;
    }

    //TODO???
    private constructor(data: {user: UserSchemaType, role: RolesSchemaType }) {
        super();
    }

    static async findById(id: string): Promise<User | null> {
        const result = await useDrizzle().select().from(users).where(eq(users.id, id));
        return result.length ? new User(result[0]) : null;
    }

    static async findByUsername(username: string): Promise<User | null> {
        return new Promise<User>(async (resolve, reject) => {
            const result = await useDrizzle()
                .select()
                .from(users)
                .where(eq(users.username, username))
                .leftJoin(rolesSchema, eq(users.role, rolesSchema.name));
            if (result.length) {
                resolve(new User(result[0])); //fixme ahhhh!!!
            }
            reject("User not found");
        })
    }

    static async create(newUser: Partial<UserSchemaType>): Promise<String> {
        newUser.id = v7();
        return new Promise<String>(async (resolve, reject) => {
            let utest = await useDrizzle().select({id: users.id})
                .from(users)
                .where(or(
                    eq(users.username, newUser.username),
                    eq(users.email, newUser.email),
                    eq(users.id, newUser.id)
                ));

            if (utest.length === 0) {
                useDrizzle().insert(users).values(newUser)
                    // .onDuplicateKeyUpdate({})
                    .then((result) => {
                        resolve(newUser.id);
                    }).catch((err) => {
                    reject(err);
                });
            } else {
                reject("Is a user already");
            }
        });
    }

    async update(changes: Partial<UserSchemaType>): Promise<void> {
        await useDrizzle().update(users).set(changes).where(eq(users.id, this.id));
    }
}

export default User;