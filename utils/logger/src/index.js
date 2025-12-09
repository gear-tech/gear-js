import pino from 'pino';

const DEV_ENV = ['development', 'dev', 'test'];

export function createLogger(label) {
  const isDev = DEV_ENV.includes(process.env.NODE_ENV);

  const options = {
    name: label,
    timestamp: pino.stdTimeFunctions.isoTime,
    level: process.env.LOG_LEVEL || 'info',
  };

  if (isDev) {
    return pino(
      options,
      pino.transport({
        target: 'pino-pretty',
        options: {
          colorize: true,
          translateTime: 'HH:MM:ss',
          ignore: 'pid,hostname',
        },
      }),
    );
  }

  return pino(options);
}
