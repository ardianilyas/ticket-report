import { integer, numeric, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { purchaseRequests } from "./purchase-requests.schema";
import { vendors } from "./vendors.schema";
import { user } from "./users.schema";
import { purchaseOrderStatusEnum } from "./enums.schema";
import { products } from "./products.schema";

export const purchaseOrders = pgTable("purchase_orders", {
  id: uuid("id").defaultRandom().primaryKey(),
  poNumber: text("po_number")
    .notNull()
    .unique(),
  purchaseRequestId: uuid("purchase_request_id")
    .notNull()
    .references(() => purchaseRequests.id),
  vendorId: uuid("vendor_id")
    .notNull()
    .references(() => vendors.id),
  createdBy: text("created_by")
    .notNull()
    .references(() => user.id),
  status: purchaseOrderStatusEnum("status")
    .notNull()
    .default("draft"),
  orderDate: timestamp("order_date")
    .defaultNow()
    .notNull(),
  notes: text("notes"),
  createdAt: timestamp("created_at")
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull()
});

export const purchaseOrderItems = pgTable(
  "purchase_order_items",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    purchaseOrderId: uuid("purchase_order_id")
      .notNull()
      .references(() => purchaseOrders.id, {
        onDelete: "cascade"
      }),
    productId: uuid("product_id")
      .notNull()
      .references(() => products.id),
    qty: integer("qty").notNull(),
    price: numeric("price", {
      precision: 12,
      scale: 2
    }).notNull(),
    subtotal: numeric("subtotal", {
      precision: 12,
      scale: 2
    }).notNull()
  }
);