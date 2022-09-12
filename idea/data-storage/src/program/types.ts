import { Code, Meta } from '../database/entities';

interface CreateProgramInput {
  id: string;
  owner: string;
  genesis: string;
  timestamp: number;
  blockHash: string;
  code: Code
}

interface UpdateProgramDataInput {
  id: string;
  genesis: string;
  name?: string;
  title?: string;
  meta?: Meta;
}

export { CreateProgramInput, UpdateProgramDataInput };
