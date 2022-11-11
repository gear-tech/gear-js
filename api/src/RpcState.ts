import { HashMap, Text, Option, Struct, Bytes } from '@polkadot/types';

import { getStateFunctions } from './wasm';
import { CreateType } from './create-type';
import { GearApi } from './GearApi';
import { Hex } from './types';

interface InOut extends Struct {
  input: Option<Text>;
  output: Option<Text>;
}

interface WasmMetadata extends Struct {
  functions: HashMap<Text, InOut>;
  reg: Bytes;
}

interface HumanInOut {
  input: string | null;
  output: string | null;
}

interface HumanWasmMetadata {
  functions: Record<string, HumanInOut>;
  reg: Hex;
}

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

  async getMetadata(wasm: Buffer | Uint8Array): Promise<HumanWasmMetadata> {
    const metadataBytes = await getStateFunctions(wasm instanceof Uint8Array ? Buffer.from(wasm) : wasm);
    const metadata = this.api.createType('WasmMetadata', metadataBytes) as WasmMetadata;

    return metadata.toHuman() as unknown as HumanWasmMetadata;
  }
}
