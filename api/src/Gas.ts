import { isHex, isString } from '@polkadot/util';

import { Hex, PayloadType, Value } from './types';
import { OldMetadata } from './types/interfaces';
import { encodePayload } from './create-type';
import { GearApi } from './GearApi';
import { GasInfo } from './types';

export class GearGas {
  constructor(private _api: GearApi) {}

  #getTypeAndMeta(metaOrTypeOfPayload: OldMetadata | string, metaType: string): [string, OldMetadata | undefined] {
    if (!metaOrTypeOfPayload) {
      return [undefined, undefined];
    }
    if (isString(metaOrTypeOfPayload)) {
      return [metaOrTypeOfPayload, undefined];
    } else {
      return [metaOrTypeOfPayload[metaType], metaOrTypeOfPayload];
    }
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
    meta?: OldMetadata,
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
    metaOrTypeOfPayload?: string | OldMetadata,
  ): Promise<GasInfo>;

  async initUpload(
    sourceId: Hex,
    code: Hex | Buffer,
    payload: PayloadType,
    value?: Value,
    allowOtherPanics?: boolean,
    metaOrTypeOfPayload?: string | OldMetadata,
  ): Promise<GasInfo> {
    const [type, meta] = this.#getTypeAndMeta(metaOrTypeOfPayload, 'init_input');
    return this._api.rpc['gear'].calculateInitUploadGas(
      sourceId,
      isHex(code) ? code : this._api.createType('Bytes', Array.from(code)).toHex(),
      encodePayload(payload, meta?.types, type),
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
    meta?: OldMetadata,
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
    metaOrTypeOfPayload?: string | OldMetadata,
  ): Promise<GasInfo>;

  async initCreate(
    sourceId: Hex,
    codeId: Hex,
    payload: PayloadType,
    value?: Value,
    allowOtherPanics?: boolean,
    metaOrTypeOfPayload?: string | OldMetadata,
  ): Promise<GasInfo> {
    const [type, meta] = this.#getTypeAndMeta(metaOrTypeOfPayload, 'init_input');
    return this._api.rpc['gear'].calculateInitCreateGas(
      sourceId,
      codeId,
      encodePayload(payload, meta?.types, type),
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
    meta?: OldMetadata,
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
    metaOrTypeOfPayload?: string | OldMetadata,
  ): Promise<GasInfo>;

  async handle(
    sourceId: Hex,
    destinationId: Hex,
    payload: PayloadType,
    value?: Value,
    allowOtherPanics?: boolean,
    metaOrTypeOfPayload?: string | OldMetadata,
  ): Promise<GasInfo> {
    const [type, meta] = this.#getTypeAndMeta(metaOrTypeOfPayload, 'handle_input');
    return this._api.rpc['gear'].calculateHandleGas(
      sourceId,
      destinationId,
      encodePayload(payload, meta?.types, type),
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
    meta?: OldMetadata,
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
    metaOrTypeOfPayload?: string | OldMetadata,
  ): Promise<GasInfo>;

  async reply(
    sourceId: Hex,
    messageId: Hex,
    exitCode: number,
    payload: PayloadType,
    value?: Value,
    allowOtherPanics?: boolean,
    metaOrTypeOfPayload?: string | OldMetadata,
  ): Promise<GasInfo> {
    const [type, meta] = this.#getTypeAndMeta(metaOrTypeOfPayload, 'handle_input');
    return this._api.rpc['gear'].calculateReplyGas(
      sourceId,
      messageId,
      exitCode,
      encodePayload(payload, meta?.types, type),
      value || 0,
      allowOtherPanics || true,
    );
  }
}
