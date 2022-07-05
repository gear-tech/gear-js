import { CODE_STATUS } from '@gear-js/common';

interface CreateCodeInput {
  id: string;
  status: CODE_STATUS;
  genesis: string;
  timestamp: number;
  blockHash: string;
  expiration?: number | null;
}

interface UpdateCodeInput {
  id: string;
  genesis: string;
  name?: string;
  status?: CODE_STATUS;
}

export { CreateCodeInput, UpdateCodeInput };
