import { ProgramMetadata, StateMetadata } from './metadata';
import { GearApi } from './GearApi';
import { Hex } from './types';

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
    meta: StateMetadata,
  ) {
    const fn = meta.functions[args.fn_name];

    const payload = fn?.input ? meta.createType(fn.input, args.argument) : args.argument;

    const state = await this.api.rpc['gear'].readStateUsingWasm(
      args.programId,
      args.fn_name,
      args.wasm,
      payload || null,
      args.at || null,
    );
    return meta.createType(fn.output, state);
  }
}
