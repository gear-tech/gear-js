/* eslint-disable */
import '@polkadot/api-base/types/storage';

import type { ApiTypes, AugmentedQuery, QueryableStorageEntry } from '@polkadot/api-base/types';
import type { BTreeMap, Bytes, Null, Option, U256, U8aFixed, Vec, bool, u128, u32, u64 } from '@polkadot/types-codec';
import type { AnyNumber, ITuple } from '@polkadot/types-codec/types';
import type { AccountId32, H256 } from '@polkadot/types/interfaces/runtime';
import type { Observable } from '@polkadot/types/types';
import {
  GearCommonCodeMetadata,
  GearCommonGasProviderNodeGasNode,
  GearCommonGasProviderNodeGasNodeId,
  GearCommonSchedulerTaskScheduledTask,
  GearCommonStorageComplicatedDequeueLinkedNode,
  GearCommonStoragePrimitivesInterval,
  GearCoreCodeInstrumentedInstrumentedCode,
  GearCoreMessageStoredStoredDelayedDispatch,
  GearCoreMessageStoredStoredDispatch,
  GearCoreMessageUserUserStoredMessage,
  GearCoreProgram,
  GprimitivesActorId,
  GprimitivesCodeId,
  GprimitivesMessageId,
  NumeratedTreeIntervalsTree,
  PalletGearBankBankAccount,
  PalletGearVoucherInternalVoucherId,
  PalletGearVoucherInternalVoucherInfo,
} from '../lookup';

export type __AugmentedQuery<ApiType extends ApiTypes> = AugmentedQuery<ApiType, () => unknown>;
export type __QueryableStorageEntry<ApiType extends ApiTypes> = QueryableStorageEntry<ApiType>;

