import z from "zod";
import type { categories } from "../../db/schemas";

export type Categories = typeof categories.$inferSelect;

export const createCategorySchema = z.object({
  title: z.string().min(1, { error: "Title is required" }),
  description: z.string().min(1, { error: "Description is required" }),
  isActive: z.boolean().default(true),
});

export const getCategorySchema = z.uuid({ error: "Invalid category id format" });

export const updateCategorySchema = createCategorySchema.partial();

export type CreateCategoryDto = z.infer<typeof createCategorySchema>;
export type UpdateCategoryDto = z.infer<typeof updateCategorySchema>;
