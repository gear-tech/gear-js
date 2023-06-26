import { HexString } from '@polkadot/util/types';

import { PayloadType, Value } from './types';
import { GasInfo } from './types';
import { GearApi } from './GearApi';
import { ProgramMetadata } from './metadata';
import { encodePayload } from './utils/create-payload';

export class GearGas {
  constructor(private _api: GearApi) {}

  /**
   * ### Get gas spent of init message using upload_program extrinsic
   * @param sourceId Account Id
   * @param code Program code
   * @param payload Payload of init message
   * @param value Value of message
   * @param allowOtherPanics Should RPC call return error if other contracts panicked, during communication with the initial one
   * @param meta (optional) Program metadata obtained using `getProgramMetadata` function.
   * @param typeIndexOrTypeName  Index of type in the registry. If not specified the type index from `meta.init.input` will be used instead.
   * If meta is not passed it's possible to specify type name that can be one of the default rust types
   * @example
   * ```javascript
   * const code = fs.readFileSync('demo_meta.opt.wasm');
   * const meta = await getProgramMetadata('0x...');
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
   * console.log(gas.toJSON());
   *
   * // Or
   * const gas = await gearApi.program.gasSpent.init(
   *   '0xd43593c715fdd31c61141abd04a99fd6822c8558854ccde39a5684e7a56da27d',
   *   code,
   *   'Hello',
   *   0,
   *   true,
   *   undefined,
   *   'String',
   * );
   * ```
   */
  async initUpload(
    sourceId: HexString,
    code: HexString | Buffer,
    payload: PayloadType,
    value?: Value,
    allowOtherPanics?: boolean,
    meta?: ProgramMetadata,
    typeIndexOrTypeName?: number | string,
  ): Promise<GasInfo> {
    return this._api.rpc['gear'].calculateInitUploadGas(
      sourceId,
      encodePayload(code, undefined, undefined, 'Bytes'),
      encodePayload(payload, meta, 'init', typeIndexOrTypeName),
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
   * @param typeIndexOrTypeName  Index of type in the registry. If not specified the type index from `meta.init.input` will be used instead.
   * If meta is not passed it's possible to specify type name that can be one of the default rust types
   * @example
   * ```javascript
   * const code = fs.readFileSync('demo_meta.opt.wasm');
   * const meta = await getProgramMetadata('0x...');
   * const gas = await gearApi.program.gasSpent.init(
   *   '0xd43593c715fdd31c61141abd04a99fd6822c8558854ccde39a5684e7a56da27d',
   *   code,
   *   {
   *     amount: 255,
   *     currency: 'GRT',
   *   },
   *   0,
   *   true,
   *   meta,
   *   meta.types.init.input
   * );
   * // Or
   * const gas = await gearApi.program.gasSpent.init(
   *   '0xd43593c715fdd31c61141abd04a99fd6822c8558854ccde39a5684e7a56da27d',
   *   code,
   *   'Hello World!',
   *   0,
   *   true,
   *   undefined,
   *   'String'
   * );
   * console.log(gas.toJSON());
   * ```
   */
  async initCreate(
    sourceId: HexString,
    codeId: HexString,
    payload: PayloadType,
    value?: Value,
    allowOtherPanics?: boolean,
    meta?: ProgramMetadata,
    typeIndexOrTypeName?: number | string,
  ): Promise<GasInfo> {
    const _payload = encodePayload(payload, meta, 'init', typeIndexOrTypeName);
    return this._api.rpc['gear'].calculateInitCreateGas(
      sourceId,
      codeId,
      _payload,
      value || 0,
      allowOtherPanics || true,
    );
  }

  /**
   * ### Get gas spent of hanle message
   * @param sourceId Account id
   * @param destinationId Program id
   * @param payload Payload of message
   * @param value Value of message
   * @param allowOtherPanics Should RPC call return error if other contracts panicked, during communication with the initial one
   * @param meta Metadata
   * @param typeIndexOrTypeName  Index of type in the registry. If not specified the type index from `meta.handle.input` will be used instead.
   * If meta is not passed it's possible to specify type name that can be one of the default rust types
   * @example
   * ```javascript
   * const code = fs.readFileSync('demo_meta.opt.wasm');
   * const meta = await getProgramMetadata('0x...');
   * const gas = await gearApi.program.gasSpent.handle(
   *   '0xd43593c715fdd31c61141abd04a99fd6822c8558854ccde39a5684e7a56da27d',
   *   '0xa178362715fdd31c61141abd04a99fd6822c8558854ccde39a5684e7a56da27d',
   *    {
   *       id: {
   *         decimal: 64,
   *         HexString: '0xd43593c715fdd31c61141abd04a99fd6822c8558854ccde39a5684e7a56da27d',
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
    sourceId: HexString,
    destinationId: HexString,
    payload: PayloadType,
    value?: Value,
    allowOtherPanics?: boolean,
    meta?: ProgramMetadata,
    typeIndexOrTypeName?: number | string,
  ): Promise<GasInfo> {
    const _payload = encodePayload(payload, meta, 'handle', typeIndexOrTypeName);
    return this._api.rpc['gear'].calculateHandleGas(
      sourceId,
      destinationId,
      _payload,
      value || 0,
      allowOtherPanics || true,
    );
  }

  /**
   * ### Get gas spent of reply message
   * @param sourceId Account id
   * @param messageId Message id of a message waiting for response
   * @param exitCode Exit code of a message waiting for response
   * @param payload Payload of message
   * @param value Value of message
   * @param allowOtherPanics Should RPC call return error if other contracts panicked, during communication with the initial one
   * @param meta Metadata
   * @param typeIndexOrTypeName  Index of type in the registry. If not specified the type index from `meta.reply.input` will be used instead.
   * If meta is not passed it's possible to specify type name that can be one of the default rust types
   * @example
   * ```javascript
   * const code = fs.readFileSync('demo_async.opt.wasm');
   * const meta = await getProgramMetadata('0x...');
   * const gas = await gearApi.program.gasSpent.reply(
   *   '0xd43593c715fdd31c61141abd04a99fd6822c8558854ccde39a5684e7a56da27d',
   *   '0x518e6bc03d274aadb3454f566f634bc2b6aef9ae6faeb832c18ae8300fd72635',
   *   0,
   *   'PONG',
   *   1000,
   *   true,
   *   meta,
   * );
   * console.log(gas.toJSON());
   * ```
   */
  async reply(
    sourceId: HexString,
    messageId: HexString,
    payload: PayloadType,
    value?: Value,
    allowOtherPanics?: boolean,
    meta?: ProgramMetadata,
    typeIndexOrTypeName?: number,
  ): Promise<GasInfo> {
    const _payload = encodePayload(payload, meta, 'reply', typeIndexOrTypeName);
    return this._api.rpc['gear'].calculateReplyGas(sourceId, messageId, _payload, value || 0, allowOtherPanics || true);
  }
}
