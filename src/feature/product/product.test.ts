import { beforeEach, describe, expect, it } from "vitest";
import { db } from "../../db";
import { products } from "../../db/schemas";
import request from "supertest";
import app from "../../server";
import { PRODUCT_NOT_FOUND, PRODUCT_ROUTE_TEST } from "./product.const";
import { authenticate } from "../../../tests/helpers/auth.helper";

let productId: string;

describe("Product endpoint test", () => {
  beforeEach(async () => {
    const [product] = await db.insert(products).values({
      name: "Product 1",
      price: 100,
      unit: "pcs",
      sku: "sku-1",
      description: "Product 1 description",
      stock: 100
    }).returning({ id: products.id });

    if(!product) throw new Error("Product not created");

    productId = product.id;
  })
  describe("GET /products", () => {
    it("should return 401 unauthorized for guest", async() => {
      const response = await request(app).get(PRODUCT_ROUTE_TEST.GET_PRODUCTS);

      expect(response.status).toBe(401);
      expect(response.body.message).toBe("Unauthorized");
    });

    it("should return 403 forbidden for invalid role", async() => {
      const auth = await authenticate();

      const response = await auth.agent.get(PRODUCT_ROUTE_TEST.GET_PRODUCTS);

      expect(response.status).toBe(403);
      expect(response.body.message).toBe("Forbidden");
    });

    it("should return 200 when admin access endpoint", async() => {
      const auth = await authenticate("admin");

      const response = await auth.agent.get(PRODUCT_ROUTE_TEST.GET_PRODUCTS);

      expect(response.status).toBe(200);
      expect(response.body.message).toBe("Products fetched successfully");
      expect(response.body.data).toBeInstanceOf(Array);
    });
  })

  describe("GET /products/:id", () => {
    it("should return 401 unauthorized for guest", async() => {
      const response = await request(app).get(PRODUCT_ROUTE_TEST.GET_PRODUCT(productId));

      expect(response.status).toBe(401);
      expect(response.body.message).toBe("Unauthorized");
    });

    it("should return 403 forbidden for invalid role", async() => {
      const auth = await authenticate();

      const response = await auth.agent.get(PRODUCT_ROUTE_TEST.GET_PRODUCT(productId));

      expect(response.status).toBe(403);
      expect(response.body.message).toBe("Forbidden");
    });

    it("should return 400 for invalid id format", async() => {
      const auth = await authenticate("admin");

      const response = await auth.agent.get(PRODUCT_ROUTE_TEST.GET_PRODUCT("invalid-id"));

      expect(response.status).toBe(400);
      expect(response.body.errors).toBeInstanceOf(Array);
    });

    it("should return 200 when admin access endpoint", async() => {
      const auth = await authenticate("admin");

      const response = await auth.agent.get(PRODUCT_ROUTE_TEST.GET_PRODUCT(productId));

      expect(response.status).toBe(200);
      expect(response.body.message).toBe("Product fetched successfully");
      expect(response.body.data).toBeInstanceOf(Object);
    });
  });

  describe("POST /products", () => {
    it("should return 401 unauthorized for guest", async() => {
      const response = await request(app).post(PRODUCT_ROUTE_TEST.CREATE_PRODUCT).send({});

      expect(response.status).toBe(401);
      expect(response.body.message).toBe("Unauthorized");
    });

    it("should return 403 forbidden for invalid role", async() => {
      const auth = await authenticate();

      const response = await auth.agent.post(PRODUCT_ROUTE_TEST.CREATE_PRODUCT).send({});

      expect(response.status).toBe(403);
      expect(response.body.message).toBe("Forbidden");
    });

    it("should return 400 validation error", async() => {
      const auth = await authenticate("admin");

      const response = await auth.agent.post(PRODUCT_ROUTE_TEST.CREATE_PRODUCT).send({});

      expect(response.status).toBe(400);
      expect(response.body.message).toBe("Validation Error");
      expect(response.body.errors).toBeInstanceOf(Array);
    });

    it("should return 200 when data is valid", async() => {
      const auth = await authenticate("admin");

      const response = await auth.agent.post(PRODUCT_ROUTE_TEST.CREATE_PRODUCT).send({
        name: "Product 1",
        price: 100,
        unit: "pcs",
        sku: "sku-1",
        description: "Product 1 description",
        stock: 100
      });

      expect(response.status).toBe(200);
      expect(response.body.message).toBe("Product created successfully");
      expect(response.body.data).toBeInstanceOf(Object);
    });
  });

  describe("PUT /products/:id", () => {
    it("should return 401 unauthorized for guest", async() => {
      const response = await request(app).put(PRODUCT_ROUTE_TEST.UPDATE_PRODUCT(productId)).send({});

      expect(response.status).toBe(401);
      expect(response.body.message).toBe("Unauthorized");
    });

    it("should return 403 forbidden for invalid role", async() => {
      const auth = await authenticate();

      const response = await auth.agent.put(PRODUCT_ROUTE_TEST.UPDATE_PRODUCT(productId)).send({});

      expect(response.status).toBe(403);
      expect(response.body.message).toBe("Forbidden");
    });

    it("should return 400 validation error", async() => {
      const auth = await authenticate("admin");

      const response = await auth.agent.put(PRODUCT_ROUTE_TEST.UPDATE_PRODUCT(productId)).send({});

      expect(response.status).toBe(400);
      expect(response.body.message).toBe("Validation Error");
      expect(response.body.errors).toBeInstanceOf(Array);
    });

    it("should return 404 when id is not found", async() => {
      const auth = await authenticate("admin");

      const response = await auth.agent.put(PRODUCT_ROUTE_TEST.UPDATE_PRODUCT("123e4567-e89b-12d3-a456-426614174000")).send({
        name: "Product 1",
        price: 100,
        unit: "pcs",
        sku: "sku-1",
        description: "Product 1 description",
        stock: 100
      });

      expect(response.status).toBe(404);
      expect(response.body.message).toBe("Product not found");
    });

    it("should return 200 when data is valid", async() => {
      const auth = await authenticate("admin");

      const response = await auth.agent.put(PRODUCT_ROUTE_TEST.UPDATE_PRODUCT(productId)).send({
        name: "Product 1",
        price: 100,
        unit: "pcs",
        sku: "sku-1",
        description: "Product 1 description",
        stock: 100
      });

      expect(response.status).toBe(200);
      expect(response.body.message).toBe("Product updated successfully");
      expect(response.body.data).toBeInstanceOf(Object);
    });
  });

  describe("DELETE /products/:id", () => {
    it("should return 401 unauthorized for guest", async() => {
      const response = await request(app).delete(PRODUCT_ROUTE_TEST.DELETE_PRODUCT(productId)).send({});

      expect(response.status).toBe(401);
      expect(response.body.message).toBe("Unauthorized");
    });

    it("should return 403 forbidden for invalid role", async() => {
      const auth = await authenticate();

      const response = await auth.agent.delete(PRODUCT_ROUTE_TEST.DELETE_PRODUCT(productId)).send({});

      expect(response.status).toBe(403);
      expect(response.body.message).toBe("Forbidden");
    });

    it("should return 400 when id is invalid format", async() => {
      const auth = await authenticate("admin");

      const response = await auth.agent.delete(PRODUCT_ROUTE_TEST.DELETE_PRODUCT("invalid-id")).send({});

      expect(response.status).toBe(400);
      expect(response.body.message).toBe("Validation Error");
      expect(response.body.errors).toBeInstanceOf(Array);
    });

    it("should return 404 when data not found", async() => {
      const auth = await authenticate("admin");

      const response = await auth.agent.delete(PRODUCT_ROUTE_TEST.DELETE_PRODUCT("123e4567-e89b-12d3-a456-426614174000")).send({});

      expect(response.status).toBe(404);
      expect(response.body.message).toBe(PRODUCT_NOT_FOUND);
    });

    it("should return 200 when data deleted successfully", async() => {
      const auth = await authenticate("admin");

      const response = await auth.agent.delete(PRODUCT_ROUTE_TEST.DELETE_PRODUCT(productId));

      expect(response.status).toBe(200);
      expect(response.body.message).toBe("Product deleted successfully");
    });
  });
})