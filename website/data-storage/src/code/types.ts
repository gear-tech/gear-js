import { CODE_STATUS } from '@gear-js/common';

interface UpdateCodeInput {
  id: string;
  status: CODE_STATUS;
  genesis: string;
  timestamp: number;
  blockHash: string;
  expiration?: number | null;
}

export { UpdateCodeInput };
