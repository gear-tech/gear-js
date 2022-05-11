import { IMessage } from './message';
import { IPaginationResult } from './pagination';
import { IProgram } from './program';

export interface AllMessagesResult extends IPaginationResult {
  messages: IMessage[];
}

export interface GetAllProgramsResult extends IPaginationResult {
  programs: IProgram[];
}

export interface AddMetaResult {
  status: 'Metadata added';
}

export interface GetMetaResult {
  program: string;
  meta: string;
  metaFile: string;
}

export interface ProgramDataResult extends Omit<IProgram, 'meta'> {
  meta?: { meta?: string };
}
