#!/usr/bin/env node

import { program } from 'commander';
import { logger } from './utils';
import { runWorkflow } from './workflows';
import chalk from 'chalk';

program.version('0.0.1').name('gear-js').description('CLI to interaction with Gear protocol');

program
  .command('workflow')
  .argument('<pathToYaml>', 'Path to workflow file')
  .option(
    '-a, --arguments <args...>',
    `Custom arguments to replace $cli in payloads.\nExample: ${chalk.green('-a arg1=value1 arg2=value2')}`,
  )
  .action((pathToYaml, options) => {
    const args = {};
    if (options.arguments) {
      options.arguments.forEach((arg: string) => {
        if (!arg.includes('=')) {
          logger.error(`The arguments don't fit the format. Run ${chalk.yellow('help workflow')} command for details`);
          process.exit(1);
        }
        const [name, value] = arg.split('=');
        args[name] = value;
      });
    }
    runWorkflow(pathToYaml, options.arguments || [])
      .catch((err) => {
        logger.error(err, { lvl: 0 });
        console.log(err);
        process.exit(1);
      })
      .then(() => process.exit(0));
  });

program.parse();
