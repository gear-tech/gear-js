import '@polkadot/rpc-core/types/jsonrpc';

import type { AnyNumber, Codec } from '@polkadot/types-codec/types';
import type { AugmentedRpc } from '@polkadot/rpc-core/types';
import type { BlockHash } from '@polkadot/types/interfaces/chain';
import type { Bytes, u64 } from '@polkadot/types-codec';
import type { H256 } from '@polkadot/types/interfaces/runtime';
import type { Observable } from '@polkadot/types/types';

import { GasInfo, ReplyInfo } from '../interfaces';
import { InflationInfo, Proof } from '../common';

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
      /**
       * Calculate gas for Init message using upload_program extrinsic
       */
      calculateGasForUpload: AugmentedRpc<
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
      calculateGasForCreate: AugmentedRpc<
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
      calculateGasForHandle: AugmentedRpc<
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
      calculateGasForReply: AugmentedRpc<
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
      /**
       * Calculate reply for Handle message
       */
      calculateReplyForHandle: AugmentedRpc<
        (
          origin: string | Uint8Array | H256,
          destination: string | Uint8Array | H256,
          payload: Bytes | Uint8Array | number[] | string,
          gasLimit: AnyNumber,
          value: AnyNumber,
          at: string | BlockHash | null,
        ) => Observable<ReplyInfo>
      >;
    };
    stakingRewards: {
      inflationInfo: AugmentedRpc<(at?: BlockHash | string | Uint8Array) => Observable<InflationInfo>>;
    };
    gearEthBridge: {
      merkleProof: AugmentedRpc<
        (hash: string | Uint8Array | H256, at?: BlockHash | string | Uint8Array) => Observable<Proof>
      >;
    };
    gearBuiltin: {
      queryId: AugmentedRpc<(builtinId: u64) => Observable<H256>>;
    };
  }
}
