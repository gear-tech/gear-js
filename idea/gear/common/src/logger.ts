import winston, { format, transports } from 'winston';

const TIMESTAMP_FORMAT = 'YY-MM-DD HH:mm:ss';

const DEV_NODE_ENV = ['dev', 'test', 'development'];

export const createLogger = (ctx?: string) => {
  const logFormat = DEV_NODE_ENV.includes(process.env.NODE_ENV)
    ? format.combine(
        format.colorize(),
        format.timestamp({ format: TIMESTAMP_FORMAT }),
        format.printf(({ timestamp, level, message, ...meta }) => {
          return `${timestamp}${ctx ? ' [' + ctx + ']' : ''} ${level}: ${message} ${
            Object.keys(meta).length
              ? JSON.stringify(meta, (_, value) => (typeof value === 'bigint' ? value.toString() : value))
              : ''
          }`;
        }),
      )
    : format.combine(
        format.timestamp({ format: TIMESTAMP_FORMAT }),
        format(({ timestamp, level, message, ...rest }) => {
          return { ts: timestamp, ctx, level, message, ...rest };
        })(),
        format.json({ bigint: true, deterministic: false }),
      );

  return winston.createLogger({
    format: logFormat,
    transports: [new transports.Console()],
    level: process.env.LOG_LEVEL || 'info',
  });
};

export const logger = createLogger(undefined);
