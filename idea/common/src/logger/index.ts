import { createLogger, format, transports } from 'winston';

const TIMESTAMP_FORMAT = 'DD/MM/YY HH:mm:ss';

function customFormat(serviceLabel?: string) {
  const formats = [
    format.timestamp({ format: TIMESTAMP_FORMAT }),
    format.printf(({ level, message, timestamp }) => {
      return `[${level}] ${timestamp}: ${message}`;
    }),
  ];

  if (process.env.DEV) {
    formats.unshift(format.label({ label: serviceLabel ? serviceLabel : '', message: true }), format.colorize());
  }

  return format.combine(...formats);
}

export const getLogger = (serviceLabel?: string) =>
  createLogger({
    format: customFormat(serviceLabel),
    transports: [new transports.Console()],
  });
