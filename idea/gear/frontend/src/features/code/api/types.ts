import type { HexString } from '@gear-js/api';

import type { PaginationParameters } from '@/api';
import type { IBase } from '@/shared/types';

import type { CodeStatus } from '../consts';

type GetCodesParameters = PaginationParameters & {
  uploadedBy?: string;
  name?: string;
  status?: CodeStatus;
  query?: string;
};

type SetCodeMetaParameters = {
  id: HexString;
  name?: string;
  metaType?: 'sails' | 'meta';
};

type Code = IBase & {
  id: HexString;
  status: CodeStatus;
  uploadedBy: string | null;
  name: string | null;
  expiration?: string | null;
  metahash?: HexString | null;
  metaType?: 'sails' | 'meta' | null;
};

export type { Code, GetCodesParameters, SetCodeMetaParameters };
