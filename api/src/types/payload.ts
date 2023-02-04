import { AnyJson } from '@polkadot/types/types';
import { Bytes } from '@polkadot/types';
import { HexString } from '@polkadot/util/types';

export type PayloadType = HexString | Uint8Array | string | Bytes | AnyJson;
