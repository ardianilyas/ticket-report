import { integer, numeric, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

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
    scale: 2,
    mode: "number"
  }).notNull(),
  createdAt: timestamp("created_at")
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull()
});