import { isHex } from '@polkadot/util';
import { Hex, Metadata } from '../interfaces';
import { CreateType } from '../create-type/CreateType';
import { blake2AsHex } from '@polkadot/util-crypto';
import { Bytes } from '@polkadot/types';

export function createPayload(createType: CreateType, type: any, data: any, meta?: Metadata): Hex {
  if (data === undefined) {
    return '0x00';
  }
  if (isHex(data)) {
    return data;
  }
  let payload = data;
  if (meta && type) {
    const encoded = createType.create(type, data, meta);
    payload = isHex(encoded) ? encoded : encoded.toHex();
  } else if (type) {
    try {
      const encoded = createType.create(type, data);
      payload = isHex(encoded) ? encoded : encoded.toHex();
    } catch (error) {
      console.error(error.message);
    }
  }
  return payload;
}

export function generateCodeHash(code: Buffer): Hex {
  const id = new Uint8Array(code.byteLength);
  id.set(code);

  const codeArr = CreateType.create('Bytes', code).toU8a().slice(2);
  const testId = new Uint8Array(codeArr.byteLength);
  testId.set(codeArr);
  return blake2AsHex(code, 256);
}

export function generateProgramId(code: Buffer | Bytes | Uint8Array, salt: Hex): Hex {
  const codeArr =
    code instanceof Buffer ? CreateType.create('Bytes', code).toU8a() : code instanceof Bytes ? code.toU8a() : code;
  const saltU8a = CreateType.create('Vec<u8>', salt).toU8a();
  const id = new Uint8Array(codeArr.byteLength + saltU8a.byteLength);
  id.set(codeArr);
  id.set(saltU8a, codeArr.byteLength);
  return blake2AsHex(id, 256);
}
