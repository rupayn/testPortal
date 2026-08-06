import { createLogger, format, transports } from "winston";

const { combine, timestamp, json, colorize, printf, errors } = format;

const isDev = process.env.NODE_ENV !== "production";
const logLevel = process.env.LOG_LEVEL ?? (isDev ? "debug" : "info");

// Console: human-readable, colorized, no timestamp clutter
const consoleFormat = combine(
  colorize(),
  printf(({ level, message }) => `${level}: ${message}`)
);

// File: structured JSON, no color codes, includes timestamp + stack traces
const fileFormat = combine(timestamp(), errors({ stack: true }), json());

export const logger = createLogger({
  level: logLevel,
  format: fileFormat,
  transports: isDev
    ? [new transports.Console({ format: consoleFormat })]
    : [
        new transports.File({ filename: "app.log", format: fileFormat }),
        new transports.Console({ format: fileFormat }),
      ],
});

export function configureLogger() {
  const isDevRuntime = process.env.NODE_ENV !== "production";
  logger.transports.forEach((t) => {
    if (t instanceof transports.Console) {
      t.level = isDevRuntime ? "debug" : "warn";
    }
  });
}
