import type { Hex } from 'viem';

import { ReplyCode } from '../../errors/index.js';
import type { IVaraEthProvider, ReplyInfo } from '../../types/index.js';

interface IReplyInfoRpc extends Omit<ReplyInfo, 'code'> {
  readonly code: Hex;
}

interface ICalculateReplyForHandleResultRpc {
  readonly reply: IReplyInfoRpc;
  readonly messages: [];
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
    // TODO: return messages
    const response = await this._provider.send<ICalculateReplyForHandleResultRpc | IReplyInfoRpc>(
      'program_calculateReplyForHandle',
      [atBlock || null, source, programId, payload, value],
    );

    // Legacy nodes return a flat IReplyInfoRpc; versioned nodes wrap it in { reply, messages }.
    const reply = response && 'reply' in response ? response.reply : (response as IReplyInfoRpc);

    return {
      ...reply,
      code: ReplyCode.fromBytes(reply.code),
    };
  }
}
