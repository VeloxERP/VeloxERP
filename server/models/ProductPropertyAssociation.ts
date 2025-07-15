import { eq } from "drizzle-orm/expressions";
import type { ProductPropertyAssociation as ProductPropertyAssociationSchemaType } from "~/server/database/schema/product-property-associations.schema";
import { productPropertyAssociations } from "~/server/database/schema/product-property-associations.schema";
import { v7 } from "uuid";
import Entity from "~/server/models/util/Entity";

export class ProductPropertyAssociation extends Entity implements ProductPropertyAssociationSchemaType {
    productId: string;
    propertyId: string;

    constructor(data: ProductPropertyAssociationSchemaType) {
        super(data.id, data.created_at, data.updated_at, data.deleted_at);
        this.productId = data.productId;
        this.propertyId = data.propertyId;
    }

    static async findById(id: string): Promise<ProductPropertyAssociation | null> {
        const result = await useDrizzle().select().from(productPropertyAssociations).where(eq(productPropertyAssociations.id, id));
        return result.length ? new ProductPropertyAssociation(result[0] as ProductPropertyAssociationSchemaType) : null;
    }

    static async findByProductId(productId: string): Promise<ProductPropertyAssociation[]> {
        const result = await useDrizzle().select().from(productPropertyAssociations).where(eq(productPropertyAssociations.productId, productId));
        return result.map(association => new ProductPropertyAssociation(association as ProductPropertyAssociationSchemaType));
    }

    static async findByPropertyId(propertyId: string): Promise<ProductPropertyAssociation[]> {
        const result = await useDrizzle().select().from(productPropertyAssociations).where(eq(productPropertyAssociations.propertyId, propertyId));
        return result.map(association => new ProductPropertyAssociation(association as ProductPropertyAssociationSchemaType));
    }

    static async create(newAssociation: Partial<ProductPropertyAssociationSchemaType>): Promise<string> {
        if (!newAssociation.productId || !newAssociation.propertyId) {
            throw new Error("Missing required fields");
        }

        const id = v7();
        const associationData = {
            id,
            productId: newAssociation.productId,
            propertyId: newAssociation.propertyId,
            created_at: new Date(),
            updated_at: null,
            deleted_at: null,
        };

        await useDrizzle().insert(productPropertyAssociations).values(associationData);
        return id;
    }

    async update(changes: Partial<Omit<ProductPropertyAssociationSchemaType, 'id' | 'created_at'>>): Promise<void> {
        await useDrizzle()
            .update(productPropertyAssociations)
            .set(changes)
            .where(eq(productPropertyAssociations.id, this.id));
    }

    async delete(): Promise<void> {
        await useDrizzle()
            .update(productPropertyAssociations)
            .set({ deleted_at: new Date() })
            .where(eq(productPropertyAssociations.id, this.id));
    }
}

export default ProductPropertyAssociation; 