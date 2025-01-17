import { createLogger, format, transports } from 'winston';

const TIMESTAMP_FORMAT = 'YY-MM-DD HH:mm:ss';

export const logger = createLogger({
  format: format.combine(
    format.timestamp({ format: TIMESTAMP_FORMAT }),
    format(({ timestamp, level, message, ...rest }) => {
      return { ts: timestamp, level, message, ...rest };
    })(),
    format.json({ bigint: true, deterministic: false }),
  ),
  transports: [new transports.Console()],
  exitOnError: false,
});
