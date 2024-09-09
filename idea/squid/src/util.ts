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

const prefix = stringToU8a('outgoing');
const nonces = Array.from({ length: 512 }, (_v, i) => CreateType.create('u32', i).toU8a());

export async function findChildMessageId(parentId: string, idToFind: string, startNonce: number = 0) {
  const msgId = u8aToU8a(parentId);

  for (let i = startNonce; i < nonces.length; i++) {
    const childId = blake2AsHex(u8aConcat(prefix, msgId, nonces[i]));

    if (childId === idToFind) {
      return { parentId, nonce: i };
    }
  }

  throw Error('Child id not found');
}
