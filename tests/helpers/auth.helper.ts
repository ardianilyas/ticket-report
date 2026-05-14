import request from "supertest";
import app from "../../src/server";

export async function authenticate() {
  const agent = request.agent(app)

  const user = {
    name: "Test User",
    email: "test@example.com",
    password: "password123"
  }

  await agent
    .post("/api/auth/sign-up/email")
    .send(user)

  await agent
    .post("/api/auth/sign-in/email")
    .send({
      email: user.email,
      password: user.password
    })

  return {
    user,
    agent
  }
}