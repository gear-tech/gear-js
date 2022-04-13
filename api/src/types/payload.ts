import { Hex } from './common';
import { Bytes } from '@polkadot/types';
import { AnyJson } from '@polkadot/types/types';

export type PayloadType = Hex | Uint8Array | string | Bytes | AnyJson;
