import { Meta } from '../database/entities';

interface CreateProgramInput {
  id: string;
  owner: string;
  genesis: string;
  timestamp: number;
  blockHash: string;
}

interface UpdateProgramDataInput {
  id: string;
  genesis: string;
  name?: string;
  title?: string;
  meta?: Meta;
}

export { CreateProgramInput, UpdateProgramDataInput };
