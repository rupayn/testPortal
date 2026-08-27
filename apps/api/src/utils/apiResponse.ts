import type { Context } from "hono";
import type { ErrorStatusCode } from "./apiError";
import type { ErrorCode } from "@repo/schemas";

type JsonSuccessStatusCode = 200 | 201 | 202;

export const successResponse = <T, S extends JsonSuccessStatusCode = 200>(
  c: Context,
  message = "Success",
  data: T,
  status: S = 200 as S
) => {
  return c.json(
    {
      success: true,
      message,
      data,
    },
    status
  );
};
export const errorResponse = <T>(
  c: Context,
  status: ErrorStatusCode,
  code: ErrorCode,
  message = "Failed",
  issues?: T
) => {
  return c.json(
    {
      success: false,
      message,
      error: {
        code,
        message,
        ...(issues !== undefined ? { issues } : {}),
      },
    },
    status
  );
};
