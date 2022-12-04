import { isHex, isU8a, u8aToHex } from '@polkadot/util';
import { HexString } from '@polkadot/util/types';
import { Codec } from '@polkadot/types/types';

import { CreateType } from './CreateType';
import { isOldMeta, isProgramMeta, Metadata } from '../metadata';
import { HumanProgramMetadata, HumanStateMetadata, OldMetadata } from '../types';

export function getRegistry<M extends HumanProgramMetadata | HumanStateMetadata>(
  metaOrHexRegistry: M | HexString | OldMetadata,
): HexString {
  if (!metaOrHexRegistry) {
    return undefined;
  }

  if (isHex(metaOrHexRegistry)) {
    return metaOrHexRegistry;
  }

  if (isOldMeta(metaOrHexRegistry)) {
    return metaOrHexRegistry.types;
  }

  return metaOrHexRegistry.reg;
}

export function encodePayload<
  M extends OldMetadata | HumanProgramMetadata = OldMetadata | HumanProgramMetadata,
  T = M extends HumanProgramMetadata
    ? keyof Omit<HumanProgramMetadata, 'reg' | 'state'>
    : keyof Omit<OldMetadata, 'types' | 'title'>,
>(
  payload: unknown,
  hexRegistryOrMeta: HexString | M,
  type: T,
  typeIndexOrMessageType?: number | string,
): HexString | Uint8Array | Codec {
  if (payload === undefined) {
    return '0x';
  }

  if (isHex(payload)) {
    return payload;
  }

  if (isU8a(payload)) {
    return u8aToHex(payload);
  }

  const registry = getRegistry(hexRegistryOrMeta);

  if (isProgramMeta(hexRegistryOrMeta)) {
    return new Metadata(registry).createType(
      hexRegistryOrMeta[type as keyof Omit<HumanProgramMetadata, 'reg' | 'state'>].input,
      payload,
    );
  } else if (isOldMeta(hexRegistryOrMeta)) {
    return CreateType.create(hexRegistryOrMeta[type as keyof OldMetadata], payload);
  } else {
    if (typeof typeIndexOrMessageType === 'number') {
      return new Metadata(registry).createType(typeIndexOrMessageType, payload);
    } else {
      return CreateType.create(typeIndexOrMessageType, payload, registry);
    }
  }
}
