import { Command } from 'commander';
import { processGenerate } from './action.js';
import { checkPath, checkTarget } from './check.js';

export function setupCommands(program: Command) {
  program
    .argument(`[path]`, 'Path to pkg with files generated using wasm-bindgen')
    .option('--ts [ts]', `Generate typescript wrapper`)
    .option('-t --target [target]', `What type of output to generate, valid values are [web, nodejs]`, 'web')
    .version('0.0.1')
    .action(async (path, options) => {
      processGenerate(await checkPath(path), options.ts, await checkTarget(options.target));
    });
}
