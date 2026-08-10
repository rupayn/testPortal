import type { Request, Response, NextFunction } from "express";
import { ApiError } from "./appError";

export function notFoundHandler(req: Request, _res: Response, next: NextFunction): void {
  next(new ApiError(`Route not found: ${req.originalUrl}`, 404));
}
