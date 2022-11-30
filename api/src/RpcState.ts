import { CreateType } from './create-type';
import { GearApi } from './GearApi';
import { Hex } from './types';

export class GearRpcState {
  constructor(private api: GearApi) {}

  async readState(args: { programId: Hex; at?: Hex }, registry: Hex, type: string) {
    const state = await this.api.rpc['gear'].readState(args.programId, args.at || null);
    return CreateType.create(type, state, registry);
  }

  async readStateUsingWasm(
    args: {
      programId: Hex;
      fn_name: string;
      wasm: Buffer | Uint8Array | Hex;
      argument?: any;
      at?: Hex;
    },
    registry: Hex,
    type: string,
  ) {
    const state = await this.api.rpc['gear'].readStateUsingWasm(
      args.programId,
      args.fn_name,
      args.wasm,
      args.argument || null,
      args.at || null,
    );
    return CreateType.create(type, state, registry);
  }
}
