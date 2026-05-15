import z from "zod";
import { PRODUCT_VALIDATION_MESSAGE } from "./product.const";

export const createProductDto = z.object({
  name: z.string().min(1, { error: PRODUCT_VALIDATION_MESSAGE.name.min }),
  description: z.string().min(1, { error: PRODUCT_VALIDATION_MESSAGE.description.min }),
  stock: z.number().min(1, { error: PRODUCT_VALIDATION_MESSAGE.stock.min }),
  unit: z.string().min(1, { error: PRODUCT_VALIDATION_MESSAGE.unit.min }),
  price: z.number().min(1, { error: PRODUCT_VALIDATION_MESSAGE.price.min }),
});
export const updateProductDto = createProductDto.partial();

export const getProductIdDto = z.uuid({ error: PRODUCT_VALIDATION_MESSAGE.id.uuid });

export type CreateProductDto = z.infer<typeof createProductDto>;
export type UpdateProductDto = z.infer<typeof updateProductDto>;
