import "dotenv/config";
import { envs } from "./config/dotenv";
import http from "http";

import app from "./app";
import { logger } from "@repo/logger/config";

const server = http.createServer(app);
server.listen(envs.PORT, () => {
  logger.info(`Server running at http://localhost:${envs.PORT.toString()}`);
});
