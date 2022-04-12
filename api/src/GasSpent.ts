import { isHex, isString, isU8a } from '@polkadot/util';
import { u64 } from '@polkadot/types';
import { CreateType } from './create-type';
import { Metadata } from './types/interfaces';
import { Hex, PayloadType } from './types';
import { GearApi } from './GearApi';
import { createPayload } from './utils';
import { GetGasSpentError } from './errors/program.errors';

export class GearGasSpent {
  api: GearApi;
  createType: CreateType;
  constructor(api: GearApi) {
    this.api = api;
    this.createType = new CreateType(this.api);
  }

  private getPayload(
    payload: PayloadType,
    metaOrTypeOfPayload: string | Metadata,
    meta_type: string,
  ): Hex | Uint8Array {
    if (isHex(payload) || isU8a(payload)) {
      return payload;
    }
    if (!metaOrTypeOfPayload) {
      throw new GetGasSpentError('Impossible to create bytes from payload without specified type or meta');
    }
    const [type, meta] = isString(metaOrTypeOfPayload)
      ? [metaOrTypeOfPayload, undefined]
      : [metaOrTypeOfPayload[meta_type], metaOrTypeOfPayload];
    return createPayload(this.createType, type, payload, meta);
  }

  /**
   * Get gas spent of init message
   * @param sourceId Account id
   * @param code Program code
   * @param payload Payload of init message
   * @param value Value of message
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
   *   meta
   * );
   * console.log(gas.toHuman());
   * ```
   */
  async init(
    sourceId: Hex,
    code: Hex | Buffer,
    payload: PayloadType,
    value: number | string,
    meta?: Metadata,
  ): Promise<u64>;

  /**
   * Get gas spent of init message
   * @param sourceId Account id
   * @param code Program code
   * @param payload Payload of init message
   * @param value Value of message
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
   * );
   * console.log(gas.toHuman());
   * ```
   */
  async init(
    sourceId: Hex,
    code: Hex | Buffer,
    payload: PayloadType,
    value: number | string,
    typeOfPayload?: string,
  ): Promise<u64>;

  /**
   * Get gas spent of init message
   * @param sourceId Account id
   * @param code Program code
   * @param payload Payload of init message
   * @param value Value of message
   * @param metaOrTypeOfPayload Metadata or one of the primitives types
   * @returns number in U64 format
   */
  async init(
    sourceId: Hex,
    code: Hex | Buffer,
    payload: PayloadType,
    value: number | string,
    metaOrTypeOfPayload?: string | Metadata,
  ): Promise<u64>;

  async init(
    sourceId: Hex,
    code: Hex | Buffer,
    payload: PayloadType,
    value: number | string,
    metaOrTypeOfPayload?: string | Metadata,
  ): Promise<u64> {
    return await this.api.rpc['gear'].getInitGasSpent(
      sourceId,
      isHex(code) ? code : this.createType.create('bytes', Array.from(code)).toHex(),
      this.getPayload(payload, metaOrTypeOfPayload, 'init_input'),
      value || 0,
    );
  }

  /**
   * Get gas spent of hanle message
   * @param sourceId Account id
   * @param destinationId Program id
   * @param payload Payload of message
   * @param value Value of message
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
   *   meta
   * );
   * console.log(gas.toHuman());
   * ```
   */
  async handle(
    sourceId: Hex,
    destinationId: Hex | Buffer,
    payload: PayloadType,
    value: number | string,
    meta?: Metadata,
  ): Promise<u64>;

  /**
   * Get gas spent of hanle message
   * @param sourceId Account id
   * @param destinationId Program id
   * @param payload Payload of message
   * @param value Value of message
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
   *   'String'
   * );
   * console.log(gas.toHuman());
   * ```
   */
  async handle(
    sourceId: Hex,
    destinationId: Hex | Buffer,
    payload: PayloadType,
    value: number | string,
    typeOfPayload?: string,
  ): Promise<u64>;

  /**
   * Get gas spent of hanle message
   * @param sourceId Account id
   * @param destinationId Program id
   * @param payload Payload of message
   * @param value Value of message
   * @param metaOrTypeOfPayload Metadata or one of the primitives types
   * @returns number in U64 format
   */
  async handle(
    sourceId: Hex,
    destinationId: Hex | Buffer,
    payload: PayloadType,
    value: number | string,
    metaOrTypeOfPayload?: string | Metadata,
  ): Promise<u64>;

  async handle(
    sourceId: Hex,
    destinationId: Hex,
    payload: PayloadType,
    value: number | string,
    metaOrTypeOfPayload?: string | Metadata,
  ): Promise<u64> {
    return await this.api.rpc['gear'].getHandleGasSpent(
      sourceId,
      destinationId,
      this.getPayload(payload, metaOrTypeOfPayload, 'handle_input'),
      value || 0,
    );
  }

  /**
   * Get gas spent of reply message
   * @param sourceId Account id
   * @param messageId Message id of a message waiting for response
   * @param exitCode Exit code of a message waiting for response
   * @param payload Payload of message
   * @param value Value of message
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
    value: number | string,
    meta?: Metadata,
  ): Promise<u64>;

  /**
   * Get gas spent of reply message
   * @param sourceId Account id
   * @param messageId Message id of a message waiting for response
   * @param exitCode Exit code of a message waiting for response
   * @param payload Payload of message
   * @param value Value of message
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
    value: number | string,
    typeOfPayload?: string,
  ): Promise<u64>;

  /**
   * Get gas spent of reply message
   * @param sourceId Account id
   * @param messageId Message id of a message waiting for response
   * @param exitCode Exit code of a message waiting for response
   * @param payload Payload of message
   * @param value Value of message
   * @param metaOrTypeOfPayload Metadata or one of the primitives types
   * @returns number in U64 format
   */
  async reply(
    sourceId: Hex,
    messageId: Hex,
    exitCode: number,
    payload: PayloadType,
    value: number | string,
    metaOrTypeOfPayload?: string | Metadata,
  ): Promise<u64>;

  async reply(
    sourceId: Hex,
    messageId: Hex,
    exitCode: number,
    payload: PayloadType,
    value: number | string,
    metaOrTypeOfPayload?: string | Metadata,
  ): Promise<u64> {
    return await this.api.rpc['gear'].getReplyGasSpent(
      sourceId,
      messageId,
      exitCode,
      this.getPayload(payload, metaOrTypeOfPayload, 'async_handle_input'),
      value || 0,
    );
  }
}
