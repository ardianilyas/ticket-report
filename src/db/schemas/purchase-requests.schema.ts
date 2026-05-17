import { integer, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { purchaseRequestStatusEnum } from "./enums.schema";
import { user } from "./users.schema";
import { products } from "./products.schema";

export const purchaseRequests = pgTable("purchase_requests", {
  id: uuid("id").defaultRandom().primaryKey(),
  prNumber: text("pr_number")
    .notNull()
    .unique(),
  requestedBy: text("requested_by")
    .notNull()
    .references(() => user.id),
  approvedBy: text("approved_by").references(
    () => user.id
  ),
  status: purchaseRequestStatusEnum("status")
    .notNull()
    .default("draft"),
  rejectReason: text("reject_reason"),
  notes: text("notes"),
  requestDate: timestamp("request_date")
    .defaultNow()
    .notNull(),
  approvedAt: timestamp("approved_at"),
  createdAt: timestamp("created_at")
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull()
});

export const purchaseRequestItems = pgTable(
  "purchase_request_items",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    purchaseRequestId: uuid("purchase_request_id")
      .notNull()
      .references(() => purchaseRequests.id, {
        onDelete: "cascade"
      }),
    productId: uuid("product_id")
      .notNull()
      .references(() => products.id),
    qty: integer("qty").notNull(),
    notes: text("notes")
  }
);