import { ApiError } from "../../utils/apiError";
import { ErrorCodeEnums } from "@repo/schemas";
import { prismaSingleton } from "@repo/db/config";
import { successResponse } from "../../utils/apiResponse";
import type { RouteHandler } from "@hono/zod-openapi";
import type { signinRoute } from "../../routes/user/auth/signin";

export const signinController: RouteHandler<typeof signinRoute> = async (c) => {
  const { email, password } = c.req.valid("json");

  const user = await prismaSingleton.user.findUnique({
    where: { email },
    include: {
      posts: true,
    },
  });

  if (user == null) {
    throw new ApiError(401, "Invalid credentials", ErrorCodeEnums.USER_NOT_FOUND);
  }

  if (user.password !== password) {
    throw new ApiError(401, "Invalid credentials", ErrorCodeEnums.USER_NOT_FOUND);
  }

  return successResponse(c, "Login successfully", { user }, 200);
};
