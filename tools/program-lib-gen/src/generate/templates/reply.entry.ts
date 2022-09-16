export function getReplyTemplate() {
  return `import { Hex } from '@gear-js/api';
import { BaseMessage, ISignOptions } from './base.entry';

export class Reply<PayloadType, ResultType = null> extends BaseMessage<PayloadType, ResultType> {
  #messageId: Hex;

  messageId(id: Hex) {
    this.#messageId = id;
    return this;
  }

  async calculateGas(source: Hex, exitCode: number = 0, value: bigint | number = 0, allowOtherPanics = true) {
    this._gas = await this.api.program.calculateGas.reply(
      source,
      this.#messageId,
      exitCode,
      this._payload,
      value,
      allowOtherPanics,
    );
    this._value = BigInt(value);
    console.log('Calculated gas:', this._gas.toHuman());
    return this;
  }

  async sendReply(signOptions: ISignOptions, value?: bigint | number, gasLimit?: bigint): Promise<ResultType | null> {
    const extrinsic = this.api.message.sendReply({
      replyToId: this.#messageId,
      payload: this._payload,
      value: value || this._value,
      gasLimit: gasLimit || this._gas.min_limit.toBigInt(),
    });

    const getStatus = await this._waitForMessageStatus();
    const getReply = await this._waitForReply();

    const messageId = await this._sendTransaction(extrinsic, signOptions);

    const status = getStatus(messageId);
    const isSuccess = await status.status;
    status.unsub();

    if (this._resultType || !isSuccess) {
      const { payloadAndExitCode, unsub } = getReply(messageId);
      const [payload, exitCode] = await payloadAndExitCode;
      unsub();
      if (exitCode === 0) {
        return this._getReplyPayload(payload as Hex);
      } else {
        throw new Error(payload);
      }
    } else {
      return null;
    }
  }
}
`;
}
