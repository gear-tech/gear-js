import '@polkadot/rpc-core/types/jsonrpc';

import type { AnyNumber, Codec } from '@polkadot/types-codec/types';
import type { AugmentedRpc } from '@polkadot/rpc-core/types';
import type { BlockHash } from '@polkadot/types/interfaces/chain';
import type { Bytes } from '@polkadot/types-codec';
import type { H256 } from '@polkadot/types/interfaces/runtime';
import type { Observable } from '@polkadot/types/types';

import { GasInfo } from '../interfaces/gas';
import { InflationInfo } from '../common';

export type __AugmentedRpc = AugmentedRpc<() => unknown>;

declare module '@polkadot/rpc-core/types/jsonrpc' {
  interface RpcInterface {
    gear: {
      /**
       * Calculate gas for Init message using upload_program extrinsic
       */
      calculateInitUploadGas: AugmentedRpc<
        (
          source: string | Uint8Array | H256,
          code: Bytes | Uint8Array | number[],
          initPayload: Bytes | Uint8Array | number[] | string,
          value: AnyNumber,
          allowOtherPanics: boolean,
        ) => Observable<GasInfo>
      >;
      /**
       * Calculate gas for Init message using create_program extrinsic
       */
      calculateInitCreateGas: AugmentedRpc<
        (
          source: string | Uint8Array | H256,
          codeId: string | Uint8Array | H256,
          initPayload: Bytes | Uint8Array | number[] | string,
          value: AnyNumber,
          allowOtherPanics: boolean,
        ) => Observable<GasInfo>
      >;
      /**
       * Calculate gas for Handle message
       */
      calculateHandleGas: AugmentedRpc<
        (
          source: string | Uint8Array | H256,
          dest: string | Uint8Array | H256,
          payload: Bytes | Uint8Array | number[] | string,
          value: AnyNumber,
          allowOtherPanics: boolean,
        ) => Observable<GasInfo>
      >;
      /**
       * Calculate gas for Reply message
       */
      calculateReplyGas: AugmentedRpc<
        (
          source: string | Uint8Array | H256,
          messageId: string | Uint8Array | H256,
          payload: Bytes | Uint8Array | number[] | string,
          value: AnyNumber,
          allowOtherPanics: boolean,
        ) => Observable<GasInfo>
      >;
      readMetahash: AugmentedRpc<
        (programId: string | Uint8Array, at?: BlockHash | string | Uint8Array) => Observable<H256>
      >;
      readState: AugmentedRpc<
        (
          programId: string | Uint8Array,
          payload: Bytes | Uint8Array | number[] | string,
          at?: BlockHash | string | Uint8Array,
        ) => Observable<Codec>
      >;
      readStateUsingWasm: AugmentedRpc<
        (
          programId: string | Uint8Array,
          payload: Bytes | Uint8Array | number[] | string,
          fnName: Bytes | string,
          wasm: Bytes | string,
          argument?: Bytes | Uint8Array | number[] | string,
          at?: BlockHash | string | Uint8Array,
        ) => Observable<Bytes>
      >;
      readStateBatch: AugmentedRpc<
        (
          batchIdPayload: [string | Uint8Array | H256, Bytes | Uint8Array | number[] | string][],
          at?: BlockHash | string | Uint8Array,
        ) => Observable<Bytes[]>
      >;
      readStateUsingWasmBatch: AugmentedRpc<
        (
          batchIdPayload: [string | Uint8Array | H256, Bytes | Uint8Array | number[] | string][],
          fnName: Bytes | string,
          wasm: Bytes | string,
          argument?: Bytes | Uint8Array | number[] | string,
          at?: BlockHash | string | Uint8Array,
        ) => Observable<Bytes>
      >;
    };
    stakingRewards: {
      inflationInfo: AugmentedRpc<(at?: BlockHash | string | Uint8Array) => Observable<InflationInfo>>;
    };
  }
}
