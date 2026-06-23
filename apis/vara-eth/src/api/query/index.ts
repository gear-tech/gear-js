import { BlockQueries } from './block.js';
import { CodeQueries } from './code.js';
import { InfoQueries } from './info.js';
import { InjectedQueries } from './injected.js';
import { ProgramQueries } from './program.js';

export const query = {
  block: BlockQueries,
  code: CodeQueries,
  program: ProgramQueries,
  injected: InjectedQueries,
  info: InfoQueries,
} as const;

export type Query = {
  block: BlockQueries;
  code: CodeQueries;
  program: ProgramQueries;
  injected: InjectedQueries;
  info: InfoQueries;
};
