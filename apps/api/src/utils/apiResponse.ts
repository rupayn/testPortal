import type { Response } from "express";

export class ApiResponse<T = unknown> {
  public readonly success: boolean;
  public readonly statusCode: number;
  public readonly message: string;
  public readonly data: T;
  constructor(statusCode: number, data: T, message = "Success") {
    this.success = statusCode < 400;
    this.statusCode = statusCode;
    this.message = message;
    this.data = data;
  }
}

export function sendApiResponse(
  res: Response,
  statusCode: number,
  message = "Success",
  data?: unknown
): void {
  res.status(statusCode).json(new ApiResponse(statusCode, data, message));
}
