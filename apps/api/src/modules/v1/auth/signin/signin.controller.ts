import { ApiError } from "@/utils/apiError";
import { ErrorCodeEnums } from "@repo/schemas";
import { successResponse } from "@/utils/apiResponse";
import type { RouteHandler } from "@hono/zod-openapi";
import type { signinRoute } from "@/modules/v1/auth/signin/signin.route";
import { logger } from "@repo/logger/config";
import { hashPassword, verifyPassword } from "@repo/miscellaneous/backend";
import { signToken } from "@/utils/jwt";
import { envs } from "@/config/dotenv";
import { setCookie } from "hono/cookie";
import { getUser } from "@/utils/db/user";
import { updateSession } from "@/utils/db/session";

export const signinController: RouteHandler<typeof signinRoute> = async (c) => {
  const { email, password } = c.req.valid("json");

  const user = await getUser("signin", email);
  logger.debug(user);

  if (user == null) {
    throw new ApiError(401, "Invalid credentials", ErrorCodeEnums.USER_NOT_FOUND);
  }
  const checkP = verifyPassword(password, user.password);
  if (!checkP) {
    throw new ApiError(401, "Invalid credentials", ErrorCodeEnums.USER_NOT_FOUND);
  }
  if (user.session === null) {
    throw new ApiError(401, "User is not registered", ErrorCodeEnums.USER_NOT_FOUND);
  }
  const acToken = await signToken(
    user.id,
    user.session.id,
    envs.JWT_ACCESS_SECRET,
    "access",
    "15m"
  );
  setCookie(c, "access_token", acToken);
  const refreshToken = await signToken(
    user.id,
    user.session.id,
    envs.JWT_REFRESH_SECRET,
    "refresh",
    envs.JWT_REFRESH_EXPIRES_IN
  );
  const refresh_token = hashPassword(refreshToken);
  await updateSession({ user_id: user.id, data: { refresh_token } });
  return successResponse(
    c,
    "Signin successfully",
    {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        email_verified: user.email_verified,
        qualification: user.qualification,
        dob: user.dob,
        gender: user.gender,
        role: user.role,
        phone: user.phone.map((phone) => ({
          id: phone.id,
          country_code: phone.country_code,
          phone: phone.phone,
          is_primary: phone.is_primary,
          is_verified: phone.is_verified,
          type: phone.type,
          created_at: phone.created_at,
          updated_at: phone.updated_at,
        })),
        status: user.status,

        student:
          user.student !== null
            ? {
                id: user.student.id,
                class_id: user.student.class_id,
                academic_year_id: user.student.academic_year_id,
                created_at: user.student.created_at,
                updated_at: user.student.updated_at,
                roll_number: user.student.roll_number,
              }
            : null,

        teacher:
          user.employee !== null && user.employee.teacher !== null
            ? {
                id: user.employee.teacher.id,
                employee_code: user.employee.employee_code,
                joining_date: user.employee.joining_date,
                status: user.employee.status,
                designation: user.employee.designation,
                school_id: user.employee.school_id,
              }
            : null,
      },
    },
    200
  );
};
