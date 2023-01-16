import { Hex, ProgramMetadata } from '@gear-js/api';

interface IMeta {
  hash: Hex;
  types: ProgramMetadata['types'];
}

export type { IMeta };
