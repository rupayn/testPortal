import { ApiError } from "../../../../utils/apiError";
import { ErrorCodeEnums } from "@repo/schemas";
import { prismaSingleton } from "@repo/db/config";
import { successResponse } from "../../../../utils/apiResponse";
import type { RouteHandler } from "@hono/zod-openapi";
import type { signinRoute } from "./signin.route";
import { logger } from "@repo/logger/config";
import { verifyPassword } from "@repo/miscellaneous/backend";

export const signinController: RouteHandler<typeof signinRoute> = async (c) => {
  const { email, password } = c.req.valid("json");

  const user = await prismaSingleton.user.findUnique({
    where: { email },
  });
  logger.debug(user);

  if (user == null) {
    throw new ApiError(401, "Invalid credentials", ErrorCodeEnums.USER_NOT_FOUND);
  }
  const checkP = verifyPassword(password, user.password);
  if (!checkP) {
    throw new ApiError(401, "Invalid credentials", ErrorCodeEnums.USER_NOT_FOUND);
  }

  return successResponse(c, "Login successfully", { user }, 200);
};
