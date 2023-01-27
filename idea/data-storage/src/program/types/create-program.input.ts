import { Code, Meta } from '../../database/entities';

export interface CreateProgramInput {
  id: string;
  owner: string;
  genesis: string;
  timestamp: number;
  blockHash: string;
  code: Code;
  meta?: Meta;
}
