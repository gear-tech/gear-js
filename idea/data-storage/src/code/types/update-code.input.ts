import { CodeStatus } from '@gear-js/common';

import { Meta } from '../../database/entities';

export interface CreateCodeInput {
  id: string;
  name: string;
  status?: CodeStatus | null;
  genesis: string;
  timestamp: Date;
  blockHash: string;
  expiration?: string | null;
  uploadedBy: string;
  meta?: Meta;
}
