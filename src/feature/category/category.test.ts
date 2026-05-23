import { beforeEach, afterEach, describe, expect, it } from "vitest";
import request from "supertest";
import app from "../../server";
import { authenticate } from "../../../tests/helpers/auth.helper";
import { db } from "../../db";
import { categories } from "../../db/schemas";
import { CATEGORY_ROUTE_TEST } from "./category.constant";
import { clearDb } from "../../../tests/helpers/clear-db";

describe("Categories endpoint", () => {
  let categoryId: string;
  const invalidId: string = "3fa2aec4-a855-4e4e-b813-fea834881c76";

  beforeEach(async () => {
    const data = {
      title: "Test Category",
      description: "This is a test category"
    }
    const [category] = await db.insert(categories).values(data).returning();

    if(!category) {
      throw new Error("Category not created");
    }

    categoryId = category.id
  })

  afterEach(async () => {
    await clearDb();
  })

  describe("GET /api/categories", () => {
    it("should return 401 unauthorized", async () => {
      const response = await request(app).get(CATEGORY_ROUTE_TEST.GET_CATEGORIES);

      expect(response.status).toBe(401);
      expect(response.body.message).toBe("Unauthorized");
    });

    it("should return 403 forbidden for non-admin", async() => {
      const auth = await authenticate();
      const response = await auth.agent.get(CATEGORY_ROUTE_TEST.GET_CATEGORIES);

      expect(response.status).toBe(403);
      expect(response.body.message).toBe("Forbidden");
    });

    it("should return 200 for admin role", async() => {
      const auth = await authenticate("admin");
      const response = await auth.agent.get(CATEGORY_ROUTE_TEST.GET_CATEGORIES);

      expect(response.status).toBe(200);
      expect(response.body.message).toBe("Categories fetched successfully");
      expect(response.body.data).toBeInstanceOf(Array);
    })
  });

  describe("GET /api/categories/:id", () => {
    it("should return 401 unauthorized", async () => {
      const response = await request(app).get(CATEGORY_ROUTE_TEST.GET_CATEGORY(categoryId));

      expect(response.status).toBe(401);
      expect(response.body.message).toBe("Unauthorized");
    });

    it("should return 403 forbidden for non-admin", async() => {
      const auth = await authenticate();
      const response = await auth.agent.get(CATEGORY_ROUTE_TEST.GET_CATEGORY(categoryId));

      expect(response.status).toBe(403);
      expect(response.body.message).toBe("Forbidden");
    });

    it("should return 200 for admin role", async() => {
      const auth = await authenticate("admin");
      const response = await auth.agent.get(CATEGORY_ROUTE_TEST.GET_CATEGORY(categoryId));

      expect(response.status).toBe(200);
      expect(response.body.message).toBe("Category fetched successfully");
      expect(response.body.data).toBeInstanceOf(Object);
    })
  });

  describe("POST /api/categories", () => {
    it("should return 401 unauthorized", async () => {
      const response = await request(app).post(CATEGORY_ROUTE_TEST.CREATE_CATEGORY);

      expect(response.status).toBe(401);
      expect(response.body.message).toBe("Unauthorized");
    });
    it("should return 403 forbidden for non-admin", async() => {
      const auth = await authenticate();
      const response = await auth.agent.post(CATEGORY_ROUTE_TEST.CREATE_CATEGORY).send({
        title: "Test Category",
        description: "This is a test category"
      });

      expect(response.status).toBe(403);
      expect(response.body.message).toBe("Forbidden");
    });
    it("should return 400 when the body is invalid", async() => {
      const auth = await authenticate("admin");
      const response = await auth.agent.post(CATEGORY_ROUTE_TEST.CREATE_CATEGORY).send({});

      expect(response.status).toBe(400);
      expect(response.body.message).toBe("Validation Error");
      expect(response.body.errors).toBeInstanceOf(Object);
    });
    it("should return 200 for valid data", async() => {
      const auth = await authenticate("admin");
      const response = await auth.agent.post(CATEGORY_ROUTE_TEST.CREATE_CATEGORY).send({
        title: "Test Category",
        description: "This is a test category"
      });

      expect(response.status).toBe(200);
      expect(response.body.message).toBe("Category created successfully");
      expect(response.body.data).toBeInstanceOf(Object);
    });
  });
  
  describe("PUT /api/categories/:id", () => {
    it("should return 401 unauthorized", async () => {
      const response = await request(app).put(CATEGORY_ROUTE_TEST.UPDATE_CATEGORY(categoryId));

      expect(response.status).toBe(401);
      expect(response.body.message).toBe("Unauthorized");
    });
    it("should return 403 forbidden for non-admin", async() => {
      const auth = await authenticate();
      const response = await auth.agent.put(CATEGORY_ROUTE_TEST.UPDATE_CATEGORY(categoryId)).send({
        title: "Test Category",
        description: "This is a test category"
      });

      expect(response.status).toBe(403);
      expect(response.body.message).toBe("Forbidden");
    });
    it("should return 400 when the body is invalid", async() => {
      const auth = await authenticate("admin");
      const response = await auth.agent.put(CATEGORY_ROUTE_TEST.UPDATE_CATEGORY(categoryId)).send({
        title: 13123
      });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe("Validation Error");
      expect(response.body.errors).toBeInstanceOf(Object);
    });
    it("should return 404 for invalid id", async() => {
      const auth = await authenticate("admin");
      const response = await auth.agent.put(CATEGORY_ROUTE_TEST.UPDATE_CATEGORY(invalidId)).send({
        title: "Test Category",
        description: "This is a test category"
      });

      expect(response.status).toBe(404);
      expect(response.body.message).toBe("Category not found");
    });
    it("should return 200 for valid data", async() => {
      const auth = await authenticate("admin");
      const response = await auth.agent.put(CATEGORY_ROUTE_TEST.UPDATE_CATEGORY(categoryId)).send({
        title: "Test Category",
        description: "This is a test category"
      });

      expect(response.status).toBe(200);
      expect(response.body.message).toBe("Category updated successfully");
      expect(response.body.data).toBeInstanceOf(Object);
    });
  })

  describe("DELETE /api/categories/:id", () => {
    it("should return 401 unauthorized", async () => {
      const response = await request(app).delete(CATEGORY_ROUTE_TEST.DELETE_CATEGORY(categoryId));

      expect(response.status).toBe(401);
      expect(response.body.message).toBe("Unauthorized");
    });
    it("should return 403 forbidden for non-admin", async() => {
      const auth = await authenticate();
      const response = await auth.agent.delete(CATEGORY_ROUTE_TEST.DELETE_CATEGORY(categoryId));

      expect(response.status).toBe(403);
      expect(response.body.message).toBe("Forbidden");
    });
    it("should return 404 for invalid id", async() => {
      const auth = await authenticate("admin");
      const response = await auth.agent.delete(CATEGORY_ROUTE_TEST.DELETE_CATEGORY(invalidId)); 

      expect(response.status).toBe(404);
      expect(response.body.message).toBe("Category not found");
    })
    it("should return 200 for admin role", async() => {
      const auth = await authenticate("admin");
      const response = await auth.agent.delete(CATEGORY_ROUTE_TEST.DELETE_CATEGORY(categoryId));

      expect(response.status).toBe(200);
      expect(response.body.message).toBe("Category deleted successfully");
      expect(response.body.data).toBeInstanceOf(Object);
    });
  });
});