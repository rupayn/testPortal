import morgan from "morgan";
import { logger, configureLogger } from "./logger.ts";

const morganFormat = ":method :url :status :response-time ms";

const httpLogger = morgan(morganFormat, {
  stream: {
    write: (message) => {
      const parts = message.trim().split(" ");
      const logObject = {
        method: parts[0],
        url: parts[1],
        status: parts[2],
        responseTime: parts[3],
      };
      logger.info(JSON.stringify(logObject));
    },
  },
});

export { httpLogger, logger, configureLogger };
