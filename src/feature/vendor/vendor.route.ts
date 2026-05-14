import { Router } from "express";
import { VendorService } from "./vendor.service";
import { VendorController } from "./vendor.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { requireRole } from "../../middlewares/require-role";

const router = Router();

const vendorService = new VendorService();
const vendorController = new VendorController(vendorService);

router.use(authMiddleware, requireRole("admin", "manager"));

router.get("/", vendorController.getVendors);
router.get("/:id", vendorController.getVendor);
router.post("/", vendorController.createVendor);
router.put("/:id", vendorController.updateVendor);
router.delete("/:id", vendorController.deleteVendor);

export default router;
