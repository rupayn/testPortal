import "dotenv/config";
import { envs } from "./config/dotenv";
import http from "http";

import app from "./app";
import { logger } from "@repo/logger/config";
import { ensureGeoLiteDatabase } from "./utils/geoip";
import { initializeGeoIp } from "./services/geoip/geoip";

const server = http.createServer(app);
async function startServer() {
  try {
    const dbPath = await ensureGeoLiteDatabase();
     
    initializeGeoIp(dbPath);
    server.listen(envs.PORT, () => {
      logger.info(`Server running at http://localhost:${envs.PORT.toString()}`);
    });
    
  } catch (error) {
    logger.error(error)
  }
}

void startServer();