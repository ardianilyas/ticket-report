import { Router } from "express";
import vendorRoute from "../feature/vendor/vendor.route";

const router = Router();

router.use("/vendors", vendorRoute);

export default router;