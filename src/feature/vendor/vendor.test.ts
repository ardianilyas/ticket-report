import request from "supertest";
import { beforeEach, describe, expect, it, test } from "vitest";
import app from "../../server";
import { VENDOR_ROUTE_TEST } from "./vendor.type";
import { authenticate } from "../../../tests/helpers/auth.helper";
import { db } from "../../db";
import { vendors } from "../../db/schemas";

let vendorId: string;

describe("Vendors endpoint test", () => {

  beforeEach(async () => {
    const [vendor] = await db.insert(vendors).values({
      name: "Vendor 1",
      email: "vendor1@example.com",
      phone: "1234567890",
      address: "123 Main St",
    }).returning({ id: vendors.id });

    if (!vendor) {
      throw new Error("Failed to create vendor");
    }

    vendorId = vendor.id;
  })

  describe("GET /vendors", () => {
    it("should return 401 unauthorized", async () => {
      const response = await request(app).get(VENDOR_ROUTE_TEST.GET_VENDORS);
  
      expect(response.status).toBe(401);
      expect(response.body.message).toBe("Unauthorized");
    });
  
    it("should return 403 forbidden", async () => {
      const auth = await authenticate();
  
      const response = await auth.agent.get(VENDOR_ROUTE_TEST.GET_VENDORS);
  
      expect(response.status).toBe(403);
      expect(response.body.message).toBe("Forbidden");
    });
  
    it("should return 200 when admin access endpoint", async () => {
      const auth = await authenticate("admin");
  
      const response = await auth.agent.get(VENDOR_ROUTE_TEST.GET_VENDORS);
  
      expect(response.status).toBe(200);
      expect(response.body.message).toBe("Vendors fetched successfully");
      expect(response.body.data).toBeInstanceOf(Array);
    });
  });
  
  describe("GET /vendors/:id", () => {
    it("should return 401 unauthorized", async () => {
      const response = await request(app).get(VENDOR_ROUTE_TEST.GET_VENDOR(vendorId));
  
      expect(response.status).toBe(401);
      expect(response.body.message).toBe("Unauthorized");
    });
  
    it("should return 403 forbidden", async () => {
      const auth = await authenticate();
  
      const response = await auth.agent.get(VENDOR_ROUTE_TEST.GET_VENDOR(vendorId));
  
      expect(response.status).toBe(403);
      expect(response.body.message).toBe("Forbidden");
    });
  
    it("should return 200 when admin access endpoint", async () => {
      const auth = await authenticate("admin");
  
      const response = await auth.agent.get(VENDOR_ROUTE_TEST.GET_VENDOR(vendorId));
  
      expect(response.status).toBe(200);
      expect(response.body.message).toBe("Vendor fetched successfully");
      expect(response.body.data).toBeInstanceOf(Array);
    });
  });

  describe("POST /vendors", () => {
    it("should return 401 unauthorized", async () => {
      const response = await request(app).post(VENDOR_ROUTE_TEST.CREATE_VENDOR).send({});
  
      expect(response.status).toBe(401);
      expect(response.body.message).toBe("Unauthorized");
    });

    it("should return 400 validation error", async () => {
      const auth = await authenticate("admin");

      const response = await auth.agent.post(VENDOR_ROUTE_TEST.CREATE_VENDOR).send({});

      expect(response.status).toBe(400);
      expect(response.body.message).toBe("Validation Error");
    });

    it("should return 200 when data is valid", async() => {
      const auth = await authenticate("admin");

      const response = await auth.agent.post(VENDOR_ROUTE_TEST.CREATE_VENDOR).send({
        name: "Vendor 1",
        email: "vendor1@example.com",
        phone: "1234567890",
        address: "123 Main St",
      });

      expect(response.status).toBe(200);
      expect(response.body.message).toBe("Vendor created successfully");
      expect(response.body.data).toBeInstanceOf(Object);
    })
  });

  describe("PUT /vendors", () => {
    it("should return 401 unauthorized", async () => {
      const response = await request(app).put(VENDOR_ROUTE_TEST.UPDATE_VENDOR(vendorId)).send({});
  
      expect(response.status).toBe(401);
      expect(response.body.message).toBe("Unauthorized");
    });

    it("should return 400 validation error", async () => {
      const auth = await authenticate("admin");

      const response = await auth.agent.put(VENDOR_ROUTE_TEST.UPDATE_VENDOR(vendorId)).send({
        name: "",
        email: "",
        phone: "",
        address: "",
      });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe("Validation Error");
      expect(response.body.errors).toBeInstanceOf(Array);
    });

    it("should return 200 when data is valid", async() => {
      const auth = await authenticate("admin");

      const response = await auth.agent.put(VENDOR_ROUTE_TEST.UPDATE_VENDOR(vendorId)).send({
        name: "Vendor 1",
        email: "vendor1@example.com",
        phone: "1234567890",
        address: "123 Main St",
      });

      expect(response.status).toBe(200);
      expect(response.body.message).toBe("Vendor updated successfully");
      expect(response.body.data).toBeInstanceOf(Object);
    })
  });

  describe("DELETE /vendors", () => {
    it("should return 401 unauthorized", async () => {
      const response = await request(app).delete(VENDOR_ROUTE_TEST.DELETE_VENDOR(vendorId));
  
      expect(response.status).toBe(401);
      expect(response.body.message).toBe("Unauthorized");
    });
    
    it("should return 403 forbidden", async () => {
      const auth = await authenticate();
  
      const response = await auth.agent.delete(VENDOR_ROUTE_TEST.DELETE_VENDOR(vendorId));
  
      expect(response.status).toBe(403);
      expect(response.body.message).toBe("Forbidden");
    });
  
    it("should return 200 when data deleted successfully", async () => {
      const auth = await authenticate("admin");
  
      const response = await auth.agent.delete(VENDOR_ROUTE_TEST.DELETE_VENDOR(vendorId));
  
      expect(response.status).toBe(200);
      expect(response.body.message).toBe("Vendor deleted successfully");
    });
  })
})