import winston from "winston";
import { format } from "winston";

import morgan from "morgan";

const { timestamp, combine, json, colorize, prettyPrint } = format;

export const logger = winston.createLogger({
  level: "info",
  format: combine(timestamp(), json(), prettyPrint()),
  transports: [
    new winston.transports.Console(),
    //new winston.transports.File({ filename: "logs.log" })
  ],
});

const morganFormat =
  ":method :url :status :res[content-length] - :response-time ms";

export const morganMiddleware = morgan(morganFormat, {
  export: true,
  stream: { write: (message) => logger.info(message) },
});
