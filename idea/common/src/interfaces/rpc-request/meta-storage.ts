import { HexString } from '@gear-js/api';

export interface AddMetaDetailsParams {
  hash: string;
  hex: HexString;
}

export interface AddMetahashParams {
  metahash: string;
}

export interface GetMetaParams {
  hash: string;
  hex: HexString;
}
