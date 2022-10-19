import { IBase } from 'shared/types';

import { CodeStatus } from './consts';

interface ICode extends IBase {
  _id: string;
  id: string;
  name: string;
  status: CodeStatus;
  expiration: string | null;
  uploadedBy: string;
}

export type { ICode };
