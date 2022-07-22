import { createLogger, format, transports } from 'winston';

const LOGGER_TIMESTAMP_FORMAT = 'DD/MM/YY HH:mm:ss';

function customFormat(serviceLabel: string) {
  return format.combine(
    format.label({ label: serviceLabel ? serviceLabel : 'LOGGER', message: true }),
    format.colorize(),
    format.timestamp({ format: LOGGER_TIMESTAMP_FORMAT }),
    format.printf(({ level, message, timestamp }) => {
      return `${timestamp} ${level}: ${message}`;
    }),
  );
}

export const initLogger = (serviceLabel: string) =>
  createLogger({
    format: customFormat(serviceLabel),
    transports: [new transports.Console()],
  });
