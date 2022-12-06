import { isHex, isU8a, u8aToHex } from '@polkadot/util';
import { HexString } from '@polkadot/util/types';

import { HumanProgramMetadata, HumanStateMetadata, OldMetadata } from '../types';
import { isOldMeta, isProgramMeta, Metadata } from '../metadata';
import { CreateType } from '../create-type/CreateType';

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
>(payload: unknown, hexRegistryOrMeta: HexString | M, type: T, typeIndexOrMessageType?: number | string): HexString {
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
    return new Metadata(registry)
      .createType(hexRegistryOrMeta[type as keyof Omit<HumanProgramMetadata, 'reg' | 'state'>].input, payload)
      .toHex();
  } else if (isOldMeta(hexRegistryOrMeta)) {
    return CreateType.create(hexRegistryOrMeta[type as keyof OldMetadata], payload, hexRegistryOrMeta.types).toHex();
  } else {
    if (typeof typeIndexOrMessageType === 'number') {
      return new Metadata(registry).createType(typeIndexOrMessageType, payload).toHex();
    } else {
      return CreateType.create(typeIndexOrMessageType, payload, registry).toHex();
    }
  }
}
