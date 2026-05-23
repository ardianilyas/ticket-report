import type { Request, Response } from "express";
import { asyncHandler } from "../../shared/utils/async-handler";
import type { CategoryService } from "./category.service";
import { sendSuccess } from "../../shared/utils/response";
import { validate } from "../../shared/utils/validate";
import { createCategorySchema, getCategorySchema, updateCategorySchema } from "./category.dto";

export class CategoryController {
  constructor(private categoryService: CategoryService) {}

  getCategories = asyncHandler(async(req: Request, res: Response) => {
    const categories = await this.categoryService.getCategories();

    return sendSuccess(res, "Categories fetched successfully", categories)
  });

  getCategory = asyncHandler(async(req: Request, res: Response) => {
    const id = validate(getCategorySchema, req.params.id);

    const category = await this.categoryService.getCategory(id);

    return sendSuccess(res, "Category fetched successfully", category);
  });

  createCategory = asyncHandler(async(req: Request, res: Response) => {
    const data = validate(createCategorySchema, req.body);

    const category = await this.categoryService.createCategory(data);

    return sendSuccess(res, "Category created successfully", category);
  });

  updateCategory = asyncHandler(async(req: Request, res: Response) => {
    const id = validate(getCategorySchema, req.params.id);
    const data = validate(updateCategorySchema, req.body);

    const category = await this.categoryService.updateCategory(id, data);

    return sendSuccess(res, "Category updated successfully", category);
  });

  deleteCategory = asyncHandler(async(req: Request, res: Response) => {
    const id = validate(getCategorySchema, req.params.id);

    const category = await this.categoryService.deleteCategory(id);

    return sendSuccess(res, "Category deleted successfully", category);
  });
}