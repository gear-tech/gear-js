import { HexString } from '@gear-js/api';

export interface AddMetaDetailsParams {
  hash?: string;
  codeHash?: string;
  hex: HexString;
}

export interface AddMetahashParams {
  codeId: string;
  metahash: string;
}

export interface GetMetaParams {
  hash?: string;
  codeHash?: string;
}
