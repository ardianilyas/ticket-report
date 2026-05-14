import { afterEach } from "vitest";
import { clearDb } from "./helpers/clear-db";

afterEach(async () => {
  await clearDb();
});
