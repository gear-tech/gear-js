import chalk from 'chalk';
import { Command } from 'commander';
import { Action } from './action.js';

const options = {
  type: ['-t, --type <type>', 'Type to encode or decode the payload. If it will not specified you can select it later'],
  meta: ['-m, --meta <path>', `Path to ${chalk.blue('.meta.wasm')} file with program's metadata`],
  output: ['-o --output <path>', `Output json file. If it doesn't exist it will be created`],
  payloadFromJson: ['-j --payloadFromJson', `If it's necessary to take the payload from json`],
};

/**
 *
 * @param {Command} program
 * @param {Action} action
 */
export function setupCommands(program, action) {
  program
    .command('decode')
    .description(`${chalk.green('Decode')} payload ${chalk.blue('from')} hex`)
    .argument('[payload]', 'payload or path to json file with payload if option [-j --payloadFromJson] is specified')
    .action((payload) => {
      action.processCreate(payload, false);
    });

  program
    .command('encode')
    .description(`${chalk.green('Encode')} payload ${chalk.blue('to')} hex`)
    .argument('[payload]', 'payload or path to json file with payload if option [-j --payloadFromJson] is specified')
    .action((payload) => {
      action.processCreate(payload, true);
    });

  program
    .command('meta')
    .description(`${chalk.green('Display metadata')} from ${chalk.blue('.meta.wasm')}`)
    .argument('[path]', `Path to ${chalk.blue('.meta.wasm')} file`)
    .action((path) => {
      action.processMeta(path);
    });

  program
    .command('type')
    .description(`${chalk.green('Display type structure')} for particular type from ${chalk.blue('.meta.wasm')}`)
    .argument('[typeName]', 'Type name')
    .action((typeName) => {
      action.processType(typeName);
    });

  program.commands.forEach((command) => {
    switch (command.name()) {
      case 'decode':
        Object.values(options).forEach((option) => {
          command.option(...option);
        });
        break;
      case 'encode':
        Object.values(options).forEach((option) => {
          command.option(...option);
        });
        break;
      case 'meta':
        command.option(...options.output);
        break;
      case 'type':
        command.option(...options.meta);
        break;
    }
  });

  Object.values(options).forEach((option) => {
    program.option(...option);
  });
}
