import { sql } from "drizzle-orm";
import { db } from "../../src/db";

export async function clearDb() {
  await db.execute(
    sql.raw(`
      TRUNCATE TABLE
        goods_receipt_items,
        goods_receipts,
        purchase_order_items,
        purchase_orders,
        purchase_request_items,
        purchase_requests,
        products,
        vendors
      RESTART IDENTITY
      CASCADE;
    `)
  );
}