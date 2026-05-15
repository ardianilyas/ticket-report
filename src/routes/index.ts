import { Router } from "express";
import vendorRoute from "../feature/vendor/vendor.route";
import productRoute from "../feature/product/product.route";

const router = Router();

router.use("/vendors", vendorRoute);
router.use("/products", productRoute);

export default router;