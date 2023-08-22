import { createLogger, format, transports } from 'winston';

const TIMESTAMP_FORMAT = 'YY-MM-DD HH:mm:ss';

export const logger = createLogger({
  format: format.combine(
    format.timestamp({ format: TIMESTAMP_FORMAT }),
    format.printf(({ level, message, timestamp, ...meta }) => {
      const msg = { message, ...meta };

      return `${timestamp} [${level}] ${JSON.stringify(msg)}`;
    }),
  ),
  transports: [new transports.Console()],
});
