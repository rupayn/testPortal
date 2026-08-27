import type { ClientErrorStatusCode, ServerErrorStatusCode } from "hono/utils/http-status";
import type { ErrorCode } from "@repo/schemas";

export type ErrorStatusCode = ClientErrorStatusCode | ServerErrorStatusCode;
export class ApiError extends Error {
  constructor(
    public readonly statusCode: ErrorStatusCode,
    message: string,
    public readonly code: ErrorCode,
    options?: {
      cause?: unknown;
    }
  ) {
    super(message, {
      cause: options?.cause,
    });
    this.name = "ApiError";
    Error.captureStackTrace(this, ApiError);
  }
}
