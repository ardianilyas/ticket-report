import { describe, expect, it } from "vitest";
import request from "supertest";
import app from "../../server";
import { authenticate } from "../../../tests/helpers/auth.helper";
import { products } from "../../db/schemas";
import { db } from "../../db";

describe("Purchase Request endpoint test", () => {
  describe("POST /purchase-requests", () => {
    it("should return 401 unauthorized", async() => {
      const response = await request(app).post("/api/purchase-requests");
  
      expect(response.status).toBe(401);
      expect(response.body.message).toBe("Unauthorized");
    });

    it("should return 403 forbidden", async() => {
      const auth = await authenticate();
  
      const response = await auth.agent.post("/api/purchase-requests");
  
      expect(response.status).toBe(403);
      expect(response.body.message).toBe("Forbidden");
    });

    it("should return 400 when body is empty", async() => {
      const auth = await authenticate("admin");
  
      const response = await auth.agent.post("/api/purchase-requests").send({});
  
      expect(response.status).toBe(400);
      expect(response.body.message).toBe("Validation Error");
      expect(response.body.errors).toBeInstanceOf(Object);
    });

    it("should return 200 when data is valid", async() => {
      const auth = await authenticate("admin");

      const product = await db
      .insert(products)
      .values([
        {
          sku: "PRD-00001",
          name: "Laptop",
          unit: "pcs",
          price: 10000000
        },
        {
          sku: "PRD-00002",
          name: "Mouse",
          unit: "pcs",
          price: 1000000
        }
      ])
      .returning();

      if(product.length === 0) throw new Error("Product not created");
  
      const response = await auth.agent.post("/api/purchase-requests").send({
        notes: "Need office laptop",
        items: [
          {
            productId: product[0]?.id,
            qty: 1
          },
          {
            productId: product[1]?.id,
            qty: 2
          }
        ]
      });
  
      expect(response.status).toBe(200);
      expect(response.body.message).toBe("Purchase request created successfully");
      expect(response.body.data).toBeInstanceOf(Object);
    });
  })
});