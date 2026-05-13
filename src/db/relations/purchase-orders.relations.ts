import { relations } from "drizzle-orm";
import { purchaseOrderItems, purchaseOrders } from "../schemas/purchase-orders.schema";
import { purchaseRequests } from "../schemas/purchase-requests.schema";
import { vendors } from "../schemas/vendors.schema";
import { user } from "../schemas/users.schema";
import { goodsReceipts } from "../schemas/goods-receipts.schema";

export const purchaseOrdersRelations =
  relations(
    purchaseOrders,
    ({ one, many }) => ({
      purchaseRequest: one(
        purchaseRequests,
        {
          fields: [
            purchaseOrders.purchaseRequestId
          ],
          references: [purchaseRequests.id]
        }
      ),
      vendor: one(vendors, {
        fields: [purchaseOrders.vendorId],
        references: [vendors.id]
      }),
      creator: one(user, {
        fields: [purchaseOrders.createdBy],
        references: [user.id]
      }),
      items: many(purchaseOrderItems),
      goodsReceipts: many(goodsReceipts)
    })
  );