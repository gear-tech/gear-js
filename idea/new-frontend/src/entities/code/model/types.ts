import { CodeStatus } from './consts';

type CodeModel = {
  id: string;
  name: string;
  status: CodeStatus;
  expiration: null | number;
  genesis: string;
  blockHash: string | null;
  timestamp: string;
};

export type { CodeModel };
