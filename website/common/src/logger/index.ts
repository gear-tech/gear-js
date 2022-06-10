import { createLogger, format, transports } from 'winston';

const customFormat = format.combine(
  format.timestamp(),
  format.colorize(),
  format.align(),
  format.printf((info) => {
    const { timestamp, level, message, ...args } = info;

    const ts = timestamp.slice(0, 19).replace('T', ' ');
    return `${ts} [${level}]: ${message} ${Object.keys(args).length ? JSON.stringify(args, null, 2) : ''}`;
  }),
);

const logger = createLogger({
  format: customFormat,
  transports: [new transports.Console({ level: 'silly' })],
});

export { logger };
