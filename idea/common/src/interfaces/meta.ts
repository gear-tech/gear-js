import { ProgramMetadata } from '@gear-js/api';

export interface IMeta {
  id: string;
  hex: string;
  types: ProgramMetadata | string,
}
