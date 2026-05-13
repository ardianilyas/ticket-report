import { relations } from "drizzle-orm";
import { products } from "../schemas/products.schema";
import { purchaseRequestItems } from "../schemas/purchase-requests.schema";
import { purchaseOrderItems } from "../schemas/purchase-orders.schema";
import { goodsReceiptItems } from "../schemas/goods-receipts.schema";

export const productsRelations = relations(
  products,
  ({ many }) => ({
    purchaseRequestItems: many(
      purchaseRequestItems
    ),
    purchaseOrderItems: many(
      purchaseOrderItems
    ),
    goodsReceiptItems: many(
      goodsReceiptItems
    )
  })
);