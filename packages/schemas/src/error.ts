import { z } from "./zod.ts";

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

export const genericErrorResponseSchema = z.object({
  success: z.literal(false),
  message: z.string(),
  error: z.object({
    code: errorCodeSchema,
    message: z.string(),
    issues: z.array(z.object()).optional(),
  }),
});

export const validationErrorSchema = z.object({
  success: z.literal(false),
  message: z.string(),
  error: z.object({
    code: z.literal(ErrorCodeEnums.VALIDATION_ERROR),
    message: z.string(),
    issues: z.array(
      z.object({
        path: z.array(z.union([z.string(), z.number()])),
        message: z.string(),
      })
    ),
  }),
});

export const internalServerErrorResponseSchema = z.object({
  success: z.literal(false),
  message: z.string(),
  error: z.object({
    code: z.literal(ErrorCodeEnums.INTERNAL_SERVER_ERROR),
    message: z.string(),
  }),
});

export type GenericErrorResponse = z.infer<typeof genericErrorResponseSchema>;
export type ValidationError = z.infer<typeof validationErrorSchema>;
export type InternalServerErrorResponse = z.infer<typeof internalServerErrorResponseSchema>;
