import winston from 'winston';
import chalk from 'chalk';

const {
  createLogger,
  format,
  format: { printf, combine, colorize, timestamp, label },
  transports,
} = winston;

const logFormat = printf(({ level, message, label, timestamp }) => {
  return `${chalk.cyan(timestamp)} ${level} ${chalk.magenta(`[${label}]`)} ${message}`;
});

export const logger = (labelName: string) =>
  createLogger({
    level: 'debug',
    format: combine(
      format((info) => {
        info.level = info.level.toUpperCase();
        return info;
      })(),
      colorize(),
      label({ label: labelName }),
      timestamp({ format: 'HH:mm:ss' }),
      logFormat,
    ),
    transports: [new transports.Console()],
  });
