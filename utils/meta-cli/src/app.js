#!/usr/bin/env node

import { Command } from 'commander';
import { setupCommands } from './commands.js';
import { Action } from './action.js';

const program = new Command();
const action = new Action(program);
setupCommands(program, action);

program.showHelpAfterError();
program.showSuggestionAfterError();
program.version('0.1.0', '-v, --version');
program.description('GEAR. CLI tool to encode / decode payloads and work with .meta.wasm files');
program.parse(process.argv);
