import type { NextFunction, Request, Response } from "express";
import { asyncHandler } from "../../shared/utils/async-handler";
import type { VendorService } from "./vendor.service";
import { sendSuccess } from "../../shared/utils/response";
import { validate } from "../../shared/utils/validate";
import { createVendorDto, getVendorIdDto, updateVendorDto } from "./vendor.dto";

export class VendorController {
  constructor(private vendorService: VendorService) {}

  getVendors = asyncHandler(async (_req: Request, res: Response) => {
    const vendors = await this.vendorService.getVendors();

    return sendSuccess(res, "Vendors fetched successfully", vendors);
  });

  getVendor = asyncHandler(async (req: Request, res: Response) => {
    const id = validate(getVendorIdDto, req.params.id);

    const vendor = await this.vendorService.getVendor(id);

    return sendSuccess(res, "Vendor fetched successfully", vendor);
  });

  createVendor = asyncHandler(async (req: Request, res: Response) => {
    const data = validate(createVendorDto, req.body);

    const vendor = await this.vendorService.createVendor(data);

    return sendSuccess(res, "Vendor created successfully", vendor);
  });

  updateVendor = asyncHandler(async (req: Request, res: Response) => {
    const id = validate(getVendorIdDto, req.params.id);

    const data = validate(updateVendorDto, req.body);

    const vendor = await this.vendorService.updateVendor(id, data);

    return sendSuccess(res, "Vendor updated successfully", vendor);
  });

  deleteVendor = asyncHandler(async (req: Request, res: Response) => {
    const id = validate(getVendorIdDto, req.params.id);

    await this.vendorService.deleteVendor(id);

    return sendSuccess(res, "Vendor deleted successfully", []);
  });
}