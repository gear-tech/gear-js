#!/usr/bin/env node

import { Command } from 'commander';
import { setupCommands } from './commands.js';
import { Action } from './action.js';

const program = new Command();
const action = new Action(program);
setupCommands(program, action);

program.showHelpAfterError();
program.showSuggestionAfterError();
program.parse(process.argv);
