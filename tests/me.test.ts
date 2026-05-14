import request from "supertest";
import { describe, it, expect } from "vitest";
import app from "../src/server";
import { authenticate } from "./helpers/auth.helper";

describe("GET /api/me", () => {
  it("should return 401", async () => {
    const response = await request(app).get("/api/admin")

    expect(response.status).toBe(401)
    expect(response.body.message).toBe("Unauthorized")
  });

  it("should return 403", async () => {
    const auth = await authenticate();

    const response = await auth.agent
      .get("/api/admin")

    expect(response.status).toBe(403)
    expect(response.body.message).toBe("Forbidden")
  });

  it("should return 200", async () => {
    const auth = await authenticate("admin");

    const response = await auth.agent.get("/api/admin");

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.message).toBe("You are an admin");
  });
  it("should return 401", async () => {
    const response = await request(app).get("/api/users/me");

    expect(response.status).toBe(401);
    expect(response.body.message).toBe("Unauthorized");
  });

  it("should return 200", async () => {
    const auth = await authenticate()
  
    const response = await auth.agent
      .get("/api/users/me")
  
    expect(response.status).toBe(200);
    expect(response.body.data).toMatchObject({
      email: auth.user.email,
      name: auth.user.name
    });
  })
})