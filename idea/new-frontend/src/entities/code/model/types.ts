import { CodeStatus } from './consts';

interface ICode {
  id: string;
  name: string;
  status: CodeStatus;
  expiration: null | number;
  genesis: string;
  blockHash: string | null;
  timestamp: string;
}

export type { ICode };
