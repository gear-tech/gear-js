import { CodeStatus } from '@gear-js/common';

interface UpdateCodeInput {
  id: string;
  status: CodeStatus;
  genesis: string;
  timestamp: number;
  blockHash: string;
  expiration?: number | null;
}

export { UpdateCodeInput };
