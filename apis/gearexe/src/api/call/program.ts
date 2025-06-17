import { HexString } from 'gear-js-util';
import { IGearExeProvider, ReplyInfo } from '../../types/index.js';

export class ProgramCalls {
  constructor(private _provider: IGearExeProvider) {}

  async calculateReplyForHandle(
    source: string,
    programId: string,
    payload: HexString,
    value?: bigint,
  ): Promise<ReplyInfo>;
  async calculateReplyForHandle(
    source: string,
    programId: string,
    payload: HexString,
    value: bigint,
    atBlock?: HexString,
  ): Promise<ReplyInfo>;
  async calculateReplyForHandle(
    source: string,
    programId: string,
    payload: HexString,
    value = 0n,
    atBlock?: HexString,
  ): Promise<ReplyInfo> {
    const response = await this._provider.send<ReplyInfo>('program_calculateReplyForHandle', [
      atBlock || null,
      source,
      programId,
      payload,
      value,
    ]);

    return response;
  }
}
