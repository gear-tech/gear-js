import chalk from 'chalk';
import winston, { format, transports } from 'winston';

const getLvl = (lvl: number, kind: string): [string, string, (msg: string) => string] => {
  switch (lvl) {
    case 0:
      return ['[*] ', '', kind === 'warn' ? chalk.yellow : kind === 'error' ? chalk.red : chalk.blue];
    case 1:
      return ['[-] ', '  ', kind === 'warn' ? chalk.yellow : kind === 'error' ? chalk.red : chalk.green];
    default:
      return ['', '', kind === 'warn' ? chalk.yellow : kind === 'error' ? chalk.red : chalk.white];
  }
};

const myFormat = format.printf(({ level, message, lvl }) => {
  const [label, tab, _chalk] = getLvl(lvl as number, level);
  return `${tab}${_chalk(`${label}${message}`)}`;
});

export const logger = winston.createLogger({
  level: 'info',
  format: format.combine(format.json(), myFormat),
  transports: [new transports.Console()],
});
