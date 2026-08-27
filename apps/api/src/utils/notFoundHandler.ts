import type { Context } from "hono";
import { logger } from "@repo/logger/config";

export const notFoundHandler = (c: Context) => {
  logger.warn(
    {
      method: c.req.method,
      path: c.req.path,
    },
    "Route not found"
  );

  return c.json(
    {
      success: false,
      error: {
        code: "NOT_FOUND",
        message: "Route not found",
      },
    },
    404
  );
};
