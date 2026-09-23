import { createRoute } from "@hono/zod-openapi";
import { healthResponseSchema } from "@repo/schemas";

export const healthRoute = createRoute({
  method: "get",
  path: "/health",
  tags: ["Health"],
  summary: "Health check",
  description: "Health check",
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
