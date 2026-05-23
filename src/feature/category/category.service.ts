import { eq } from "drizzle-orm";
import { db } from "../../db";
import { categories } from "../../db/schemas";
import { NotFoundError } from "../../errors/not-found";
import type { CreateCategoryDto } from "./category.dto";

export class CategoryService {
  async getCategories() {
    return await db.select().from(categories);
  }

  async getCategory(id: string) {
    const [category] = await db.select().from(categories).where(eq(categories.id, id));

    if (!category) {
      throw new NotFoundError("Category not found");
    }

    return category;
  }

  async createCategory(data: CreateCategoryDto) {
    const [category] = await db.insert(categories).values(data).returning();

    return category;
  }

  async updateCategory(id: string, data: Partial<CreateCategoryDto>) {
    const [category] = await db
      .update(categories)
      .set(data)
      .where(eq(categories.id, id))
      .returning();

    if (!category) {
      throw new NotFoundError("Category not found");
    }

    return category;
  }

  async deleteCategory(id: string) {
    const [category] = await db.delete(categories).where(eq(categories.id, id)).returning();

    if (!category) {
      throw new NotFoundError("Category not found");
    }

    return category;
  }
}