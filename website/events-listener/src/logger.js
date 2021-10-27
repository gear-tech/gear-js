import winston from 'winston';
import chalk from 'chalk';

const {
  createLogger,
  format: { printf, combine, colorize, timestamp, label },
  transports,
} = winston;

const logFormat = printf(({ level, message, label, timestamp }) => {
  return `${chalk.yellow(timestamp)} ${level} ${chalk.greenBright(`[${label}]`)} ${message}`;
});

export const logger = (labelName) =>
  createLogger({
    level: 'debug',
    format: combine(colorize(), label({ label: labelName }), timestamp({ format: 'HH:mm:ss' }), logFormat),
    transports: [new transports.Console()],
  });
