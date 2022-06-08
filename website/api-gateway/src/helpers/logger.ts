import { createLogger, format, transports } from 'winston';

const customFormat = format.combine(
  format.timestamp(),
  format.printf((info) => {
    return `${info.timestamp} - [${info.level.toUpperCase().padEnd(7)}] - ${info.message}`;
  }),
);

export const logger = createLogger({
  format: customFormat,
  transports: [new transports.Console({ level: 'silly' })],
});
