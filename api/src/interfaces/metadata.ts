import { AnyJson } from '@polkadot/types/types';

export interface Metadata {
  init_input?: string;
  init_output?: string;
  input?: string;
  output?: string;
  types?: string | Uint8Array | AnyJson;
}
