import { HexString } from '@gear-js/api';

import { PaginationParameters } from '@/api';

import { CodeStatus } from '@/entities/code';
import { IBase } from '@/shared/types';

type GetCodesParameters = PaginationParameters & {
  uploadedBy?: string;
  name?: string;
  status?: CodeStatus;
  query?: string;
};

type SetCodeMetaParameters = {
  id: string;
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

export type { GetCodesParameters, SetCodeMetaParameters, Code };
