import { envs } from "./config/dotenv";
import { OpenAPIHono } from "@hono/zod-openapi";
import route from "./routes/index";
import { httpLogger } from "@repo/logger/config";
import { globalErrorHandler } from "./utils/globalErrorHandler";
import { notFoundHandler } from "./utils/notFoundHandler";
import { getAddressFromIp } from "./services/geoip/geoip";
import { getClientIp } from "./utils/getClientIp";
import { successResponse } from "./utils/apiResponse";
const app = new OpenAPIHono();

if (envs.NODE_ENV !== "production") {
  app.use(httpLogger);
}

app.get("/", (c) => {
  const userIp = envs.NODE_ENV === "production" ? getClientIp(c) : "8.8.8.8";

  if (userIp == null) {
    return successResponse(c, "address not found", { userIp, nn: 58 });

    // c.json({
    //   success: true,
    //   userIp,
    //   msg: "Address not found",
    //   nn: 58,
    // });
  }

  const address = getAddressFromIp(userIp);

  return successResponse(c, "Successfully address found", { userIp, address });

  // c.json({
  //   success: true,
  //   userIp,
  //   address,
  //   value: envs.PORT,
  //   nn: 58,
  // });
});

app.route("/api", route);

app.notFound((c) => notFoundHandler(c));

app.onError((err, c) => globalErrorHandler(err, c));

export default app;
