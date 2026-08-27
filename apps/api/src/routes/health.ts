import { createRoute } from "@hono/zod-openapi";
import { healthResponseSchema } from "@repo/schemas";

export const healthRoute = createRoute({
  method: "get",
  path: "/health",

  responses: {
    200: {
      description: "Health check",
      content: {
        "application/json": {
          schema: healthResponseSchema,
        },
      },
    },
  },
});
