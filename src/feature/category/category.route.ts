import { Router } from "express";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { requireRole } from "../../middlewares/require-role";
import { CategoryService } from "./category.service";
import { CategoryController } from "./category.controller";
import { CATEGORY_ROUTE } from "./category.constant";

const router = Router();
const categoryService = new CategoryService();
const categoryController = new CategoryController(categoryService);

router.use(authMiddleware, requireRole("admin"));

router.get(CATEGORY_ROUTE.GET_CATEGORIES, categoryController.getCategories);
router.get(CATEGORY_ROUTE.GET_CATEGORY, categoryController.getCategory);
router.post(CATEGORY_ROUTE.CREATE_CATEGORY, categoryController.createCategory);
router.put(CATEGORY_ROUTE.UPDATE_CATEGORY, categoryController.updateCategory);
router.delete(CATEGORY_ROUTE.DELETE_CATEGORY, categoryController.deleteCategory);

export default router;