import { logLevel } from 'kafkajs';
import winston from 'winston';

import { initLogger } from './logger';

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

export const kafkaLogger = (logLevel: logLevel) => {
  const logger = winston.createLogger({
    level: toWinstonLogLevel(logLevel),
    transports: [new winston.transports.Console()],
  });

  // @ts-ignore
  return ({ namespace, level, label, log }) => {
    const { message, ...extra } = log;
    initLogger('Kafka').log({
      level: toWinstonLogLevel(level),
      message,
      extra,
    });
  };
};
