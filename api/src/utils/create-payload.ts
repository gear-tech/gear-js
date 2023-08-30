import { hexToU8a, isHex, isU8a } from '@polkadot/util';
import { Codec } from '@polkadot/types/types';
import { HexString } from '@polkadot/util/types';

import { GearMetadata, ProgramMetadata, isProgramMeta } from '../metadata';
import { CreateType } from '../metadata';

export function getRegistry(metaOrHexRegistry: HexString): HexString {
  if (!metaOrHexRegistry) {
    return undefined;
  }

  if (isHex(metaOrHexRegistry)) {
    return metaOrHexRegistry;
  }
}

export function encodePayload(
  payload: unknown,
  hexRegistryOrMeta: HexString | ProgramMetadata,
  type: string,
  typeIndexOrPayloadType?: number | string,
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

  const [reg, meta] = isProgramMeta(hexRegistryOrMeta)
    ? [undefined, hexRegistryOrMeta]
    : [hexRegistryOrMeta, undefined];

  const [typeIndex, payloadType] =
    typeof typeIndexOrPayloadType === 'number'
      ? [typeIndexOrPayloadType, undefined]
      : [undefined, typeIndexOrPayloadType];

  let result: Codec;

  if (meta) {
    if (typeIndex || typeIndex === 0) {
      result = meta.createType(typeIndex, payload);
    } else if (payloadType) {
      const index = meta.getTypeIndexByName(payloadType);
      if (index === null) {
        result = CreateType.create(payloadType, payload);
      } else {
        result = meta.createType(meta.getTypeIndexByName(payloadType), payload);
      }
    } else {
      const withType = type === 'reply' ? meta.types[type] : meta.types[type].input;

      result = meta.createType(withType, payload);
    }
  } else if (reg) {
    if (typeIndex || typeIndex === 0) {
      result = new GearMetadata(reg).createType(typeIndex, payload);
    } else {
      result = CreateType.create(payloadType, payload, reg);
    }
  } else if (payloadType) {
    result = CreateType.create(payloadType, payload);
  } else {
    result = CreateType.create('Bytes', payload);
  }

  return Array.from(result.toU8a());
}
