import { Router } from "express";
import vendorRoute from "../feature/vendor/vendor.route";
import productRoute from "../feature/product/product.route";
import purchaseRequestRoute from "../feature/purchase-request/purchase-request.route";

const router = Router();

router.use("/vendors", vendorRoute);
router.use("/products", productRoute);
router.use("/purchase-requests", purchaseRequestRoute);

export default router;