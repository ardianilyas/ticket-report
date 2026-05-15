import { Router } from "express";
import { ProductService } from "./product.service";
import { ProductController } from "./product.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { requireRole } from "../../middlewares/require-role";

const router = Router();

const productService = new ProductService();
const productController = new ProductController(productService);

router.use(authMiddleware, requireRole("admin", "purchasing", "warehouse"));

router.get("/", productController.getProducts);
router.get("/:id", productController.getProduct);
router.post("/", productController.createProduct);
router.put("/:id", productController.updateProduct);
router.delete("/:id", productController.deleteProduct);

export default router;