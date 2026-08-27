import { z } from "./zod.ts";

export const genericErrorResponseSchema = z.object({
  success: z.literal(false),
  message: z.string(),
  error: z.object({
    code: z.string(),
    message: z.string(),
  }),
});

export const validationErrorSchema = z.object({
  success: z.literal(false),
  message: z.string(),
  error: z.object({
    code: z.literal("VALIDATION_ERROR"),
    message: z.string(),
    issues: z.array(
      z.object({
        path: z.array(z.union([z.string(), z.number()])),
        message: z.string(),
      })
    ),
  }),
});

export const ErrorCodeEnums = {
  INTERNAL_SERVER_ERROR: "INTERNAL_SERVER_ERROR",
  VALIDATION_ERROR: "VALIDATION_ERROR",
  USER_NOT_FOUND: "USER_NOT_FOUND",
  UNAUTHORIZED: "UNAUTHORIZED",
  FORBIDDEN: "FORBIDDEN",
  DATABASE_ERROR: "DATABASE_ERROR",
  REDIS_ERROR: "REDIS_ERROR",
  PAYMENT_ERROR: "PAYMENT_ERROR",
  HTTP_ERROR: "HTTP_ERROR",
} as const;
export const errorCodeSchema = z.enum(Object.values(ErrorCodeEnums));

export type ErrorCode = z.infer<typeof errorCodeSchema>;
export type GenericErrorResponse = z.infer<typeof genericErrorResponseSchema>;
export type ValidationError = z.infer<typeof validationErrorSchema>;
