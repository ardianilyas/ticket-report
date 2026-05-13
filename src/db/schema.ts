import { relations } from "drizzle-orm";
import { pgTable, text, timestamp, boolean, index, pgEnum, uuid, numeric, integer } from "drizzle-orm/pg-core";

export const roleEnum = pgEnum("role", 
  ["admin", "staff", "purchasing", "manager", "warehouse"]
);

export const purchaseRequestStatusEnum = pgEnum("purchase_request_status", 
  ["draft", "pending", "approved", "rejected", "completed"]
);

export const purchaseOrderStatusEnum = pgEnum("purchase_order_status", 
  ["draft", "pending", "approved", "rejected", "completed"]
);

export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").default(false).notNull(),
  image: text("image"),
  role: roleEnum().default("staff"), 
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
});

export const session = pgTable(
  "session",
  {
    id: text("id").primaryKey(),
    expiresAt: timestamp("expires_at").notNull(),
    token: text("token").notNull().unique(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
    ipAddress: text("ip_address"),
    userAgent: text("user_agent"),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
  },
  (table) => [index("session_userId_idx").on(table.userId)],
);

export const account = pgTable(
  "account",
  {
    id: text("id").primaryKey(),
    accountId: text("account_id").notNull(),
    providerId: text("provider_id").notNull(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    accessToken: text("access_token"),
    refreshToken: text("refresh_token"),
    idToken: text("id_token"),
    accessTokenExpiresAt: timestamp("access_token_expires_at"),
    refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
    scope: text("scope"),
    password: text("password"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [index("account_userId_idx").on(table.userId)],
);

export const verification = pgTable(
  "verification",
  {
    id: text("id").primaryKey(),
    identifier: text("identifier").notNull(),
    value: text("value").notNull(),
    expiresAt: timestamp("expires_at").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [index("verification_identifier_idx").on(table.identifier)],
);

export const vendors = pgTable("vendors", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  address: text("address").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().$onUpdate(() => new Date()).notNull()
});

export const products = pgTable("products", {
  id: uuid("id").defaultRandom().primaryKey(),
  sku: text("sku").notNull().unique(),
  name: text("name").notNull(),
  description: text("description"),
  stock: integer("stock")
    .notNull()
    .default(0),
  unit: text("unit").notNull(),
  price: numeric("price", {
    precision: 12,
    scale: 2
  }).notNull(),
  createdAt: timestamp("created_at")
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull()
});

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

export const userRelations = relations(user, ({ many }) => ({
  sessions: many(session),
  accounts: many(account),
  purchaseRequests: many(purchaseRequests),
  approvedPurchaseRequests: many(purchaseRequests),
  purchaseOrders: many(purchaseOrders),
  goodsReceipts: many(goodsReceipts),
}));

export const vendorsRelations = relations(vendors, ({ many }) => ({
  purchaseOrders: many(purchaseOrders),
}));

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
