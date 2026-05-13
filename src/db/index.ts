import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import { env } from "../config/env";
import * as schemas from "../db/schemas";
import * as relations from "../db/relations";

const pool = new pg.Pool({
  connectionString: env.DATABASE_URL,
});

export const db = drizzle(pool, {
  schema: {
    ...schemas,
    ...relations
  }
});