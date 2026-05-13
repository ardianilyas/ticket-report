import { relations } from "drizzle-orm";
import { goodsReceiptItems, goodsReceipts } from "../schemas/goods-receipts.schema";
import { purchaseOrders } from "../schemas/purchase-orders.schema";
import { user } from "../schemas/users.schema";
import { products } from "../schemas/products.schema";

export const goodsReceiptsRelations =
  relations(
    goodsReceipts,
    ({ one, many }) => ({
      purchaseOrder: one(
        purchaseOrders,
        {
          fields: [
            goodsReceipts.purchaseOrderId
          ],
          references: [purchaseOrders.id]
        }
      ),
      receiver: one(user, {
        fields: [goodsReceipts.receivedBy],
        references: [user.id]
      }),

      items: many(goodsReceiptItems)
    })
  );

export const goodsReceiptItemsRelations =
  relations(
    goodsReceiptItems,
    ({ one }) => ({
      goodsReceipt: one(
        goodsReceipts,
        {
          fields: [
            goodsReceiptItems.goodsReceiptId
          ],
          references: [goodsReceipts.id]
        }
      ),
      product: one(products, {
        fields: [goodsReceiptItems.productId],
        references: [products.id]
      })
    })
  );