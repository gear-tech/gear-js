import { ProgramMetadata } from '@gear-js/api';

export interface IMeta {
  id: number;
  hex: string;
  types: ProgramMetadata | string,
}
