import { HexString } from '@polkadot/util/types';

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
