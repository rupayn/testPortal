import { z } from "./zod.ts";

export const healthDataSchema = z.object({
  status: z.string(),
});
export const healthResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  data: healthDataSchema,
});
