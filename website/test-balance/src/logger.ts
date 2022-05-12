import { createLogger, format, transports } from 'winston';
import { logLevel } from 'kafkajs';
import chalk from 'chalk';

const { printf, combine, colorize, timestamp, label } = format;

const logFormat = printf(({ level, message, label, timestamp }) => {
  return `${chalk.cyan(timestamp)} ${level} ${chalk.magenta(`[${label}]`)} ${message}`;
});

export const Logger = (labelName: string) =>
  createLogger({
    level: 'debug',
    format: combine(
      format((info) => {
        info.level = info.level.toUpperCase();
        return info;
      })(),
      colorize(),
      label({ label: labelName }),
      timestamp({ format: 'DD/mm/YY HH:mm:ss' }),
      logFormat,
    ),
    transports: [new transports.Console()],
  });

const toWinstonLogLevel = (level: logLevel) => {
  switch (level) {
    case logLevel.ERROR:
    case logLevel.NOTHING:
      return 'error';
    case logLevel.WARN:
      return 'warn';
    case logLevel.INFO:
      return 'info';
    case logLevel.DEBUG:
    default:
      return 'debug';
  }
};

export const KafkaLogger =
  (loggerLevel: logLevel) =>
  ({ log: { message, ...extra } }) => {
    const { timestamp, logger, ...extraFields } = extra;
    return Logger('Kafka').log({
      level: toWinstonLogLevel(loggerLevel),
      message: `${message} ${JSON.stringify(extraFields)}`,
    });
  };
