import { relations } from "drizzle-orm";
import { purchaseRequestItems, purchaseRequests } from "../schemas/purchase-requests.schema";
import { user } from "../schemas/users.schema";
import { purchaseOrders } from "../schemas/purchase-orders.schema";
import { products } from "../schemas/products.schema";

export const purchaseRequestsRelations =
  relations(
    purchaseRequests,
    ({ one, many }) => ({
      requester: one(user, {
        fields: [purchaseRequests.requestedBy],
        references: [user.id]
      }),
      approver: one(user, {
        fields: [purchaseRequests.approvedBy],
        references: [user.id]
      }),
      items: many(purchaseRequestItems),
      purchaseOrders: many(purchaseOrders)
    })
  );

  export const purchaseRequestItemsRelations =
  relations(
    purchaseRequestItems,
    ({ one }) => ({
      purchaseRequest: one(
        purchaseRequests,
        {
          fields: [
            purchaseRequestItems.purchaseRequestId
          ],
          references: [purchaseRequests.id]
        }
      ),
      product: one(products, {
        fields: [purchaseRequestItems.productId],
        references: [products.id]
      })
    })
  );