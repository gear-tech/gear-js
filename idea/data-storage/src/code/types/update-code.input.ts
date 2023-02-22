import { CodeStatus } from '@gear-js/common';

import { Meta } from '../../database/entities';

export interface UpdateCodeInput {
  id?: string;
  status?: CodeStatus | null;
  genesis: string;
  timestamp: number;
  blockHash: string;
  expiration?: string | null;
  uploadedBy: string;
  meta?: Meta;
}
