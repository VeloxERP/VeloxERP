import Timestamped from "~~/server/models/util/Timestamped";

export abstract class Entity extends Timestamped {
    id: string;

    constructor(id: string, createdAt: Date, updatedAt?: Date | null, deletedAt?: Date | null) {
        super(createdAt, updatedAt, deletedAt);
        this.id = id;
    }

    save() {
        
    }

    abstract load(id: string): Entity;
    abstract getTableName(): string;
}
export default Entity;