import { relations } from "drizzle-orm";
import { account, session, user } from "../schemas/users.schema";
import { purchaseRequests } from "../schemas/purchase-requests.schema";
import { purchaseOrders } from "../schemas/purchase-orders.schema";
import { goodsReceipts } from "../schemas/goods-receipts.schema";

export const userRelations = relations(user, ({ many }) => ({
  sessions: many(session),
  accounts: many(account),
  purchaseRequests: many(purchaseRequests),
  approvedPurchaseRequests: many(purchaseRequests),
  purchaseOrders: many(purchaseOrders),
  goodsReceipts: many(goodsReceipts),
}));

export const sessionRelations = relations(session, ({ one }) => ({
  user: one(user, {
    fields: [session.userId],
    references: [user.id],
  }),
}));

export const accountRelations = relations(account, ({ one }) => ({
  user: one(user, {
    fields: [account.userId],
    references: [user.id],
  }),
}));