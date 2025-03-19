export class Timestamped {
    updated_at: Date | null;
    created_at: Date;
    deleted_at: Date | null;

    constructor(created_at: Date = new Date(),
                updated_at?: Date | null,
                deleted_at?: Date | null) {
        this.created_at = created_at;
        this.updated_at = updated_at || null;
        this.deleted_at = deleted_at || null;
    }

}

export default Timestamped;