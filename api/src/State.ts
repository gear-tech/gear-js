import { Codec } from '@polkadot/types/types';
import { HexString } from '@polkadot/util/types';

import { CreateType, ProgramMetadata, StateMetadata } from './metadata';
import { GearProgramStorage } from './Storage';

interface ReadStateArgs {
  programId: HexString;
  at?: HexString;
}

export class GearProgramState extends GearProgramStorage {
  /**
   * ## Read state using meta wasm file
   * @param args
   * @param meta StateMetadata returned from getStateMetadata function
   */
  async readUsingWasm(
    args: {
      programId: HexString;
      fn_name: string;
      wasm: Buffer | Uint8Array | HexString;
      argument?: any;
      at?: HexString;
    },
    meta?: StateMetadata,
  ): Promise<Codec> {
    const fnTypes = meta?.functions[args.fn_name];

    const payload =
      fnTypes?.input !== undefined && fnTypes?.input !== null
        ? Array.from(meta.createType(fnTypes.input, args.argument).toU8a())
        : args.argument;

    const state = await this._api.rpc['gear'].readStateUsingWasm(
      args.programId,
      args.fn_name,
      CreateType.create('Bytes', args.wasm),
      payload || null,
      args.at || null,
    );
    return meta && fnTypes ? meta.createType(fnTypes.output, state) : state;
  }

  /**
   *
   * @param args ProgramId and hash of block where it's necessary to read state (optional)
   * @param meta Program metadata returned from getProgramMetadata function
   * @param type (optional) Index of type to decode state. metadata.types.state is uesd by default
   */
  async read(args: ReadStateArgs, meta: ProgramMetadata, type?: number): Promise<Codec> {
    const state = await this._api.rpc['gear'].readState(args.programId, args.at || null);
    return meta.createType(type || meta.types.state, state);
  }
}
