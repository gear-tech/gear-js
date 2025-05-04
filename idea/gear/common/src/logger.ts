import winston, { format, transports } from 'winston';

const TIMESTAMP_FORMAT = 'YY-MM-DD HH:mm:ss';

export const logger = winston.createLogger({
  format: format.combine(
    format.timestamp({ format: TIMESTAMP_FORMAT }),
    format(({ timestamp, level, message, ...rest }) => {
      return { ts: timestamp, level, message, ...rest };
    })(),
    format.json({ bigint: true, deterministic: false }),
  ),
  transports: [new transports.Console()],
  level: process.env.LOG_LEVEL || 'info',
});

export const createLogger = (ctx: string) =>
  winston.createLogger({
    format: format.combine(
      format.timestamp({ format: TIMESTAMP_FORMAT }),
      format(({ timestamp, level, message, ...rest }) => {
        return { ts: timestamp, ctx, level, message, ...rest };
      })(),
      format.json({ bigint: true, deterministic: false }),
    ),
    transports: [new transports.Console()],
    level: process.env.LOG_LEVEL || 'info',
  });
