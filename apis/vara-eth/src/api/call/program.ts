import { Hex } from 'viem';

import { ReplyCode } from '../../errors/index.js';
import { IVaraEthProvider, ReplyInfo } from '../../types/index.js';

interface IReplyInfoRpc extends Omit<ReplyInfo, 'code'> {
  code: Hex;
}

export class ProgramCalls {
  constructor(private _provider: IVaraEthProvider) {}

  async calculateReplyForHandle(source: string, programId: string, payload: Hex, value?: bigint): Promise<ReplyInfo>;
  async calculateReplyForHandle(
    source: string,
    programId: string,
    payload: Hex,
    value: bigint,
    atBlock?: Hex,
  ): Promise<ReplyInfo>;
  async calculateReplyForHandle(
    source: string,
    programId: string,
    payload: Hex,
    value = 0n,
    atBlock?: Hex,
  ): Promise<ReplyInfo> {
    const { code, ...info } = await this._provider.send<IReplyInfoRpc>('program_calculateReplyForHandle', [
      atBlock || null,
      source,
      programId,
      payload,
      value,
    ]);

    return {
      ...info,
      code: ReplyCode.fromBytes(code),
    };
  }
}
