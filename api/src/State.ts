import { AnyJson, Codec } from '@polkadot/types/types';
import { HexString } from '@polkadot/util/types';

import { ProgramMetadata, StateMetadata } from './metadata';
import { getWasmMetadata, readState } from './wasm';
import { CreateType } from './create-type';
import { GearProgramStorage } from './Storage';
import { OldMetadata } from './types';
import { ReadStateError } from './errors';

interface ReadStateArgs {
  programId: HexString;
  at?: HexString;
}

export class GearProgramState extends GearProgramStorage {
  private async newRead(
    args: { programId: HexString; at?: HexString },
    meta: ProgramMetadata,
    type?: number,
  ): Promise<Codec> {
    const state = await this._api.rpc['gear'].readState(args.programId, args.at || null);
    return meta.createType(type || meta.types.state, state);
  }

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
   * Decode state to meta_state_output type
   * @param state - Uint8Array state representation
   * @param meta - Metadata
   * @returns decoded state
   */
  private decodeState(state: Uint8Array, meta: OldMetadata): Codec {
    if (!state) {
      throw new ReadStateError('Unable to read state. meta_state function is not specified in metadata');
    }
    const bytes = this._api.createType('Bytes', Array.from(state));
    const decoded = CreateType.create(meta.meta_state_output, bytes, meta.types);
    return decoded;
  }

  /**
   * Encode input parameters to read meta state
   * @param meta - Metadata
   * @param inputValue - input parameters
   * @returns ArrayBuffer with encoded data
   */
  private encodeInput(meta: OldMetadata, inputValue: AnyJson): Uint8Array {
    const encoded = CreateType.create(meta.meta_state_input, inputValue, meta.types);
    return encoded.toU8a();
  }

  private async oldRead(programId: HexString, metaWasm: Buffer, inputValue?: AnyJson): Promise<Codec> {
    const codeHash = await this._api.program.codeHash(programId);
    let initialSize = await this._api.code.staticPages(codeHash);

    const program = await this.getProgram(programId);

    program.allocations.forEach((value) => {
      if (value.gtn(initialSize - 1)) {
        initialSize = value.toNumber();
      }
    });

    initialSize++;

    const pages = await this.getProgramPages(programId, program);
    const blockHash = await this._api.blocks.getFinalizedHead();
    const block = await this._api.blocks.get(blockHash);

    const blockTimestamp = await this._api.blocks.getBlockTimestamp(block);

    const blockNumber = block.block.header.number.unwrap();

    if (!pages) {
      throw new ReadStateError('Unable to read state. Unable to recieve program pages from chain');
    }
    const metadata = await getWasmMetadata(metaWasm);
    if (!metadata.meta_state_output) {
      throw new ReadStateError('Unable to read state. meta_state_output type is not specified in metadata');
    }
    if (metadata.meta_state_input && inputValue === undefined) {
      throw new ReadStateError('Unable to read state. inputValue not specified');
    }
    const encodedInput = inputValue === undefined ? undefined : this.encodeInput(metadata, inputValue);

    const state = await readState(metaWasm, initialSize, pages, encodedInput, blockTimestamp.unwrap(), blockNumber);

    return this.decodeState(state, metadata);
  }

  /**
   * Read state of particular program
   * @param programId
   * @param metaWasm - file with metadata
   * @returns decoded state
   */
  read(programId: HexString, metaWasm: Buffer, inputValue?: AnyJson): Promise<Codec>;

  /**
   *
   * @param args ProgramId and hash of block where it's necessary to read state (optional)
   * @param meta Program metadata returned from getProgramMetadata function
   * @param type (optional) Index of type to decode state. metadata.types.state is uesd by default
   */
  read(args: ReadStateArgs, meta: ProgramMetadata, type?: number): Promise<Codec>;

  read<S extends HexString | ReadStateArgs = HexString | ReadStateArgs>(
    programIdOrArgs: S,
    metaOrMetaWasm: S extends HexString ? Buffer : ProgramMetadata,
    inputValueOrType: S extends HexString ? AnyJson : number,
  ): Promise<Codec> {
    if (typeof programIdOrArgs === 'object') {
      return this.newRead(programIdOrArgs, metaOrMetaWasm as ProgramMetadata, inputValueOrType as number);
    } else {
      return this.oldRead(programIdOrArgs, metaOrMetaWasm as Buffer, inputValueOrType);
    }
  }
}
