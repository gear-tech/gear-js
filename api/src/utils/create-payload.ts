import { hexToU8a, isHex, isU8a } from '@polkadot/util';
import { HexString } from '@polkadot/util/types';

import { GearMetadata, ProgramMetadata, isProgramMeta } from '../metadata';
import { CreateType } from '../metadata';
import { HumanProgramMetadataRepr } from '../types';

export function getRegistry(metaOrHexRegistry: HexString): HexString {
  if (!metaOrHexRegistry) {
    return undefined;
  }

  if (isHex(metaOrHexRegistry)) {
    return metaOrHexRegistry;
  }
}

export function encodePayload<T = keyof Omit<HumanProgramMetadataRepr, 'reg' | 'state' | 'signal'>>(
  payload: unknown,
  hexRegistryOrMeta: HexString | ProgramMetadata,
  type: T,
  typeIndexOrMessageType?: number | string,
): Array<number> {
  if (payload === undefined) {
    return [];
  }

  if (isHex(payload)) {
    return Array.from(hexToU8a(payload));
  }

  if (isU8a(payload)) {
    return Array.from(payload);
  }

  if (isProgramMeta(hexRegistryOrMeta)) {
    return Array.from(
      hexRegistryOrMeta
        .createType(
          hexRegistryOrMeta.types[type as keyof Omit<HumanProgramMetadataRepr, 'reg' | 'state' | 'signal'>].input,
          payload,
        )
        .toU8a(),
    );
  }

  if (isHex(hexRegistryOrMeta)) {
    if (typeof typeIndexOrMessageType === 'number') {
      return Array.from(new GearMetadata(hexRegistryOrMeta).createType(typeIndexOrMessageType, payload).toU8a());
    } else {
      return Array.from(CreateType.create(typeIndexOrMessageType, payload, hexRegistryOrMeta).toU8a());
    }
  }

  if (typeof typeIndexOrMessageType === 'string') {
    return Array.from(CreateType.create(typeIndexOrMessageType, payload).toU8a());
  }

  return Array.from(CreateType.create('Bytes', payload).toU8a());
}
