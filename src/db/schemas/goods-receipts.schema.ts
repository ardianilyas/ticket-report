import { integer, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { purchaseOrders } from "./purchase-orders.schema";
import { user } from "./users.schema";
import { products } from "./products.schema";

export const goodsReceipts = pgTable("goods_receipts", {
  id: uuid("id").defaultRandom().primaryKey(),
  receiptNumber: text("receipt_number")
    .notNull()
    .unique(),
  purchaseOrderId: uuid("purchase_order_id")
    .notNull()
    .references(() => purchaseOrders.id),
  receivedBy: text("received_by")
    .notNull()
    .references(() => user.id),
  receivedDate: timestamp("received_date")
    .defaultNow()
    .notNull(),
  notes: text("notes"),
  createdAt: timestamp("created_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull()
});

export const goodsReceiptItems = pgTable(
  "goods_receipt_items",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    goodsReceiptId: uuid("goods_receipt_id")
      .notNull()
      .references(() => goodsReceipts.id, {
        onDelete: "cascade"
      }),
    productId: uuid("product_id")
      .notNull()
      .references(() => products.id),
    qtyReceived: integer("qty_received")
      .notNull()
  }
);