import type { Request, Response, NextFunction } from "express";
import { ApiError } from "./appError";
import { logger } from "@repo/logger/config";

export function globalErrorHandler(
  error: unknown,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction
): void {
  if (error instanceof ApiError) {
    res.status(error.statusCode).json({
      success: false,
      statusCode: error.statusCode,
      message: error.message,
    });
    return;
  }

  const message = error instanceof Error ? error.message : "Unknown error";
  const stack = error instanceof Error ? error.stack : undefined;
  logger.error(`Unhandled error: ${message}`, stack);

  res.status(500).json({
    success: false,
    statusCode: 500,
    message: "Internal Server Error",
  });
}
