import { eq } from "drizzle-orm/expressions";
import type { PropertyValue as PropertyValueSchemaType } from "~/server/database/schema/product-properties.schema";
import { propertyValues } from "~/server/database/schema/product-properties.schema";
import { v7 } from "uuid";
import Entity from "~/server/models/util/Entity";

export class PropertyValue extends Entity implements PropertyValueSchemaType {
    propertyId: string;
    value: string;
    displayName: string | null;
    position: number;
    colorCode: string | null;

    constructor(data: PropertyValueSchemaType) {
        super(data.id, data.created_at, data.updated_at, data.deleted_at);
        this.propertyId = data.propertyId;
        this.value = data.value;
        this.displayName = data.displayName;
        this.position = typeof data.position === 'number' ? data.position : 0;
        this.colorCode = data.colorCode;
    }

    static async findById(id: string): Promise<PropertyValue | null> {
        const result = await useDrizzle().select().from(propertyValues).where(eq(propertyValues.id, id));
        return result.length ? new PropertyValue(result[0]) : null;
    }

    static async findByPropertyId(propertyId: string): Promise<PropertyValue[]> {
        const result = await useDrizzle().select().from(propertyValues).where(eq(propertyValues.propertyId, propertyId));
        return result.map(value => new PropertyValue(value));
    }

    static async create(newValue: Partial<PropertyValueSchemaType>): Promise<string> {
        if (!newValue.propertyId || !newValue.value) {
            throw new Error("Missing required fields");
        }

        const id = v7();
        const valueData = {
            id,
            propertyId: newValue.propertyId,
            value: newValue.value,
            displayName: newValue.displayName,
            position: typeof newValue.position === 'number' ? newValue.position : 0,
            colorCode: newValue.colorCode,
            created_at: new Date(),
            updated_at: null,
            deleted_at: null,
        };

        await useDrizzle().insert(propertyValues).values(valueData);
        return id;
    }

    async update(changes: Partial<Omit<PropertyValueSchemaType, 'id' | 'created_at'>>): Promise<void> {
        await useDrizzle()
            .update(propertyValues)
            .set(changes)
            .where(eq(propertyValues.id, this.id));
    }

    async delete(): Promise<void> {
        await useDrizzle()
            .update(propertyValues)
            .set({ deleted_at: new Date() })
            .where(eq(propertyValues.id, this.id));
    }
}

export default PropertyValue; 