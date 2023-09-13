import { Bytes } from '@polkadot/types-codec';
import { HexString } from '@polkadot/util/types';
import { ProgramMetadata } from 'metadata';

export interface ReadStateParams {
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

export interface ReadStateBatchWithDifferentMetaParams {
  /**
   * Key is program id
   * Value is input payload expected by the `state` function and program metadata
   */
  idPayloadBatch: Record<HexString, { paylod: any; meta?: ProgramMetadata }>;
  /**
   * Block hash at which state is to be received
   */
  at?: HexString;
}

export interface ReadStateBatchParams {
  /**
   * Array of program ids and payload to be sent expected by the `state` function
   */
  idPayloadBatch: [HexString, Bytes | Uint8Array | string | number[]][];
  /**
   * Block hash at which state is to be received
   */
  at?: HexString;
}

export interface ReadStateUsingWasmParams {
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
