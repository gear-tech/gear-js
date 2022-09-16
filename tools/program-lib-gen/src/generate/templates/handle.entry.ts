export function getHandleTemplate() {
  return `import { Hex } from '@gear-js/api';
import { BaseMessage, ISignOptions } from './base.entry';

export class Handle<PayloadType = null, ResultType = null> extends BaseMessage<PayloadType, ResultType> {
  async calculateGas(source: Hex, value: bigint | number = 0, allowOtherPanics = true) {
    if (!this._programId) {
      throw new Error('ProgramId does not found');
    }
    this._gas = await this.api.program.calculateGas.handle(
      source,
      this._programId,
      this._payload,
      value,
      allowOtherPanics,
    );
    this._value = BigInt(value);
    console.log('Calculated gas:', this._gas.toHuman());
    return this;
  }

  async sendMessage(
    signOptions: ISignOptions,
    value?: bigint | number,
    gasLimit?: bigint | number,
  ): Promise<ResultType | null> {
    if (!this._programId) {
      throw new Error('ProgramId does not found');
    }
    const extrinsic = this.api.message.send({
      destination: this._programId,
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
