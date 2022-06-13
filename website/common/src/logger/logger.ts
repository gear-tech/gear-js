import { createLogger, format, transports } from 'winston';

const LOGGER_TIMESTAMP_FORMAT = 'DD/mm/YY HH:mm:ss';

function customFormat(serviceLabel: string) {
  return format.combine(
    format.timestamp({ format: LOGGER_TIMESTAMP_FORMAT }),
    format.colorize(),
    format.label({ label: serviceLabel }),
    format.align(),
    format.printf((info) => {
      const { timestamp, level, message, ...args } = info;

      const ts = timestamp.slice(0, 19).replace('T', ' ');
      return `${ts} [${level}]: ${message} ${Object.keys(args).length ? JSON.stringify(args, null, 2) : ''}`;
    }),
  );
}

export const initLogger = (serviceLabel: string) =>
  createLogger({
    format: customFormat(serviceLabel),
    transports: [new transports.Console()],
  });
