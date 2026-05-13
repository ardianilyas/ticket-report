import { pgEnum } from "drizzle-orm/pg-core";

export const roleEnum = pgEnum("role", 
  ["admin", "staff", "purchasing", "manager", "warehouse"]
);

export const purchaseRequestStatusEnum = pgEnum("purchase_request_status", 
  ["draft", "pending", "approved", "rejected", "completed"]
);

export const purchaseOrderStatusEnum = pgEnum("purchase_order_status", 
  ["draft", "pending", "approved", "rejected", "completed"]
);