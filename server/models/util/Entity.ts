import Timestamped from "~/server/models/util/Timestamped";

export class Entity extends Timestamped {
    id: string;

    constructor(id: string, createdAt: Date, updatedAt?: Date | null, deletedAt?: Date | null) {
        super(createdAt, updatedAt, deletedAt);
        this.id = id;
    }
}
export default Entity;