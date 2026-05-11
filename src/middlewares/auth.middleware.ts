import type { NextFunction, Request, Response } from "express";
import { auth } from "../lib/auth";
import { fromNodeHeaders } from "better-auth/node";
import { AUTH_MESSAGE, AUTH_STATUS_CODE } from "../shared/constants/auth.constants";
import { success } from "better-auth";

export async function authMiddleware(
  req: Request, res: Response, next: NextFunction
) {
  try {
    const session = await auth.api.getSession({
      headers: fromNodeHeaders(req.headers),
    });
  
    if (!session) {
      return res.status(AUTH_STATUS_CODE.UNAUTHORIZED).json({
        success: false,
        message: AUTH_MESSAGE.UNAUTHORIZED,
      });
    }
  
    req.auth = {
      session: session.session,
      user: session.user
    }

    next();
  } catch (error) {
    next(error);
  }
}