import { CUploadCode, CUploadProgram, CVoucherCall, isUploadCode, isUploadProgram } from './types/calls';
import { getGrReply, CreateType } from '@gear-js/api';
import { u8aToHex, u8aToU8a, u8aConcat, stringToU8a } from '@polkadot/util';
import { blake2AsHex } from '@polkadot/util-crypto';

export async function getMetahash(call: CUploadCode | CUploadProgram | CVoucherCall): Promise<string | null> {
  const code =
    isUploadCode(call) || isUploadProgram(call)
      ? call.args.code
      : call.args.call.__kind === 'UploadCode'
      ? call.args.call.code
      : null;

  if (code) {
    let metahash: Uint8Array;

    try {
      metahash = await getGrReply(code, 'metahash');
    } catch (e) {
      return null;
    }

    return u8aToHex(metahash);
  }

  return null;
}

export function generateChildMessageId(messageId: string) {
  const msgId = u8aToU8a(messageId);
  const prefix = stringToU8a('outgoing');
  const result: { [property: `0x${string}`]: string } = {};

  for (let i = 0; i < 512; i++) {
    const nonce = CreateType.create('u32', i).toU8a();

    const temp = blake2AsHex(u8aConcat(prefix, msgId, nonce));
    result[temp] = messageId;
  }

  return result;
}
