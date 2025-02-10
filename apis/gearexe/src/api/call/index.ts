import { ProgramCalls } from './program.js';

export const call = {
  program: ProgramCalls,
} as const;

export type Call = {
  program: ProgramCalls;
};
