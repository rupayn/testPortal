import type { Context } from "hono";
import { HTTPException } from "hono/http-exception";
import { ApiError } from "./apiError";
import { errorResponse } from "./apiResponse";
import { logger } from "@repo/logger/config";
import { ZodError } from "zod";
import type { ErrorStatusCode } from "./apiError";
import { ErrorCodeEnums } from "@repo/schemas";

const isErrorStatusCode = (status: number): status is ErrorStatusCode => {
  return status >= 400 && status <= 599;
};
export const globalErrorHandler = (error: Error, c: Context) => {
  const requestContext = {
    method: c.req.method,
    path: c.req.path,
  };
  // ────────────────────────────────
  // Expected application error
  // ────────────────────────────────

  if (error instanceof ApiError) {
    logger.warn(
      {
        err: error,
        ...requestContext,
        statusCode: error.statusCode,
        code: error.code,
      },
      error.message
    );

    return errorResponse(c, error.statusCode, error.code, error.message);
  }

  // ────────────────────────────────
  // Zod validation error
  // ────────────────────────────────

  if (error instanceof ZodError) {
    const issues = error.issues.map((issue) => ({
      path: issue.path,
      message: issue.message,
    }));

    logger.warn(
      {
        err: error,
        ...requestContext,
        code: ErrorCodeEnums.VALIDATION_ERROR,
      },
      "Request validation failed"
    );

    return errorResponse(
      c,
      400,
      ErrorCodeEnums.VALIDATION_ERROR,
      "Request validation failed",
      issues
    );
  }

  // ────────────────────────────────
  // Hono HTTP exception
  // ────────────────────────────────

  if (error instanceof HTTPException) {
    logger.warn(
      {
        err: error,
        ...requestContext,
        statusCode: error.status,
      },
      error.message
    );

    if (isErrorStatusCode(error.status)) {
      return errorResponse(c, error.status, ErrorCodeEnums.HTTP_ERROR, error.message);
    }

    logger.error(
      {
        err: error,
        ...requestContext,
        statusCode: error.status,
      },
      "HTTPException contains an invalid error status"
    );

    return errorResponse(c, 500, "INTERNAL_SERVER_ERROR", "Internal server error");
  }

  // ────────────────────────────────
  // Unexpected / infrastructure error
  // ────────────────────────────────

  logger.error(
    {
      err: error,
      ...requestContext,
    },
    "Unhandled application error"
  );

  return errorResponse(c, 500, ErrorCodeEnums.INTERNAL_SERVER_ERROR, "Internal Server Error");
};
