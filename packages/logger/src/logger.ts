import { createLogger, format, transports } from "winston";

const { combine, timestamp, json, colorize, printf, errors } = format;

const isDev = process.env.NODE_ENV !== "production";

const consoleFormat = combine(
  colorize(),
  printf(({ level, message }) => `${level}: ${message}`)
);

const fileFormat = combine(timestamp(), errors({ stack: true }), json());

export const logger = createLogger({
  // Logger must allow INFO so the file can receive it.
  level: isDev ? "debug" : "info",

  transports: isDev
    ? [
        // Development: everything
        new transports.Console({
          level: "debug",
          format: consoleFormat,
        }),
      ]
    : [
        // Production: INFO + WARN + ERROR
        new transports.File({
          filename: "app.log",
          level: "info",
          format: fileFormat,
        }),

        // Production: WARN + ERROR only
        new transports.Console({
          level: "warn",
          format: fileFormat,
        }),
      ],
});
