import type { InferSelectModel, InferInsertModel } from "drizzle-orm";
import { products } from "~/server/database/schema/products.schema";
import { v7 } from "uuid";
import Entity from "~/server/models/util/Entity";
import { eq } from "drizzle-orm";
import { useDrizzle } from "~/server/utils/drizzle";

type Product = InferSelectModel<typeof products>;
type NewProduct = InferInsertModel<typeof products>;

export class ProductModel extends Entity implements Product {
    id: string;
    sku: string;
    name: string;
    description: string | null;
    categoryId: string | null;
    price: string;
    cost: string | null;
    quantity: number;
    minQuantity: number;
    maxQuantity: number | null;
    isActive: boolean;

    constructor(data: Product) {
        super(data.id, data.created_at, data.updated_at, data.deleted_at);
        this.id = data.id;
        this.sku = data.sku;
        this.name = data.name;
        this.description = data.description;
        this.categoryId = data.categoryId;
        this.price = data.price;
        this.cost = data.cost;
        this.quantity = data.quantity;
        this.minQuantity = data.minQuantity;
        this.maxQuantity = data.maxQuantity;
        this.isActive = data.isActive;
    }

    static async findById(id: string): Promise<ProductModel | null> {
        const result = await useDrizzle().query.products.findFirst({
            where: eq(products.id, id)
        });
        return result ? new ProductModel(result as Product) : null;
    }

    static async findBySku(sku: string): Promise<ProductModel | null> {
        const result = await useDrizzle().query.products.findFirst({
            where: eq(products.sku, sku)
        });
        return result ? new ProductModel(result as Product) : null;
    }

    static async create(newProduct: Partial<NewProduct>): Promise<string> {
        if (!newProduct.name || !newProduct.sku || !newProduct.price) {
            throw new Error("Missing required fields");
        }

        const id = v7();
        const productData = {
            id,
            sku: newProduct.sku,
            name: newProduct.name,
            description: newProduct.description,
            categoryId: newProduct.categoryId,
            price: newProduct.price,
            cost: newProduct.cost,
            quantity: newProduct.quantity ?? 0,
            minQuantity: newProduct.minQuantity ?? 0,
            maxQuantity: newProduct.maxQuantity,
            isActive: newProduct.isActive ?? true,
            created_at: new Date(),
            updated_at: null,
            deleted_at: null,
        };

        await useDrizzle().insert(products).values(productData);
        return id;
    }

    async update(changes: Partial<Omit<NewProduct, 'id' | 'created_at'>>): Promise<void> {
        await useDrizzle()
            .update(products)
            .set(changes)
            .where(eq(products.id, this.id));
    }

    async delete(): Promise<void> {
        await useDrizzle()
            .update(products)
            .set({ deleted_at: new Date() })
            .where(eq(products.id, this.id));
    }
}

export default ProductModel; 