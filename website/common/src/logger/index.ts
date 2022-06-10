import { createLogger, format, transports } from 'winston';
import chalk from 'chalk';

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

const customFormat2 = format.printf(({ level, message, label, timestamp }) => {
  return `${chalk.cyan(timestamp)} ${level} ${chalk.magenta(`[${label}]`)} ${message}`;
});

const loggerWithLabel = (labelName: string) =>
  createLogger({
    level: 'debug',
    format: format.combine(
      format((info) => {
        info.level = info.level.toUpperCase();
        return info;
      })(),
      format.colorize(),
      format.label({ label: labelName }),
      format.timestamp({ format: 'HH:mm:ss' }),
      customFormat2,
    ),
    transports: [new transports.Console()],
  });

const logger = createLogger({
  format: customFormat,
  transports: [new transports.Console({ level: 'silly' })],
});

export { logger, loggerWithLabel };
