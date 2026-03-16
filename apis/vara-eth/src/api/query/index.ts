import { Block } from './block.js';
import { CodeQueries } from './code.js';
import { ProgramQueries } from './program.js';

export const query = { block: Block, code: CodeQueries, program: ProgramQueries } as const;

export type Query = {
  block: Block;
  code: CodeQueries;
  program: ProgramQueries;
};
