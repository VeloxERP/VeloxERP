import { eq } from "drizzle-orm/expressions";
import type { ProductProperty as ProductPropertySchemaType } from "~/server/database/schema/product-properties.schema";
import { productProperties } from "~/server/database/schema/product-properties.schema";
import { v7 } from "uuid";
import Entity from "~/server/models/util/Entity";

export class ProductProperty extends Entity implements ProductPropertySchemaType {
    name: string;
    code: string;
    type: "select" | "color" | "text" | "number" | "boolean";
    description: string | null;

    constructor(data: ProductPropertySchemaType) {
        super(data.id, data.created_at, data.updated_at, data.deleted_at);
        this.name = data.name;
        this.code = data.code;
        this.type = data.type;
        this.description = data.description;
    }

    static async findById(id: string): Promise<ProductProperty | null> {
        const result = await useDrizzle().select().from(productProperties).where(eq(productProperties.id, id));
        return result.length ? new ProductProperty(result[0]) : null;
    }

    static async findByCode(code: string): Promise<ProductProperty | null> {
        const result = await useDrizzle().select().from(productProperties).where(eq(productProperties.code, code));
        return result.length ? new ProductProperty(result[0]) : null;
    }

    static async create(newProperty: Partial<ProductPropertySchemaType>): Promise<string> {
        if (!newProperty.name || !newProperty.code || !newProperty.type) {
            throw new Error("Missing required fields");
        }

        const id = v7();
        const propertyData = {
            id,
            name: newProperty.name,
            code: newProperty.code,
            type: newProperty.type,
            description: newProperty.description,
            created_at: new Date(),
            updated_at: null,
            deleted_at: null,
        };

        await useDrizzle().insert(productProperties).values(propertyData);
        return id;
    }

    async update(changes: Partial<Omit<ProductPropertySchemaType, 'id' | 'created_at'>>): Promise<void> {
        await useDrizzle()
            .update(productProperties)
            .set(changes)
            .where(eq(productProperties.id, this.id));
    }

    async delete(): Promise<void> {
        await useDrizzle()
            .update(productProperties)
            .set({ deleted_at: new Date() })
            .where(eq(productProperties.id, this.id));
    }
}

export default ProductProperty; 