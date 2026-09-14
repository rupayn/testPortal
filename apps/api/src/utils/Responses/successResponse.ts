import type { ZodType } from "zod";

export const successResponse200 = <T extends ZodType>(description = "Success", schema: T) => ({
  200: {
    description,
    content: {
      "application/json": {
        schema,
      },
    },
  },
});
