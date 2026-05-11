export const AUTH_MESSAGE = {
  UNAUTHORIZED: "Unauthorized",
  FORBIDDEN: "Forbidden",
  SESSION_NOT_FOUND: "Session not found",
} as const;

export const AUTH_STATUS_CODE = {
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
} as const;
