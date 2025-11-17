import { Block } from './block.js';
import { ProgramQueries } from './program.js';

export const query = { block: Block, program: ProgramQueries } as const;

export type Query = {
  block: Block;
  program: ProgramQueries;
};
