import { hexToU8a, isHex, isString, isU8a } from '@polkadot/util';
import { HexString } from '@polkadot/util/types';

import { GearMetadata, ProgramMetadata, isOldMeta, isProgramMeta } from '../metadata';
import { HumanProgramMetadataRepr, OldMetadata } from '../types';
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
  M extends OldMetadata | ProgramMetadata = OldMetadata | ProgramMetadata,
  T = M extends ProgramMetadata
    ? keyof Omit<HumanProgramMetadataRepr, 'reg' | 'state'>
    : keyof Omit<OldMetadata, 'types' | 'title'>,
>(
  payload: unknown,
  hexRegistryOrMeta: HexString | M,
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
  } else if (isOldMeta(hexRegistryOrMeta)) {
    return Array.from(
      CreateType.create(
        isString(typeIndexOrMessageType) ? typeIndexOrMessageType : hexRegistryOrMeta[type as keyof OldMetadata],
        payload,
        hexRegistryOrMeta.types,
      ).toU8a(),
    );
  } else if (isHex(hexRegistryOrMeta)) {
    if (typeof typeIndexOrMessageType === 'number') {
      return Array.from(new GearMetadata(hexRegistryOrMeta).createType(typeIndexOrMessageType, payload).toU8a());
    } else {
      return Array.from(CreateType.create(typeIndexOrMessageType, payload, hexRegistryOrMeta).toU8a());
    }
  }
}
