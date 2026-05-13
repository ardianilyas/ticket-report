import { relations } from "drizzle-orm";
import { vendors } from "../schemas/vendors.schema";
import { purchaseOrders } from "../schemas/purchase-orders.schema";

export const vendorsRelations = relations(vendors, ({ many }) => ({
  purchaseOrders: many(purchaseOrders),
}));