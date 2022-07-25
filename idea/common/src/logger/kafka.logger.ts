import { logLevel } from 'kafkajs';

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

export const kafkaLogger = () => {
  return ({ level, log }: any) => {
    const { message, ...extra } = log;
    initLogger('Kafka').log({
      level: toWinstonLogLevel(level),
      message,
      extra,
    });
  };
};
