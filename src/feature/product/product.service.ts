import { desc, eq } from "drizzle-orm";
import { db } from "../../db";
import { products } from "../../db/schemas";
import { NotFoundError } from "../../errors/not-found";
import { PRODUCT_NOT_FOUND } from "./product.const";
import type { CreateProductDto, UpdateProductDto } from "./product.dto";
import { generateSku } from "../../shared/utils/generate-sku";

export class ProductService {
  async getProducts() {
    return await db.select().from(products);
  }

  async getProduct(id: string) {
    const [product] = await db.select().from(products).where(eq(products.id, id));

    if(!product) {
      throw new NotFoundError(PRODUCT_NOT_FOUND);
    }

    return product;
  }

  async createProduct(data: CreateProductDto) {
    const sku = generateSku(await this.getLasProductNumber());

    return await db.insert(products).values({ ...data, sku }).returning();
  }

  async updateProduct(id: string, data: UpdateProductDto) {
    const [updatedProduct] = await db.update(products).set(data).where(eq(products.id, id)).returning();

    if(!updatedProduct) {
      throw new NotFoundError(PRODUCT_NOT_FOUND);
    }

    return updatedProduct;
  }

  async deleteProduct(id: string) {
    const deletedProduct = await db.delete(products).where(eq(products.id, id)).returning();

    if(deletedProduct.length === 0) {
      throw new NotFoundError(PRODUCT_NOT_FOUND);
    }

    return;
  }

  private async getLasProductNumber() {
    const [lastProduct] = await db.select().from(products).orderBy(desc(products.createdAt)).limit(1);

    return lastProduct ? Number(lastProduct.sku.split("-")[1]) : 0;
  }
}