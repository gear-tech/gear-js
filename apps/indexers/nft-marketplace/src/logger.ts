import { createLogger, format, transports } from 'winston';
import chalk from 'chalk';

const { combine, printf } = format;

const actionFormat = printf(({ message, label }) => `${chalk.magenta('[')}${label}${chalk.magenta(']')} ${message}`);

const logger = createLogger({
  level: 'info',
  format: combine(actionFormat),
  transports: [new transports.Console()],
});

export const actionLog = (action: string, msg: string) => logger.info(msg, { label: chalk.cyan(action) });

export const errorLog = (msg: string) => logger.info(msg, { label: chalk.red('ERROR') });
