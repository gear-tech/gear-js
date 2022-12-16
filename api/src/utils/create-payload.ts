import { isHex, isString, isU8a, u8aToHex } from '@polkadot/util';
import { HexString } from '@polkadot/util/types';

import { HumanProgramMetadataRepr, OldMetadata } from '../types';
import { isOldMeta, isProgramMeta, ProgramMetadata, GearMetadata, isStateMeta } from '../metadata';
import { CreateType } from '../create-type/CreateType';

export function getRegistry(metaOrHexRegistry: HexString | OldMetadata): HexString {
  if (!metaOrHexRegistry) {
    return undefined;
  }

  if (isHex(metaOrHexRegistry)) {
    return metaOrHexRegistry;
  }

  if (isOldMeta(metaOrHexRegistry)) {
    return metaOrHexRegistry.types;
  }
}

export function encodePayload<
  M extends OldMetadata | GearMetadata = OldMetadata | GearMetadata,
  T = M extends ProgramMetadata
    ? keyof Omit<HumanProgramMetadataRepr, 'reg' | 'state'>
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

  if (isProgramMeta(hexRegistryOrMeta)) {
    return hexRegistryOrMeta
      .createType(
        hexRegistryOrMeta.types[type as keyof Omit<HumanProgramMetadataRepr, 'reg' | 'state' | 'signal'>].input,
        payload,
      )
      .toHex();
  } else if (isOldMeta(hexRegistryOrMeta)) {
    return CreateType.create(
      isString(typeIndexOrMessageType) ? typeIndexOrMessageType : hexRegistryOrMeta[type as keyof OldMetadata],
      payload,
      hexRegistryOrMeta.types,
    ).toHex();
  } else if (isStateMeta(hexRegistryOrMeta)) {
    // TODO
  } else if (isHex(hexRegistryOrMeta)) {
    if (typeof typeIndexOrMessageType === 'number') {
      return new GearMetadata(hexRegistryOrMeta).createType(typeIndexOrMessageType, payload).toHex();
    } else {
      return CreateType.create(typeIndexOrMessageType, payload, hexRegistryOrMeta).toHex();
    }
  }
}
