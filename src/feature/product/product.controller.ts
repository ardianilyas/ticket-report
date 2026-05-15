import type { Request, Response } from "express";
import { asyncHandler } from "../../shared/utils/async-handler";
import type { ProductService } from "./product.service";
import { sendSuccess } from "../../shared/utils/response";
import { validate } from "../../shared/utils/validate";
import { createProductDto, getProductIdDto } from "./product.dto";

export class ProductController{
  constructor(private productService: ProductService) {}

  getProducts = asyncHandler(async(_req: Request, res: Response) => {
    const products = await this.productService.getProducts();

    return sendSuccess(res, "Products fetched successfully", products);
  });

  getProduct = asyncHandler(async(req: Request, res: Response) => {
    const id = validate(getProductIdDto, req.params.id);

    const product = await this.productService.getProduct(id);

    return sendSuccess(res, "Product fetched successfully", product);
  });

  createProduct = asyncHandler(async(req: Request, res: Response) => {
    const data = validate(createProductDto, req.body);

    const product = await this.productService.createProduct(data);

    return sendSuccess(res, "Product created successfully", product);
  });

  updateProduct = asyncHandler(async(req: Request, res: Response) => {
    const id = validate(getProductIdDto, req.params.id);

    const data = validate(createProductDto, req.body);

    const product = await this.productService.updateProduct(id, data);

    return sendSuccess(res, "Product updated successfully", product);
  });

  deleteProduct = asyncHandler(async(req: Request, res: Response) => {
    const id = validate(getProductIdDto, req.params.id);

    await this.productService.deleteProduct(id);

    return sendSuccess(res, "Product deleted successfully");
  });
}