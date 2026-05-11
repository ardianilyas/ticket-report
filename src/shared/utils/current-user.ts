import type { Request } from "express";

export function getCurrentUser(req: Request) {
  return req.auth?.user;
}
