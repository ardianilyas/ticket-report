import type { Request, Response } from "express";
import { asyncHandler } from "../../shared/utils/async-handler";
import type { PurchaseRequestService } from "./purchase-request.service";
import { validate } from "../../shared/utils/validate";
import { createPurchaseRequestDto } from "./purchase-request.dto";
import { sendSuccess } from "../../shared/utils/response";

export class PurchaseRequestController{
  constructor(private purchaseRequestService: PurchaseRequestService) {}

  createPurchaseRequest = asyncHandler(async(req: Request, res: Response) => {
    const data = validate(createPurchaseRequestDto, req.body);

    const userId = req.auth?.user.id as string;

    const purchaseRequest = await this.purchaseRequestService.create(data, userId);
  
    return sendSuccess(res, "Purchase request created successfully", purchaseRequest);
  })
}