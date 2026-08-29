import { createRoute } from "@hono/zod-openapi";
import { genericErrorResponseSchema, signInOutputSchema, signInInputSchema } from "@repo/schemas";
import { successResponse200 } from "../../Responses/successResponse";
import {
  errorResponse500,
  genericErrorResponse,
  validationErrorResponse,
} from "../../Responses/errorResponse";

export const signinRoute = createRoute({
  method: "post",
  path: "/auth/signin",
  request: {
    body: {
      content: {
        "application/json": {
          schema: signInInputSchema,
        },
      },
    },
  },
  responses: {
    ...successResponse200("Signin successfully", signInOutputSchema),
    ...validationErrorResponse(),
    ...errorResponse500(),
    ...genericErrorResponse(401, genericErrorResponseSchema, "Unauthorized"),

    // 200: {
    //   description:"Signin successfully",
    //   content: {
    //     "application/json": {
    //       schema: signInOutputSchema,
    //     },
    //   },
    // },
  },
});
