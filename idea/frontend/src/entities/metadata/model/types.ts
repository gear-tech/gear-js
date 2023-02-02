import { ProgramMetadata } from '@gear-js/api';
import { HexString } from '@polkadot/util/types';

interface IMeta {
  hex: HexString;
  types: ProgramMetadata['types'];
}

export type { IMeta };
