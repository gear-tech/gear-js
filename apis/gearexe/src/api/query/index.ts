import { Block } from './block';
import { ProgramQueries } from './program';

export const query = { block: Block, program: ProgramQueries } as const;

export type Query = {
  block: Block;
  program: ProgramQueries;
};
