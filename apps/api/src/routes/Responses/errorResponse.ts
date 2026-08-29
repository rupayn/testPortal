import { internalServerErrorResponseSchema, validationErrorSchema } from "@repo/schemas";
import type { ZodType } from "zod";

export const errorResponse500 = () => ({
  500: {
    description: "Internal server error",
    content: {
      "application/json": {
        schema: internalServerErrorResponseSchema,
      },
    },
  },
});

export const genericErrorResponse = function <T extends ZodType>(
  statusCode: number,
  schema: T,
  description = "Generic error"
) {
  return {
    [statusCode]: {
      description,
      content: {
        "application/json": {
          schema,
        },
      },
    },
  };
};
export const validationErrorResponse = function () {
  return {
    400: {
      description: "Validation error",
      content: {
        "application/json": {
          schema: validationErrorSchema,
        },
      },
    },
  };
};
