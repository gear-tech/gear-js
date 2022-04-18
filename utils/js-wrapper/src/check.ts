import inquirer from 'inquirer';
import logger from './logger.js';
import { Target } from './interfaces.js';

export async function checkPath(path: string): Promise<string> {
  if (path === undefined) {
    const { path } = await inquirer.prompt([
      { type: 'input', name: 'path', message: 'Enter path to pkg with files generated using wasm-bindgen' },
    ]);
    return path;
  }
  return path;
}

export async function checkTarget(target: Target): Promise<Target> {
  if (!['web', 'nodejs', 'bundler'].includes(target)) {
    let { target } = await inquirer.prompt([
      {
        type: 'input',
        name: 'target',
        message: 'Enter type of output to generate, valid values are [web, nodejs, bundler]',
      },
    ]);
    if (!['web', 'nodejs', 'bundler'].includes(target)) {
      target = 'bundler';
      logger.info('Target set to bundler');
    }
    return target;
  }
  return target;
}
