import { Codec } from '@polkadot/types/types';
import { HexString } from '@polkadot/util/types';

import { CreateType, MetadataVersion, ProgramMetadata, StateMetadata } from './metadata';
import { Bytes } from '@polkadot/types';
import { GearProgramStorage } from './Storage';
import { HumanTypesRepr } from 'types';

interface ReadStateParams {
  /**
   * Program Id
   */
  programId: HexString;
  /**
   * Input payload expected by the `state` function
   */
  payload: any;
  /**
   * Block hash at which state is to be received
   */
  at?: HexString;
}

interface ReadStateUsingWasmParams {
  /**
   * Program Id
   */
  programId: HexString;
  /**
   * Input payload expected by the `state` function of the onchain program
   */
  payload?: any;
  /**
   * Function name to execute
   */
  fn_name: string;
  /**
   * Compiled program using to read `state` of the onchain program
   */
  wasm: Buffer | Uint8Array | HexString;
  /**
   * (Optional) The argument expected by the program using to read state
   */
  argument?: any;
  /**
   * (Optional) Block hash at which state is to be read
   */
  at?: HexString;
}

export class GearProgramState extends GearProgramStorage {
  /**
   * ## Read state using meta wasm file
   * @param args
   * @param meta StateMetadata returned from getStateMetadata function
   */
  async readUsingWasm(
    params: ReadStateUsingWasmParams,
    stateMeta: StateMetadata,
    programMeta: ProgramMetadata,
  ): Promise<Codec> {
    const fnTypes = stateMeta?.functions[params.fn_name];
    const stateType =
      programMeta.version === MetadataVersion.V2Rust ? (programMeta.types.state as HumanTypesRepr).input : null;

    const argument =
      fnTypes?.input !== undefined && fnTypes?.input !== null
        ? Array.from(stateMeta.createType(fnTypes.input, params.argument).toU8a())
        : null;

    const payload = isNaN(stateType)
      ? []
      : Array.from(programMeta.createType((programMeta.types.state as HumanTypesRepr).input, params.payload).toU8a());

    const code =
      typeof params.wasm === 'string' ? params.wasm : CreateType.create<Bytes>('Bytes', Array.from(params.wasm));

    const state = await this._api.rpc['gear'].readStateUsingWasm(
      params.programId,
      payload,
      params.fn_name,
      code,
      argument,
      params.at,
    );
    return stateMeta && fnTypes ? stateMeta.createType(fnTypes.output, state) : state;
  }

  /**
   * ### Read state of program (calls `gear_readState` rpc call)
   * @param args ProgramId, payload and hash of block where it's necessary to read state (optional)
   * @param meta Program metadata returned from `ProgramMetadata.from` method.
   * @param type (optional) Index of type to decode state. metadata.types.state is uesd by default
   *
   * @example
   * const meta = ProgramMetadata.from('0x...');
   * const programId = '0x...';
   *
   * const result = await api.programState.read({ programId, payload: { id: 1 } }, meta);
   * console.log(result.toJSON());
   */
  async read<T extends Codec = Codec>(args: ReadStateParams, meta: ProgramMetadata, type?: number): Promise<T> {
    const payload =
      meta.version === MetadataVersion.V2Rust
        ? Array.from(meta.createType((meta.types.state as HumanTypesRepr).input, args.payload).toU8a())
        : [];
    const state = await this._api.rpc['gear'].readState(args.programId, payload, args.at || null);

    if (type !== undefined) {
      return meta.createType<T>(type, state);
    }

    if (meta.version === MetadataVersion.V1Rust) {
      return meta.createType<T>(meta.types.state as number, state);
    }

    return meta.createType<T>((meta.types.state as HumanTypesRepr).output, state);
  }
}
