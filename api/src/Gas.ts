import { isHex, isString, isU8a, u8aToHex } from '@polkadot/util';
import { Codec } from '@polkadot/types-codec/types';

import { GetGasSpentError } from './errors/program.errors';
import { Hex, PayloadType, Value } from './types';
import { Metadata } from './types/interfaces';
import { CreateType } from './create-type';
import { createPayload } from './utils';
import { GearApi } from './GearApi';
import { GasInfo } from './types';

export class GearGas {
  #createType: CreateType;

  constructor(private _api: GearApi) {
    this.#createType = new CreateType(_api);
  }

  private getPayload(
    payload: PayloadType,
    metaOrTypeOfPayload: string | Metadata,
    meta_type: string,
  ): Hex | Uint8Array | Codec {
    if (isHex(payload)) {
      return payload;
    } else if (isU8a(payload)) {
      return u8aToHex(payload);
    }
    if (!metaOrTypeOfPayload) {
      throw new GetGasSpentError('Impossible to create bytes from payload without specified type or meta');
    }
    const [type, meta] = isString(metaOrTypeOfPayload)
      ? [metaOrTypeOfPayload, undefined]
      : [metaOrTypeOfPayload[meta_type], metaOrTypeOfPayload];
    return createPayload(this.#createType, type, payload, meta);
  }

  /**
   * ### Get gas spent of init message using upload_program extrinsic
   * @param sourceId Account id
   * @param code Program code
   * @param payload Payload of init message
   * @param value Value of message
   * @param allowOtherPanics Should RPC call return error if other contracts panicked, during communication with the initial one
   * @param meta Metadata
   * @returns number in U64 format
   * @example
   * ```javascript
   * const code = fs.readFileSync('demo_meta.opt.wasm');
   * const meta = await getWasmMetadata(fs.readFileSync('demo_meta.opt.wasm'));
   * const gas = await gearApi.program.gasSpent.init(
   *   '0xd43593c715fdd31c61141abd04a99fd6822c8558854ccde39a5684e7a56da27d',
   *   code,
   *   {
   *     amount: 255,
   *     currency: 'GRT',
   *   },
   *   0,
   *   true,
   *   meta
   * );
   * console.log(gas.toHuman());
   * ```
   */
  async initUpload(
    sourceId: Hex,
    code: Hex | Buffer,
    payload: PayloadType,
    value?: Value,
    allowOtherPanics?: boolean,
    meta?: Metadata,
  ): Promise<GasInfo>;

  /**
   * ### Get gas spent of init message using upload_program extrinsic
   * @param sourceId Account id
   * @param code Program code
   * @param payload Payload of init message
   * @param value Value of message
   * @param allowOtherPanics Should RPC call return error if other contracts panicked, during communication with the initial one
   * @param typeOfPayload One of the primitives types
   * @returns number in U64 format
   * @example
   * ```javascript
   * const code = fs.readFileSync('demo_ping.opt.wasm');
   * const gas = await gearApi.program.gasSpent.init(
   *   '0xd43593c715fdd31c61141abd04a99fd6822c8558854ccde39a5684e7a56da27d',
   *   code,
   *   '0x00',
   *   0
   *   false,
   * );
   * console.log(gas.toHuman());
   * ```
   */
  async initUpload(
    sourceId: Hex,
    code: Hex | Buffer,
    payload: PayloadType,
    value?: Value,
    allowOtherPanics?: boolean,
    typeOfPayload?: string,
  ): Promise<GasInfo>;

  /**
   * ### Get gas spent of init message using upload_program extrinsic
   * @param sourceId Account id
   * @param code Program code
   * @param payload Payload of init message
   * @param value Value of message
   * @param allowOtherPanics Should RPC call return error if other contracts panicked, during communication with the initial one
   * @param metaOrTypeOfPayload Metadata or one of the primitives types
   * @returns number in U64 format
   */
  async initUpload(
    sourceId: Hex,
    code: Hex | Buffer,
    payload: PayloadType,
    value?: Value,
    allowOtherPanics?: boolean,
    metaOrTypeOfPayload?: string | Metadata,
  ): Promise<GasInfo>;

  async initUpload(
    sourceId: Hex,
    code: Hex | Buffer,
    payload: PayloadType,
    value?: Value,
    allowOtherPanics?: boolean,
    metaOrTypeOfPayload?: string | Metadata,
  ): Promise<GasInfo> {
    return this._api.rpc['gear'].calculateInitUploadGas(
      sourceId,
      isHex(code) ? code : this.#createType.create('bytes', Array.from(code)).toHex(),
      this.getPayload(payload, metaOrTypeOfPayload, 'init_input'),
      value || 0,
      allowOtherPanics || true,
    );
  }

  /**
   * ### Get gas spent of init message using create_program extrinsic
   * @param sourceId Account id
   * @param code Program code
   * @param payload Payload of init message
   * @param value Value of message
   * @param allowOtherPanics Should RPC call return error if other contracts panicked, during communication with the initial one
   * @param meta Metadata
   * @returns number in U64 format
   * @example
   * ```javascript
   * const code = fs.readFileSync('demo_meta.opt.wasm');
   * const meta = await getWasmMetadata(fs.readFileSync('demo_meta.opt.wasm'));
   * const gas = await gearApi.program.gasSpent.init(
   *   '0xd43593c715fdd31c61141abd04a99fd6822c8558854ccde39a5684e7a56da27d',
   *   code,
   *   {
   *     amount: 255,
   *     currency: 'GRT',
   *   },
   *   0,
   *   true,
   *   meta
   * );
   * console.log(gas.toHuman());
   * ```
   */
  async initCreate(
    sourceId: Hex,
    code: Hex,
    payload: PayloadType,
    value?: Value,
    allowOtherPanics?: boolean,
    meta?: Metadata,
  ): Promise<GasInfo>;

  /**
   * ### Get gas spent of init message using create_program extrinsic
   * @param sourceId Account id
   * @param code Program code
   * @param payload Payload of init message
   * @param value Value of message
   * @param allowOtherPanics Should RPC call return error if other contracts panicked, during communication with the initial one
   * @param typeOfPayload One of the primitives types
   * @returns number in U64 format
   * @example
   * ```javascript
   * const code = fs.readFileSync('demo_ping.opt.wasm');
   * const gas = await gearApi.program.gasSpent.init(
   *   '0xd43593c715fdd31c61141abd04a99fd6822c8558854ccde39a5684e7a56da27d',
   *   code,
   *   '0x00',
   *   0
   *   false,
   * );
   * console.log(gas.toHuman());
   * ```
   */
  async initCreate(
    sourceId: Hex,
    codeId: Hex,
    payload: PayloadType,
    value?: Value,
    allowOtherPanics?: boolean,
    typeOfPayload?: string,
  ): Promise<GasInfo>;

  /**
   * ### Get gas spent of init message using create_program extrinsic
   * @param sourceId Account id
   * @param code Program code
   * @param payload Payload of init message
   * @param value Value of message
   * @param allowOtherPanics Should RPC call return error if other contracts panicked, during communication with the initial one
   * @param metaOrTypeOfPayload Metadata or one of the primitives types
   * @returns number in U64 format
   */
  async initCreate(
    sourceId: Hex,
    codeId: Hex,
    payload: PayloadType,
    value?: Value,
    allowOtherPanics?: boolean,
    metaOrTypeOfPayload?: string | Metadata,
  ): Promise<GasInfo>;

  async initCreate(
    sourceId: Hex,
    codeId: Hex,
    payload: PayloadType,
    value?: Value,
    allowOtherPanics?: boolean,
    metaOrTypeOfPayload?: string | Metadata,
  ): Promise<GasInfo> {
    return this._api.rpc['gear'].calculateInitCreateGas(
      sourceId,
      codeId,
      this.getPayload(payload, metaOrTypeOfPayload, 'init_input'),
      value || 0,
      allowOtherPanics || true,
    );
  }

  /**
   * Get gas spent of hanle message
   * @param sourceId Account id
   * @param destinationId Program id
   * @param payload Payload of message
   * @param value Value of message
   * @param allowOtherPanics Should RPC call return error if other contracts panicked, during communication with the initial one
   * @param meta Metadata
   * @returns number in U64 format
   * @example
   * ```javascript
   * const code = fs.readFileSync('demo_meta.opt.wasm');
   * const meta = await getWasmMetadata(fs.readFileSync('demo_meta.opt.wasm'));
   * const gas = await gearApi.program.gasSpent.handle(
   *   '0xd43593c715fdd31c61141abd04a99fd6822c8558854ccde39a5684e7a56da27d',
   *   '0xa178362715fdd31c61141abd04a99fd6822c8558854ccde39a5684e7a56da27d',
   *    {
   *       id: {
   *         decimal: 64,
   *         hex: '0xd43593c715fdd31c61141abd04a99fd6822c8558854ccde39a5684e7a56da27d',
   *       },
   *    },
   *   0,
   *   true,
   *   meta
   * );
   * console.log(gas.toHuman());
   * ```
   */
  async handle(
    sourceId: Hex,
    destinationId: Hex | Buffer,
    payload: PayloadType,
    value?: Value,
    allowOtherPanics?: boolean,
    meta?: Metadata,
  ): Promise<GasInfo>;

  /**
   * Get gas spent of hanle message
   * @param sourceId Account id
   * @param destinationId Program id
   * @param payload Payload of message
   * @param value Value of message
   * @param allowOtherPanics Should RPC call return error if other contracts panicked, during communication with the initial one
   * @param typeOfPayload One of the primitives types
   * @returns number in U64 format
   * @example
   * ```javascript
   * const code = fs.readFileSync('demo_ping.opt.wasm');
   * const gas = await gearApi.program.gasSpent.handle(
   *   '0xd43593c715fdd31c61141abd04a99fd6822c8558854ccde39a5684e7a56da27d',
   *   '0xa178362715fdd31c61141abd04a99fd6822c8558854ccde39a5684e7a56da27d',
   *   'PING',
   *   0,
   *   false,
   *   'String'
   * );
   * console.log(gas.toHuman());
   * ```
   */
  async handle(
    sourceId: Hex,
    destinationId: Hex | Buffer,
    payload: PayloadType,
    value?: Value,
    allowOtherPanics?: boolean,
    typeOfPayload?: string,
  ): Promise<GasInfo>;

  /**
   * Get gas spent of hanle message
   * @param sourceId Account id
   * @param destinationId Program id
   * @param payload Payload of message
   * @param value Value of message
   * @param allowOtherPanics Should RPC call return error if other contracts panicked, during communication with the initial one
   * @param metaOrTypeOfPayload Metadata or one of the primitives types
   * @returns number in U64 format
   */
  async handle(
    sourceId: Hex,
    destinationId: Hex | Buffer,
    payload: PayloadType,
    value?: Value,
    allowOtherPanics?: boolean,
    metaOrTypeOfPayload?: string | Metadata,
  ): Promise<GasInfo>;

  async handle(
    sourceId: Hex,
    destinationId: Hex,
    payload: PayloadType,
    value?: Value,
    allowOtherPanics?: boolean,
    metaOrTypeOfPayload?: string | Metadata,
  ): Promise<GasInfo> {
    return this._api.rpc['gear'].calculateHandleGas(
      sourceId,
      destinationId,
      this.getPayload(payload, metaOrTypeOfPayload, 'handle_input'),
      value || 0,
      allowOtherPanics || true,
    );
  }

  /**
   * Get gas spent of reply message
   * @param sourceId Account id
   * @param messageId Message id of a message waiting for response
   * @param exitCode Exit code of a message waiting for response
   * @param payload Payload of message
   * @param value Value of message
   * @param allowOtherPanics Should RPC call return error if other contracts panicked, during communication with the initial one
   * @param meta Metadata
   * @returns number in U64 format
   * @example
   * ```javascript
   * const code = fs.readFileSync('demo_async.opt.wasm');
   * const meta = await getWasmMetadata(fs.readFileSync('demo_async.opt.wasm'));
   * const gas = await gearApi.program.gasSpent.reply(
   *   '0xd43593c715fdd31c61141abd04a99fd6822c8558854ccde39a5684e7a56da27d',
   *   '0x518e6bc03d274aadb3454f566f634bc2b6aef9ae6faeb832c18ae8300fd72635',
   *   0,
   *   'PONG',
   *   1000,
   *   true,
   *   meta,
   * );
   * console.log(gas.toHuman());
   * ```
   */
  async reply(
    sourceId: Hex,
    messageId: Hex,
    exitCode: number,
    payload: PayloadType,
    value?: Value,
    allowOtherPanics?: boolean,
    meta?: Metadata,
  ): Promise<GasInfo>;

  /**
   * Get gas spent of reply message
   * @param sourceId Account id
   * @param messageId Message id of a message waiting for response
   * @param exitCode Exit code of a message waiting for response
   * @param payload Payload of message
   * @param value Value of message
   * @param allowOtherPanics Should RPC call return error if other contracts panicked, during communication with the initial one
   * @param typeOfPayload One of the primitives types
   * @returns number in U64 format
   * @example
   * ```javascript
   * const code = fs.readFileSync('demo_async.opt.wasm');
   * const meta = await getWasmMetadata(fs.readFileSync('demo_async.opt.wasm'));
   * const gas = await gearApi.program.gasSpent.reply(
   *   '0xd43593c715fdd31c61141abd04a99fd6822c8558854ccde39a5684e7a56da27d',
   *   '0x518e6bc03d274aadb3454f566f634bc2b6aef9ae6faeb832c18ae8300fd72635',
   *   0,
   *   'PONG',
   *   1000,
   *   false,
   *   'String',
   * );
   * console.log(gas.toHuman());
   * ```
   */
  async reply(
    sourceId: Hex,
    messageId: Hex,
    exitCode: number,
    payload: PayloadType,
    value?: Value,
    allowOtherPanics?: boolean,
    typeOfPayload?: string,
  ): Promise<GasInfo>;

  /**
   * Get gas spent of reply message
   * @param sourceId Account id
   * @param messageId Message id of a message waiting for response
   * @param exitCode Exit code of a message waiting for response
   * @param payload Payload of message
   * @param value Value of message
   * @param allowOtherPanics Should RPC call return error if other contracts panicked, during communication with the initial one
   * @param metaOrTypeOfPayload Metadata or one of the primitives types
   * @returns number in U64 format
   */
  async reply(
    sourceId: Hex,
    messageId: Hex,
    exitCode: number,
    payload: PayloadType,
    value?: Value,
    allowOtherPanics?: boolean,
    metaOrTypeOfPayload?: string | Metadata,
  ): Promise<GasInfo>;

  async reply(
    sourceId: Hex,
    messageId: Hex,
    exitCode: number,
    payload: PayloadType,
    value?: Value,
    allowOtherPanics?: boolean,
    metaOrTypeOfPayload?: string | Metadata,
  ): Promise<GasInfo> {
    return this._api.rpc['gear'].calculateReplyGas(
      sourceId,
      messageId,
      exitCode,
      this.getPayload(payload, metaOrTypeOfPayload, 'async_handle_input'),
      value || 0,
      allowOtherPanics || true,
    );
  }
}
