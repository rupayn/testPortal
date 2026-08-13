import { envs } from "./config/dotenv";
import express, { type Express } from "express";
import route from "./routes/index";
import { httpLogger } from "@repo/logger/config";
import { globalErrorHandler } from "./utils/globalErrorHandler";
import { notFoundHandler } from "./utils/notFoundHandler";
import { getAddressFromIp } from "./services/geoip/geoip";
import { getClientIp } from "./utils/getClientIp";
const app: Express = express();
app.use(express.json());
app.use(httpLogger);

app.get("/", (req, res) => {
  const userIp =envs.NODE_ENV==="production"? getClientIp(req):"8.8.8.8";
  if (userIp == null) {
    res.json({
      success: true,
      userIp,
      msg:"Address not found",
      nn: 58,
    });
    return;
  }
  const address = getAddressFromIp(userIp);
  res.json({
    success: true,
    userIp,
    address,
    value: envs.PORT,
    nn: 58,
  });
});

app.use("/api", route);

app.use(notFoundHandler);
app.use(globalErrorHandler);
export default app;
