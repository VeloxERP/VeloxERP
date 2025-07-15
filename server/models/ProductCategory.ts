import type { InferSelectModel, InferInsertModel } from "drizzle-orm";
import { productCategories } from "~/server/database/schema/product-categories.schema";
import { v7 } from "uuid";
import Entity from "~/server/models/util/Entity";
import { eq } from "drizzle-orm";
import { useDrizzle } from "~/server/utils/drizzle";

type ProductCategory = InferSelectModel<typeof productCategories>;
type NewProductCategory = InferInsertModel<typeof productCategories>;

export class ProductCategoryModel extends Entity implements ProductCategory {
    id: string;
    name: string;
    description: string | null;
    parentId: string | null;

    constructor(data: ProductCategory) {
        super(data.id, data.created_at, data.updated_at, data.deleted_at);
        this.id = data.id;
        this.name = data.name;
        this.description = data.description;
        this.parentId = data.parentId;
    }

    static async findById(id: string): Promise<ProductCategoryModel | null> {
        const result = await useDrizzle().query.productCategories.findFirst({
            where: eq(productCategories.id, id)
        });
        return result ? new ProductCategoryModel(result as ProductCategory) : null;
    }

    static async findByParentId(parentId: string): Promise<ProductCategoryModel[]> {
        const result = await useDrizzle().query.productCategories.findMany({
            where: eq(productCategories.parentId, parentId)
        });
        return result.map(category => new ProductCategoryModel(category as ProductCategory));
    }

    static async create(newCategory: Partial<NewProductCategory>): Promise<string> {
        if (!newCategory.name) {
            throw new Error("Missing required fields");
        }

        const id = v7();
        const categoryData = {
            id,
            name: newCategory.name,
            description: newCategory.description,
            parentId: newCategory.parentId,
            created_at: new Date(),
            updated_at: null,
            deleted_at: null,
        };

        await useDrizzle().insert(productCategories).values(categoryData);
        return id;
    }

    async update(changes: Partial<Omit<NewProductCategory, 'id' | 'created_at'>>): Promise<void> {
        await useDrizzle()
            .update(productCategories)
            .set(changes)
            .where(eq(productCategories.id, this.id));
    }

    async delete(): Promise<void> {
        await useDrizzle()
            .update(productCategories)
            .set({ deleted_at: new Date() })
            .where(eq(productCategories.id, this.id));
    }
}

export default ProductCategoryModel; 