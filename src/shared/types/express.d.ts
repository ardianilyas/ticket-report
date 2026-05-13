import "express";

export interface SessionUser {
  id: string;
  name?: string;
  email: string;
  role: string | null | undefined,
  image?: string | null | undefined;
}

export interface AuthSession {
  session: {
    id: string;
    expiresAt: Date;
  };

  user: SessionUser;
}

declare global {
  namespace Express {
    interface Request {
      auth?: AuthSession;
    }
  }
}
