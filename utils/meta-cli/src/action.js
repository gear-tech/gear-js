import { resolve } from 'path';
import { readFileSync, writeFileSync } from 'fs';
import { createType, DEFAULT_TYPES, getTypeStruct } from './meta.js';
import { getWasmMetadata, isJSON } from '@gear-js/api';
import inquirer from 'inquirer';
import chalk from 'chalk';

async function checkType(type, meta) {
  if (type) {
    return type;
  }
  if (meta) {
    const { type } = await inquirer.prompt([
      {
        type: 'list',
        name: 'type',
        message: 'Select type',
        choices: DEFAULT_TYPES,
      },
    ]);
    return type;
  } else {
    const { type } = await inquirer.prompt([{ type: 'input', name: 'type', message: 'Enter type of payload' }]);
    return type;
  }
}

async function checkMeta(meta, required) {
  if (meta) {
    return meta;
  }
  const { metaRes } = required
    ? await inquirer.prompt([
        { type: 'input', name: 'metaRes', message: `Enter path to ${chalk.blue('.meta.wasm')} file` },
      ])
    : await inquirer.prompt([
        {
          type: 'confirm',
          name: 'confirm',
          message: `Do you want to specify ${chalk.blue('.meta.wasm')} file`,
        },
        {
          type: 'input',
          name: 'metaRes',
          message: `Enter path to ${chalk.blue('.meta.wasm')} file`,
          when(answers) {
            return answers.confirm;
          },
        },
      ]);

  return metaRes;
}

async function checkPayload(payload) {
  if (payload) {
    return payload;
  }
  const { payloadRes } = await inquirer.prompt([{ type: 'input', name: 'payloadRes', message: 'Enter payload' }]);
  return payloadRes;
}

export class Action {
  constructor(program) {
    this.program = program;
  }
  async processCreate(payload, isEncode) {
    try {
      let { type, meta, output, payloadFromJson } = this.program.opts();
      payload = await checkPayload(payload);
      meta = !type ? await checkMeta(meta, false) : meta;
      type = await checkType(type, !!meta);

      if (payloadFromJson) {
        payload = readFileSync(resolve(payload));
      }
      let result = await createType(payload, type, meta ? resolve(meta) : null);
      result = isEncode ? result.toHex() : result.toHuman();
      if (output) {
        writeFileSync(resolve(output), isJSON(result) ? JSON.stringify(result) : result);
      } else {
        console.log(result);
      }
    } catch (error) {
      console.error(chalk.red(error.message));
      process.exit(1);
    }
    process.exit(0);
  }

  async processMeta(path) {
    try {
      path = await checkMeta(path, true);
      let { output } = this.program.opts();
      const result = await getWasmMetadata(readFileSync(resolve(path)));
      if (output) {
        writeFileSync(resolve(output), JSON.stringify(result));
      } else {
        console.log(result);
      }
      process.exit(0);
    } catch (error) {
      console.error(chalk.red(error.message));
      process.exit(1);
    }
  }

  async processType(type) {
    try {
      let { meta } = this.program.opts();
      meta = await checkMeta(meta, true);
      type = await checkType(type, !!meta);
      const { typeName, struct } = await getTypeStruct(type, meta);
      console.log('TypeName: ', chalk.green(`${typeName}`));
      console.log(struct);
      process.exit(0);
    } catch (error) {
      console.error(chalk.red(error.message));
      process.exit(1);
    }
  }
}
