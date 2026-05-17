import { Router } from "express";
import { PurchaseRequestService } from "./purchase-request.service";
import { PurchaseRequestController } from "./purchase-request.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { requireRole } from "../../middlewares/require-role";

const router = Router();

const purchaseRequestService = new PurchaseRequestService();
const purchaseRequestController = new PurchaseRequestController(purchaseRequestService);

router.use(authMiddleware, requireRole("admin", "purchasing"));

router.post("/", purchaseRequestController.createPurchaseRequest);

export default router;