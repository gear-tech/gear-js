import { HexString } from '@gear-js/api';

export interface AddMetaDetailsParams {
  hash?: string;
  codeHash?: string;
  hex: HexString;
}

export type AddMetahashParams = Array<[string, Array<string>]>;

export interface GetMetaParams {
  hash?: string;
  codeHash?: string;
}
