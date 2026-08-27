import type { MiddlewareHandler } from "hono";
import { logger } from "./logger.js";

export const httpLogger: MiddlewareHandler = async (c, next) => {
  const start = performance.now();

  await next();

  const responseTime = Math.round(performance.now() - start);

  logger.info(
    {
      method: c.req.method,
      path: c.req.path,
      status: c.res.status,
      responseTime,
    },
    "HTTP request"
  );
};
