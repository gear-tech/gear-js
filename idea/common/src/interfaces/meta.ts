import { ProgramMetadata } from '@gear-js/api';

export interface IMeta {
  id: string;
  hash: string;
  types: ProgramMetadata | string,
}
