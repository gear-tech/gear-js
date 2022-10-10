import { CodeStatus } from '@gear-js/common';

export interface UpdateCodeInput {
  id: string;
  status: CodeStatus | null;
  genesis: string;
  timestamp: number;
  blockHash: string;
  expiration?: string | null;
}
