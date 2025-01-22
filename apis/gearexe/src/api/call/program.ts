import { IGearexeProvider, ReplyInfo } from '../../types/index.js';

export class ProgramCalls {
  constructor(private _provider: IGearexeProvider) {}

  async calculateReplyForHandle(
    source: string,
    programId: string,
    payload: `0x${string}`,
    value?: bigint,
  ): Promise<ReplyInfo>;
  async calculateReplyForHandle(
    source: string,
    programId: string,
    payload: `0x${string}`,
    value: bigint,
    atBlock?: `0x${string}`,
  ): Promise<ReplyInfo>;
  async calculateReplyForHandle(
    source: string,
    programId: string,
    payload: `0x${string}`,
    value = 0n,
    atBlock?: `0x${string}`,
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
