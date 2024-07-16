import { CUploadCode, CUploadProgram, CVoucherCall, isUploadCode, isUploadProgram } from './types/calls';
import { getGrReply } from '@gear-js/api';
import { u8aToHex } from '@polkadot/util';

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
