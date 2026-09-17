import { createMiddleware } from "hono/factory";
import { getCookie } from "hono/cookie";
import type { Context } from "hono";
import { verifyAccessToken } from "../utils/jwt";

export const authMiddleware = createMiddleware(async (c: Context, next) => {
  let token: string | undefined;
  const authorization = c.req.header("Authorization");
  if (authorization?.startsWith("Bearer ") === true) {
    token = authorization.slice(7);
  }

  token = token ?? getCookie(c, "access_token");
  if (token === undefined) {
    return c.json(
      {
        success: false,
        message: "Authentication required",
      },
      401
    );
  }
  try {
    const payload = await verifyAccessToken(token);

    c.set("auth", {
      userId: payload.sub as string,
      sessionId: payload.sessionId as string,
    });

    await next();
  } catch {
    return c.json(
      {
        success: false,
        message: "Invalid or expired access token",
      },
      401
    );
  }
});
