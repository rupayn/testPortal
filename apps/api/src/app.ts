import { envs } from "./config/dotenv";
import express, { type Express } from "express";

import { httpLogger } from "@repo/logger/config";
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

export default app;
