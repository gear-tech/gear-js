#!/usr/bin/env node

import { Command } from 'commander';
import path from 'path';
import generate from './generate/generate.js';

export const program = new Command();

program
  .argument('<path>', 'Path to scheme.json')
  .option('-o --output-dir <out>', 'Path to output directory', path.resolve())
  .action((path, options) => {
    const out = options.outputDir;
    generate(path, out);
  });

program
  .name('gear-program-lib-gen')
  .description('CLI tool to generate typescript library for gear programs')
  .version('0.0.1')
  .showHelpAfterError()
  .showSuggestionAfterError()
  .parse();