declare module '@polkadot/api-base/types/storage' {
  interface AugmentedQueries<ApiType extends ApiTypes> {
    gear: {
      /**
       * The current block number being processed.
       *
       * It shows block number in which queue is processed.
       * May be less than system pallet block number if panic occurred previously.
       **/
      blockNumber: AugmentedQuery<ApiType, () => Observable<u32>, []> & QueryableStorageEntry<ApiType, []>;
      /**
       * A flag indicating whether the message queue should be processed at the end of a block
       *
       * If not set, the inherent extrinsic that processes the queue will keep throwing an error
       * thereby making the block builder exclude it from the block.
       **/
      executeInherent: AugmentedQuery<ApiType, () => Observable<bool>, []> & QueryableStorageEntry<ApiType, []>;
      /**
       * A guard to prohibit all but the first execution of `pallet_gear::run()` call in a block.
       *
       * Set to `Some(())` if the extrinsic is executed for the first time in a block.
       * All subsequent attempts would fail with `Error::<T>::GearRunAlreadyInBlock` error.
       * Set back to `None` in the `on_finalize()` hook at the end of the block.
       **/
      gearRunInBlock: AugmentedQuery<ApiType, () => Observable<Option<Null>>, []> & QueryableStorageEntry<ApiType, []>;
      /**
       * Generic query
       **/
      [key: string]: QueryableStorageEntry<ApiType>;
    };
    gearBank: {
      bank: AugmentedQuery<
        ApiType,
        (arg: AccountId32 | string | Uint8Array) => Observable<Option<PalletGearBankBankAccount>>,
        [AccountId32]
      > &
        QueryableStorageEntry<ApiType, [AccountId32]>;
      onFinalizeTransfers: AugmentedQuery<
        ApiType,
        (arg: AccountId32 | string | Uint8Array) => Observable<Option<u128>>,
        [AccountId32]
      > &
        QueryableStorageEntry<ApiType, [AccountId32]>;
      onFinalizeValue: AugmentedQuery<ApiType, () => Observable<u128>, []> & QueryableStorageEntry<ApiType, []>;
      unusedValue: AugmentedQuery<ApiType, () => Observable<u128>, []> & QueryableStorageEntry<ApiType, []>;
      /**
       * Generic query
       **/
      [key: string]: QueryableStorageEntry<ApiType>;
    };
    gearDebug: {
      debugMode: AugmentedQuery<ApiType, () => Observable<bool>, []> & QueryableStorageEntry<ApiType, []>;
      programsMap: AugmentedQuery<ApiType, () => Observable<BTreeMap<H256, H256>>, []> &
        QueryableStorageEntry<ApiType, []>;
      remapId: AugmentedQuery<ApiType, () => Observable<bool>, []> & QueryableStorageEntry<ApiType, []>;
      /**
       * Generic query
       **/
      [key: string]: QueryableStorageEntry<ApiType>;
    };
    gearEthBridge: {
      /**
       * Primary storage.
       *
       * Keeps hash of queued validator keys for the next era.
       *
       * **Invariant**: Key exists in storage since first block of some era's last
       * session, until initialization of the second block of the next era.
       **/
      authoritySetHash: AugmentedQuery<ApiType, () => Observable<Option<H256>>, []> &
        QueryableStorageEntry<ApiType, []>;
      /**
       * Operational storage.
       *
       * Defines in how many on_initialize hooks queue, queue merkle root and
       * grandpa keys hash should be cleared.
       *
       * **Invariant**: set to 2 on_init hooks when new session with authorities
       * set change, then decreasing to zero on each new block hook. When equals
       * to zero, reset is performed.
       **/
      clearTimer: AugmentedQuery<ApiType, () => Observable<Option<u32>>, []> & QueryableStorageEntry<ApiType, []>;
      /**
       * Lifecycle storage.
       *
       * Defines if pallet got initialized and focused on common session changes.
       **/
      initialized: AugmentedQuery<ApiType, () => Observable<bool>, []> & QueryableStorageEntry<ApiType, []>;
      /**
       * Operational storage.
       *
       * Keeps next message's nonce for bridging. Must be increased on each use.
       **/
      messageNonce: AugmentedQuery<ApiType, () => Observable<U256>, []> & QueryableStorageEntry<ApiType, []>;
      /**
       * Lifecycle storage.
       *
       * Defines if pallet is accepting any mutable requests. Governance-ruled.
       **/
      paused: AugmentedQuery<ApiType, () => Observable<bool>, []> & QueryableStorageEntry<ApiType, []>;
      /**
       * Primary storage.
       *
       * Keeps bridge's queued messages keccak hashes.
       **/
      queue: AugmentedQuery<ApiType, () => Observable<Vec<H256>>, []> & QueryableStorageEntry<ApiType, []>;
      /**
       * Operational storage.
       *
       * Defines if queue was changed within the block, it's necessary to
       * update queue merkle root by the end of the block.
       **/
      queueChanged: AugmentedQuery<ApiType, () => Observable<bool>, []> & QueryableStorageEntry<ApiType, []>;
      /**
       * Primary storage.
       *
       * Keeps merkle root of the bridge's queued messages.
       *
       * **Invariant**: Key exists since pallet initialization. If queue is empty,
       * zeroed hash set in storage.
       **/
      queueMerkleRoot: AugmentedQuery<ApiType, () => Observable<Option<H256>>, []> & QueryableStorageEntry<ApiType, []>;
      /**
       * Operational storage.
       *
       * Declares timer of the session changes (`on_new_session` calls),
       * when `queued_validators` must be stored within the pallet.
       *
       * **Invariant**: reducing each time on new session, it equals 0 only
       * since storing grandpa keys hash until next session change,
       * when it becomes `SessionPerEra - 1`.
       **/
      sessionsTimer: AugmentedQuery<ApiType, () => Observable<u32>, []> & QueryableStorageEntry<ApiType, []>;
      /**
       * Generic query
       **/
      [key: string]: QueryableStorageEntry<ApiType>;
    };
    gearGas: {
      allowance: AugmentedQuery<ApiType, () => Observable<u64>, []> & QueryableStorageEntry<ApiType, []>;
      gasNodes: AugmentedQuery<
        ApiType,
        (
          arg: GearCommonGasProviderNodeGasNodeId | { Node: any } | { Reservation: any } | string | Uint8Array,
        ) => Observable<Option<GearCommonGasProviderNodeGasNode>>,
        [GearCommonGasProviderNodeGasNodeId]
      > &
        QueryableStorageEntry<ApiType, [GearCommonGasProviderNodeGasNodeId]>;
      totalIssuance: AugmentedQuery<ApiType, () => Observable<Option<u64>>, []> & QueryableStorageEntry<ApiType, []>;
      /**
       * Generic query
       **/
      [key: string]: QueryableStorageEntry<ApiType>;
    };
    gearMessenger: {
      /**
       * Counter for the related counted storage map
       **/
      counterForDispatches: AugmentedQuery<ApiType, () => Observable<u32>, []> & QueryableStorageEntry<ApiType, []>;
      dequeued: AugmentedQuery<ApiType, () => Observable<Option<u32>>, []> & QueryableStorageEntry<ApiType, []>;
      dispatches: AugmentedQuery<
        ApiType,
        (
          arg: GprimitivesMessageId | string | Uint8Array,
        ) => Observable<Option<GearCommonStorageComplicatedDequeueLinkedNode>>,
        [GprimitivesMessageId]
      > &
        QueryableStorageEntry<ApiType, [GprimitivesMessageId]>;
      dispatchStash: AugmentedQuery<
        ApiType,
        (
          arg: GprimitivesMessageId | string | Uint8Array,
        ) => Observable<
          Option<ITuple<[GearCoreMessageStoredStoredDelayedDispatch, GearCommonStoragePrimitivesInterval]>>
        >,
        [GprimitivesMessageId]
      > &
        QueryableStorageEntry<ApiType, [GprimitivesMessageId]>;
      head: AugmentedQuery<ApiType, () => Observable<Option<U8aFixed>>, []> & QueryableStorageEntry<ApiType, []>;
      mailbox: AugmentedQuery<
        ApiType,
        (
          arg1: AccountId32 | string | Uint8Array,
          arg2: GprimitivesMessageId | string | Uint8Array,
        ) => Observable<Option<ITuple<[GearCoreMessageUserUserStoredMessage, GearCommonStoragePrimitivesInterval]>>>,
        [AccountId32, GprimitivesMessageId]
      > &
        QueryableStorageEntry<ApiType, [AccountId32, GprimitivesMessageId]>;
      queueProcessing: AugmentedQuery<ApiType, () => Observable<Option<bool>>, []> & QueryableStorageEntry<ApiType, []>;
      sent: AugmentedQuery<ApiType, () => Observable<Option<u32>>, []> & QueryableStorageEntry<ApiType, []>;
      tail: AugmentedQuery<ApiType, () => Observable<Option<U8aFixed>>, []> & QueryableStorageEntry<ApiType, []>;
      waitlist: AugmentedQuery<
        ApiType,
        (
          arg1: GprimitivesActorId | string | Uint8Array,
          arg2: GprimitivesMessageId | string | Uint8Array,
        ) => Observable<Option<ITuple<[GearCoreMessageStoredStoredDispatch, GearCommonStoragePrimitivesInterval]>>>,
        [GprimitivesActorId, GprimitivesMessageId]
      > &
        QueryableStorageEntry<ApiType, [GprimitivesActorId, GprimitivesMessageId]>;
      /**
       * Generic query
       **/
      [key: string]: QueryableStorageEntry<ApiType>;
    };
    gearProgram: {
      allocationsStorage: AugmentedQuery<
        ApiType,
        (arg: GprimitivesActorId | string | Uint8Array) => Observable<Option<NumeratedTreeIntervalsTree>>,
        [GprimitivesActorId]
      > &
        QueryableStorageEntry<ApiType, [GprimitivesActorId]>;
      codeLenStorage: AugmentedQuery<
        ApiType,
        (arg: GprimitivesCodeId | string | Uint8Array) => Observable<Option<u32>>,
        [GprimitivesCodeId]
      > &
        QueryableStorageEntry<ApiType, [GprimitivesCodeId]>;
      codeStorage: AugmentedQuery<
        ApiType,
        (arg: GprimitivesCodeId | string | Uint8Array) => Observable<Option<GearCoreCodeInstrumentedInstrumentedCode>>,
        [GprimitivesCodeId]
      > &
        QueryableStorageEntry<ApiType, [GprimitivesCodeId]>;
      memoryPages: AugmentedQuery<
        ApiType,
        (
          arg1: GprimitivesActorId | string | Uint8Array,
          arg2: u32 | AnyNumber | Uint8Array,
          arg3: u32 | AnyNumber | Uint8Array,
        ) => Observable<Option<Bytes>>,
        [GprimitivesActorId, u32, u32]
      > &
        QueryableStorageEntry<ApiType, [GprimitivesActorId, u32, u32]>;
      metadataStorage: AugmentedQuery<
        ApiType,
        (arg: GprimitivesCodeId | string | Uint8Array) => Observable<Option<GearCommonCodeMetadata>>,
        [GprimitivesCodeId]
      > &
        QueryableStorageEntry<ApiType, [GprimitivesCodeId]>;
      originalCodeStorage: AugmentedQuery<
        ApiType,
        (arg: GprimitivesCodeId | string | Uint8Array) => Observable<Option<Bytes>>,
        [GprimitivesCodeId]
      > &
        QueryableStorageEntry<ApiType, [GprimitivesCodeId]>;
      programStorage: AugmentedQuery<
        ApiType,
        (arg: GprimitivesActorId | string | Uint8Array) => Observable<Option<GearCoreProgram>>,
        [GprimitivesActorId]
      > &
        QueryableStorageEntry<ApiType, [GprimitivesActorId]>;
      /**
       * Generic query
       **/
      [key: string]: QueryableStorageEntry<ApiType>;
    };
    gearScheduler: {
      firstIncompleteTasksBlock: AugmentedQuery<ApiType, () => Observable<Option<u32>>, []> &
        QueryableStorageEntry<ApiType, []>;
      taskPool: AugmentedQuery<
        ApiType,
        (
          arg1: u32 | AnyNumber | Uint8Array,
          arg2:
            | GearCommonSchedulerTaskScheduledTask
            | { PauseProgram: any }
            | { RemoveCode: any }
            | { RemoveFromMailbox: any }
            | { RemoveFromWaitlist: any }
            | { RemovePausedProgram: any }
            | { WakeMessage: any }
            | { SendDispatch: any }
            | { SendUserMessage: any }
            | { RemoveGasReservation: any }
            | { RemoveResumeSession: any }
            | string
            | Uint8Array,
        ) => Observable<Option<Null>>,
        [u32, GearCommonSchedulerTaskScheduledTask]
      > &
        QueryableStorageEntry<ApiType, [u32, GearCommonSchedulerTaskScheduledTask]>;
      /**
       * Generic query
       **/
      [key: string]: QueryableStorageEntry<ApiType>;
    };
    gearVoucher: {
      /**
       * Storage containing amount of the total vouchers issued.
       *
       * Used as nonce in voucher creation.
       **/
      issued: AugmentedQuery<ApiType, () => Observable<Option<u64>>, []> & QueryableStorageEntry<ApiType, []>;
      /**
       * Double map storage containing data of the voucher,
       * associated with some spender and voucher ids.
       **/
      vouchers: AugmentedQuery<
        ApiType,
        (
          arg1: AccountId32 | string | Uint8Array,
          arg2: PalletGearVoucherInternalVoucherId | string | Uint8Array,
        ) => Observable<Option<PalletGearVoucherInternalVoucherInfo>>,
        [AccountId32, PalletGearVoucherInternalVoucherId]
      > &
        QueryableStorageEntry<ApiType, [AccountId32, PalletGearVoucherInternalVoucherId]>;
      /**
       * Generic query
       **/
      [key: string]: QueryableStorageEntry<ApiType>;
    };
  }
}
