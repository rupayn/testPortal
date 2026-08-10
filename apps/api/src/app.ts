import { envs } from "./config/dotenv";
import express, { type Express } from "express";
import route from "./routes/index";
import { httpLogger } from "@repo/logger/config";
import { globalErrorHandler } from "./utils/globalErrorHandler";
import { notFoundHandler } from "./utils/notFoundHandler";
const app: Express = express();
app.use(express.json());
app.use(httpLogger);

app.get("/", (req, res) => {
  res.json({
    success: true,
    value: envs.PORT,
    nn: 58,
  });
});

app.use("/api", route);

app.use(notFoundHandler);
app.use(globalErrorHandler);
export default app;
