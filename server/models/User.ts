// /server/models/User.ts
import {eq} from "drizzle-orm/expressions";
import {User as UserType} from "#server/database/schema";
import {users} from "#server/database/schema";

export class User extends UserType {
    id: string;
    username: string;
    email: string;
    password: string;

    constructor(data: UserType) {
        super();

        this.id = data.id;
        this.username = data.username;
        this.email = data.email;
        this.password = data.password;
    }

    static async findById(id: string): Promise<User | null> {
        const result = await useDrizzle().select().from(users).where(eq(users.id, id));
        return result.length ? new User(result[0]) : null;
    }

    static async create(newUser: Partial<UserType>): Promise<User> {
        const result = await useDrizzle().insert(users).values(newUser).returning();
        return new User(result[0]);
    }

    async update(changes: Partial<UserType>): Promise<void> {
        await useDrizzle().update(users).set(changes).where(eq(users.id, this.id));
    }
}
