import chalk from 'chalk';

export default {
  info: (message: string) => console.log(`${chalk.cyan('INFO')} ${message}`),
  error: (message: string) => console.log(`${chalk.cyan('ERROR')} ${message}`),
};
