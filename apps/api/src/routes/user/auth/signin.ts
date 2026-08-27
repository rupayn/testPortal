import { createRoute } from "@hono/zod-openapi";
import { signInOutputSchema, signInSchema } from "@repo/schemas";

export const signinRoute = createRoute({
  method: "post",
  path: "/auth/signin",
  request: {
    body: {
      content: {
        "application/json": {
          schema: signInSchema,
        },
      },
    },
  },
  responses: {
    200: {
      description: "Signin successfully",
      content: {
        "application/json": {
          schema: signInOutputSchema,
        },
      },
    },
  },
});
