import { Code, Meta } from '../../database/entities';

export interface CreateProgramInput {
  id: string;
  name: string;
  owner: string;
  genesis: string;
  timestamp: Date;
  blockHash: string;
  code: Code;
  meta?: Meta;
}
