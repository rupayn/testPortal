import type { Request, Response, NextFunction } from "express";
import type { ZodType } from "zod";
import { ApiError } from "../utils/appError";
type ValidationTarget = "body" | "params" | "query";

export function validate(schema: ZodType, target: ValidationTarget = "body") {
  return (req: Request, _res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req[target]);

    if (!result.success) {
      const message = result.error.issues
        .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
        .join(", ");
      next(new ApiError(message, 400));
      return;
    }

    req[target] = result.data; // replaced with parsed/coerced data
    next();
  };
}
