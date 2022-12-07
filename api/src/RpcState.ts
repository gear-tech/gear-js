import { ProgramMetadata, StateMetadata } from './metadata';
import { GearApi } from './GearApi';
import { Hex } from './types';
import { CreateType } from './create-type';
import { isBuffer } from '@polkadot/util';
import { Codec } from '@polkadot/types/types';

export class GearRpcState {
  constructor(private api: GearApi) {}

  async readState(args: { programId: Hex; at?: Hex }, meta: ProgramMetadata, type: number) {
    const state = await this.api.rpc['gear'].readState(args.programId, args.at || null);
    return meta.createType(type, state);
  }

  async readStateUsingWasm(
    args: {
      programId: Hex;
      fn_name: string;
      wasm: Buffer | Uint8Array | Hex;
      argument?: any;
      at?: Hex;
    },
    meta?: StateMetadata,
  ): Promise<Codec> {
    const fnTypes = meta?.functions[args.fn_name];

    const payload =
      fnTypes?.input !== undefined && fnTypes?.input !== null
        ? meta.createType(fnTypes.input, args.argument).toHex()
        : args.argument;

    const state = await this.api.rpc['gear'].readStateUsingWasm(
      args.programId,
      args.fn_name,
      isBuffer(args.wasm) ? CreateType.create('Bytes', Array.from(args.wasm)) : args.wasm,
      payload || null,
      args.at || null,
    );
    return meta && fnTypes ? meta.createType(fnTypes.output, state) : state;
  }
}
