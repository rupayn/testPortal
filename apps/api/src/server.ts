import "dotenv/config";
import { envs } from "./config/dotenv";
import { serve } from "@hono/node-server";

import app from "./app";
import { logger } from "@repo/logger/config";
import { ensureGeoLiteDatabase } from "./utils/geoip";
import { initializeGeoIp } from "./services/geoip/geoip";

async function startServer() {
  try {
    const dbPath = await ensureGeoLiteDatabase();
    initializeGeoIp(dbPath);
    serve(
      {
        fetch: app.fetch,
        port: envs.PORT,
      },
      (info) => {
        logger.info(
          {
            port: info.port,
          },
          "Server started"
        );
        logger.debug(`http://localhost:${info.port.toString()}`);
      }
    );
  } catch (error) {
    logger.error(
      {
        err: error,
      },
      "Failed to start server"
    );
    process.exit(1);
  }
}

void startServer();
