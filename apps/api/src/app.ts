import { envs } from "./config/dotenv";
import { OpenAPIHono } from "@hono/zod-openapi";
import route from "./routes/index";
import { httpLogger, logger } from "@repo/logger/config";
import { globalErrorHandler } from "./utils/globalErrorHandler";
import { notFoundHandler } from "./utils/notFoundHandler";
import { getAddressFromIp } from "./services/geoip/geoip";
import { getClientIp } from "./utils/getClientIp";
import { successResponse } from "./utils/apiResponse";
import { swaggerUI } from "@hono/swagger-ui";
import { Scalar } from "@scalar/hono-api-reference";
import { ErrorCodeEnums } from "@repo/schemas";
import { cors } from "hono/cors";

const app = new OpenAPIHono({
  defaultHook: (result, c) => {
    if (!result.success) {
      if (envs.NODE_ENV !== "production") {
        logger.error(result.error);
      }
      const issues = Object.values(
        result.error.issues.reduce<Record<string, { path: (string | number)[]; message: string }>>(
          (acc, issue) => {
            const path = issue.path.filter(
              (item): item is string | number =>
                typeof item === "string" || typeof item === "number"
            );

            const key = path.join(".");

            if (acc[key] !== undefined) {
              acc[key].message += `, ${issue.message}`;
            } else {
              acc[key] = {
                path,
                message: issue.message,
              };
            }

            return acc;
          },
          {}
        )
      );

      return c.json(
        {
          success: false,
          message: "Validation failed",
          error: {
            code: ErrorCodeEnums.VALIDATION_ERROR,
            message: "Please check your input",
            issues,
          },
        },
        400
      );
    }
  },
});

app.use("*", cors());

if (envs.NODE_ENV !== "production") {
  logger.warn("Running in development mode");
  app.use(httpLogger);
}

app.get("/", (c) => {
  const userIp = envs.NODE_ENV === "production" ? getClientIp(c) : "8.8.8.8";

  if (userIp == null) {
    return successResponse(c, "address not found", { userIp, nn: 58 });
  }

  const address = getAddressFromIp(userIp);

  return successResponse(c, "Successfully address found", { userIp, address });
});

app.route("/api", route);

app.notFound((c) => notFoundHandler(c));

app.onError((err, c) => {
  return globalErrorHandler(err, c);
});

app.doc("/doc", {
  openapi: "3.0.0",
  info: {
    version: "1.0.0",
    title: "My API",
  },
});
interface swaggerConfig {
  url: string;
  supportedSubmitMethods?: [];
}
const swaggerConfig: swaggerConfig = {
  url: "/doc",
};
if (envs.NODE_ENV === "production") swaggerConfig.supportedSubmitMethods = [];
app.get("/ui", swaggerUI(swaggerConfig));

app.get(
  "/scalar-ui",
  Scalar({
    url: "/doc",
    theme: "bluePlanet", // bluePlanet,deepSpace,kepler
    hideTestRequestButton: envs.NODE_ENV === "production",
  })
);

export default app;
