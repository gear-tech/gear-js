import { AnyJson } from '@polkadot/types/types';
import { Bytes } from '@polkadot/types';
import { Hex } from './common';

export type PayloadType = Hex | Uint8Array | string | Bytes | AnyJson;
