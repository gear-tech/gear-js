export function getInitTemplate() {
  return `import { GearApi, Hex, TypeInfoRegistry } from '@gear-js/api';
import { BaseMessage, ISignOptions } from './base.entry';

export class UploadProgram<PayloadType, ResultType = null> extends BaseMessage<PayloadType, ResultType> {
  code: Buffer;

  constructor(
    registry: TypeInfoRegistry,
    protected api: GearApi,
    options: {
      code: Buffer;
      payloadType?: string;
      enumVariant?: string;
      resultType?: string;
      resultEnumVariant?: string;
    },
  ) {
    super(registry, api, options);
    this.code = options.code;
  }

  async calculateGas(source: Hex, value: string | bigint | number = 0, allowOtherPanics = true) {
    const gas = await this.api.program.calculateGas.initUpload(
      source,
      this.code,
      this._payload ?? '0x',
      value || 0,
      allowOtherPanics,
    );
    this._value = BigInt(value);
    console.log('Calculated gas:', gas.toHuman());
    this._gas = gas;
    return this;
  }

  async uploadProgram(
    signOptions: ISignOptions,
    value?: bigint,
    gasLimit?: bigint,
  ): Promise<{ reply: ResultType | null; programId: Hex; codeId: Hex }> {
    if (!this.code) {
      throw new Error('Code is not found');
    }
    const { programId, extrinsic, codeId } = this.api.program.upload({
      code: this.code,
      initPayload: this._payload ?? '0x',
      value: value ?? this._value,
      gasLimit: gasLimit || this._gas.min_limit.toBigInt(),
    });

    const getStatus = await this._waitForMessageStatus();
    const getReply = await this._waitForReply();

    const messageId = await this._sendTransaction(extrinsic, signOptions);

    const status = getStatus(messageId);
    const isSuccess = await status.status;
    status.unsub();

    this._programId = programId;

    if (this._resultType || !isSuccess) {
      const { payloadAndExitCode, unsub } = getReply(messageId);
      const [payload, exitCode] = await payloadAndExitCode;
      unsub();
      if (exitCode === 0) {
        return { reply: this._getReplyPayload(payload as Hex), programId, codeId };
      } else {
        throw new Error(payload);
      }
    } else {
      return { reply: null, programId, codeId };
    }
  }
}

export class CreateProgram<PayloadType, ResultType = null> extends BaseMessage<PayloadType, ResultType> {
  codeId: Hex;

  constructor(
    registry: TypeInfoRegistry,
    protected api: GearApi,
    options: {
      codeId: Hex;
      payloadType?: string;
      enumVariant?: string;
      resultType?: string;
      resultEnumVariant?: string;
    },
  ) {
    super(registry, api, options);
    this.codeId = options.codeId;
  }

  async calculateGas(source: Hex, value: string | bigint | number = 0, allowOtherPanics = true) {
    const gas = await this.api.program.calculateGas.initCreate(
      source,
      this.codeId,
      this._payload ?? '0x',
      value || 0,
      allowOtherPanics,
    );
    this._value = BigInt(value);
    console.log('Calculated gas:', gas.toHuman());
    this._gas = gas;
    return this;
  }

  async createProgram(
    signOptions: ISignOptions,
    value?: string | bigint | number,
    gasLimit?: string | bigint | number,
  ): Promise<{ reply: ResultType | null; programId: Hex }> {
    if (!this.codeId) {
      throw new Error('Code ID is not found');
    }
    const { programId, extrinsic } = this.api.program.create({
      codeId: this.codeId,
      initPayload: this._payload ?? '0x',
      value: value ?? this._value,
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
        return { reply: this._getReplyPayload(payload as Hex), programId };
      } else {
        throw new Error(payload);
      }
    } else {
      return { reply: null, programId };
    }
  }
}
`;
}
