import type { InferSelectModel, InferInsertModel } from "drizzle-orm";
import { productVariants, type InheritableField, INHERITABLE_FIELDS } from "~/server/database/schema/product-variants.schema";
import { v7 } from "uuid";
import Entity from "~/server/models/util/Entity";
import { eq } from "drizzle-orm";
import { useDrizzle } from "~/server/utils/drizzle";

type ProductVariant = InferSelectModel<typeof productVariants>;
type NewProductVariant = InferInsertModel<typeof productVariants>;

export class ProductVariantModel extends Entity implements ProductVariant {
    id: string;
    productId: string;
    name: string | null;
    description: string | null;
    productNumber: string;
    price: string | null;
    cost: string | null;
    quantity: number;
    attributes: Record<string, string>;
    inheritedFields: InheritableField[];

    constructor(data: ProductVariant) {
        super(data.id, data.created_at, data.updated_at, data.deleted_at);
        this.id = data.id;
        this.productId = data.productId;
        this.name = data.name;
        this.description = data.description;
        this.productNumber = data.productNumber;
        this.price = data.price;
        this.cost = data.cost;
        this.quantity = data.quantity;
        this.attributes = data.attributes ?? {};
        this.inheritedFields = data.inheritedFields ?? [...INHERITABLE_FIELDS];
    }

    static async findById(id: string): Promise<ProductVariantModel | null> {
        const result = await useDrizzle().query.productVariants.findFirst({
            where: eq(productVariants.id, id)
        });
        return result ? new ProductVariantModel(result as ProductVariant) : null;
    }

    static async findByProductNumber(productNumber: string): Promise<ProductVariantModel | null> {
        const result = await useDrizzle().query.productVariants.findFirst({
            where: eq(productVariants.productNumber, productNumber)
        });
        return result ? new ProductVariantModel(result as ProductVariant) : null;
    }

    static async findByProductId(productId: string): Promise<ProductVariantModel[]> {
        const result = await useDrizzle().query.productVariants.findMany({
            where: eq(productVariants.productId, productId)
        });
        return result.map(variant => new ProductVariantModel(variant as ProductVariant));
    }

    static async create(newVariant: Partial<NewProductVariant>): Promise<string> {
        if (!newVariant.productId || !newVariant.productNumber) {
            throw new Error("Missing required fields");
        }

        const id = v7();
        const variantData = {
            id,
            productId: newVariant.productId,
            name: newVariant.name,
            description: newVariant.description,
            productNumber: newVariant.productNumber,
            price: newVariant.price,
            cost: newVariant.cost,
            quantity: newVariant.quantity ?? 0,
            attributes: newVariant.attributes ?? {},
            inheritedFields: newVariant.inheritedFields ?? [...INHERITABLE_FIELDS],
            created_at: new Date(),
            updated_at: null,
            deleted_at: null,
        };

        await useDrizzle().insert(productVariants).values(variantData);
        return id;
    }

    async update(changes: Partial<Omit<NewProductVariant, 'id' | 'created_at'>>): Promise<void> {
        await useDrizzle()
            .update(productVariants)
            .set(changes)
            .where(eq(productVariants.id, this.id));
    }

    async delete(): Promise<void> {
        await useDrizzle()
            .update(productVariants)
            .set({ deleted_at: new Date() })
            .where(eq(productVariants.id, this.id));
    }
}

export default ProductVariantModel; 