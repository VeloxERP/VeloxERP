import { eq } from "drizzle-orm/expressions";
import type { VariantPropertyValue as VariantPropertyValueSchemaType } from "~/server/database/schema/product-property-associations.schema";
import { variantPropertyValues } from "~/server/database/schema/product-property-associations.schema";
import { v7 } from "uuid";
import Entity from "~/server/models/util/Entity";

export class VariantPropertyValue extends Entity implements VariantPropertyValueSchemaType {
    variantId: string;
    propertyId: string;
    valueId: string;
    isLinked: boolean | null;
    customValue: string | null;

    constructor(data: VariantPropertyValueSchemaType) {
        super(data.id, data.created_at, data.updated_at, data.deleted_at);
        this.variantId = data.variantId;
        this.propertyId = data.propertyId;
        this.valueId = data.valueId;
        this.isLinked = data.isLinked;
        this.customValue = data.customValue;
    }

    static async findById(id: string): Promise<VariantPropertyValue | null> {
        const result = await useDrizzle().select().from(variantPropertyValues).where(eq(variantPropertyValues.id, id));
        return result.length ? new VariantPropertyValue(result[0] as VariantPropertyValueSchemaType) : null;
    }

    static async findByVariantId(variantId: string): Promise<VariantPropertyValue[]> {
        const result = await useDrizzle().select().from(variantPropertyValues).where(eq(variantPropertyValues.variantId, variantId));
        return result.map(value => new VariantPropertyValue(value as VariantPropertyValueSchemaType));
    }

    static async findByPropertyId(propertyId: string): Promise<VariantPropertyValue[]> {
        const result = await useDrizzle().select().from(variantPropertyValues).where(eq(variantPropertyValues.propertyId, propertyId));
        return result.map(value => new VariantPropertyValue(value as VariantPropertyValueSchemaType));
    }

    static async create(newValue: Partial<VariantPropertyValueSchemaType>): Promise<string> {
        if (!newValue.variantId || !newValue.propertyId || !newValue.valueId) {
            throw new Error("Missing required fields");
        }

        const id = v7();
        const valueData = {
            id,
            variantId: newValue.variantId,
            propertyId: newValue.propertyId,
            valueId: newValue.valueId,
            isLinked: newValue.isLinked ?? true,
            customValue: newValue.customValue,
            created_at: new Date(),
            updated_at: null,
            deleted_at: null,
        };

        await useDrizzle().insert(variantPropertyValues).values(valueData);
        return id;
    }

    async update(changes: Partial<Omit<VariantPropertyValueSchemaType, 'id' | 'created_at'>>): Promise<void> {
        await useDrizzle()
            .update(variantPropertyValues)
            .set(changes)
            .where(eq(variantPropertyValues.id, this.id));
    }

    async delete(): Promise<void> {
        await useDrizzle()
            .update(variantPropertyValues)
            .set({ deleted_at: new Date() })
            .where(eq(variantPropertyValues.id, this.id));
    }
}

export default VariantPropertyValue; 