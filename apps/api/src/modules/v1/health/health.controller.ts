import type { RouteHandler } from "@hono/zod-openapi";

import type { healthRoute } from "@/modules/v1/health/health.route";
import { successResponse } from "@/utils/apiResponse";

export const healthController: RouteHandler<typeof healthRoute> = (c) => {
  return successResponse(c, "Health check", { status: "ok" });
};
