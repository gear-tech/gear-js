import '@polkadot/api-base/types/events';

import type { BTreeMap, BTreeSet, Option, bool, u32 } from '@polkadot/types-codec';
import {
  GearCommonEventCodeChangeKind,
  GearCommonEventDispatchStatus,
  GearCommonEventMessageEntry,
  GearCommonEventProgramChangeKind,
  GearCommonEventReasonMessageWaitedRuntimeReason,
  GearCommonEventReasonMessageWokenRuntimeReason,
  GearCommonEventReasonUserMessageReadRuntimeReason,
  GearCommonGasProviderNodeGasNodeId,
  GearCoreMessageUserUserMessage,
  GprimitivesActorId,
  GprimitivesCodeId,
  GprimitivesMessageId,
  PalletGearDebugDebugData,
  PalletGearVoucherInternalVoucherId,
} from '../lookup';
import type { AccountId32 } from '@polkadot/types/interfaces/runtime';
import type { ApiTypes } from '@polkadot/api-base/types';

declare module '@polkadot/api-base/types/events' {
  interface AugmentedEvents<ApiType extends ApiTypes> {
    gear: {
      /**
       * Any data related to program codes changed.
       **/
      CodeChanged: AugmentedEvent<
        ApiType,
        [id: GprimitivesCodeId, change: GearCommonEventCodeChangeKind],
        { id: GprimitivesCodeId; change: GearCommonEventCodeChangeKind }
      >;
      /**
       * User sends message to program, which was successfully
       * added to the Gear message queue.
       **/
      MessageQueued: AugmentedEvent<
        ApiType,
        [
          id: GprimitivesMessageId,
          source: AccountId32,
          destination: GprimitivesActorId,
          entry: GearCommonEventMessageEntry,
        ],
        {
          id: GprimitivesMessageId;
          source: AccountId32;
          destination: GprimitivesActorId;
          entry: GearCommonEventMessageEntry;
        }
      >;
      /**
       * The result of processing the messages within the block.
       **/
      MessagesDispatched: AugmentedEvent<
        ApiType,
        [
          total: u32,
          statuses: BTreeMap<GprimitivesMessageId, GearCommonEventDispatchStatus>,
          stateChanges: BTreeSet<GprimitivesActorId>,
        ],
        {
          total: u32;
          statuses: BTreeMap<GprimitivesMessageId, GearCommonEventDispatchStatus>;
          stateChanges: BTreeSet<GprimitivesActorId>;
        }
      >;
      /**
       * Messages execution delayed (waited) and successfully
       * added to gear waitlist.
       **/
      MessageWaited: AugmentedEvent<
        ApiType,
        [
          id: GprimitivesMessageId,
          origin: Option<GearCommonGasProviderNodeGasNodeId>,
          reason: GearCommonEventReasonMessageWaitedRuntimeReason,
          expiration: u32,
        ],
        {
          id: GprimitivesMessageId;
          origin: Option<GearCommonGasProviderNodeGasNodeId>;
          reason: GearCommonEventReasonMessageWaitedRuntimeReason;
          expiration: u32;
        }
      >;
      /**
       * Message is ready to continue its execution
       * and was removed from `Waitlist`.
       **/
      MessageWoken: AugmentedEvent<
        ApiType,
        [id: GprimitivesMessageId, reason: GearCommonEventReasonMessageWokenRuntimeReason],
        { id: GprimitivesMessageId; reason: GearCommonEventReasonMessageWokenRuntimeReason }
      >;
      /**
       * Any data related to programs changed.
       **/
      ProgramChanged: AugmentedEvent<
        ApiType,
        [id: GprimitivesActorId, change: GearCommonEventProgramChangeKind],
        { id: GprimitivesActorId; change: GearCommonEventProgramChangeKind }
      >;
      /**
       * The pseudo-inherent extrinsic that runs queue processing rolled back or not executed.
       **/
      QueueNotProcessed: AugmentedEvent<ApiType, []>;
      /**
       * Message marked as "read" and removes it from `Mailbox`.
       * This event only affects messages that were
       * already inserted in `Mailbox`.
       **/
      UserMessageRead: AugmentedEvent<
        ApiType,
        [id: GprimitivesMessageId, reason: GearCommonEventReasonUserMessageReadRuntimeReason],
        { id: GprimitivesMessageId; reason: GearCommonEventReasonUserMessageReadRuntimeReason }
      >;
      /**
       * Somebody sent a message to the user.
       **/
      UserMessageSent: AugmentedEvent<
        ApiType,
        [message: GearCoreMessageUserUserMessage, expiration: Option<u32>],
        { message: GearCoreMessageUserUserMessage; expiration: Option<u32> }
      >;
      /**
       * Generic event
       **/
      [key: string]: AugmentedEvent<ApiType>;
    };
    gearDebug: {
      /**
       * A snapshot of the debug data: programs and message queue ('debug mode' only)
       **/
      DebugDataSnapshot: AugmentedEvent<ApiType, [PalletGearDebugDebugData]>;
      DebugMode: AugmentedEvent<ApiType, [bool]>;
      /**
       * Generic event
       **/
      [key: string]: AugmentedEvent<ApiType>;
    };
    gearEthBridge: {
      /**
       * Grandpa validator's keys set was hashed and set in storage at
       * first block of the last session in the era.
       **/
      AuthoritySetHashChanged: AugmentedEvent<ApiType, [H256]>;
      /**
       * Bridge got cleared on initialization of the second block in a new era.
       **/
      BridgeCleared: AugmentedEvent<ApiType, []>;
      /**
       * Optimistically, single-time called event defining that pallet
       * got initialized and started processing session changes,
       * as well as putting initial zeroed queue merkle root.
       **/
      BridgeInitialized: AugmentedEvent<ApiType, []>;
      /**
       * Bridge was paused and temporary doesn't process any incoming requests.
       **/
      BridgePaused: AugmentedEvent<ApiType, []>;
      /**
       * Bridge was unpaused and from now on processes any incoming requests.
       **/
      BridgeUnpaused: AugmentedEvent<ApiType, []>;
      /**
       * A new message was queued for bridging.
       **/
      MessageQueued: AugmentedEvent<
        ApiType,
        [message: PalletGearEthBridgeInternalEthMessage, hash_: H256],
        { message: PalletGearEthBridgeInternalEthMessage; hash_: H256 }
      >;
      /**
       * Merkle root of the queue changed: new messages queued within the block.
       **/
      QueueMerkleRootChanged: AugmentedEvent<ApiType, [H256]>;
      /**
       * Generic event
       **/
      [key: string]: AugmentedEvent<ApiType>;
    };
    gearVoucher: {
      /**
       * Voucher has been declined (set to expired state).
       **/
      VoucherDeclined: AugmentedEvent<
        ApiType,
        [spender: AccountId32, voucherId: PalletGearVoucherInternalVoucherId],
        { spender: AccountId32; voucherId: PalletGearVoucherInternalVoucherId }
      >;
      /**
       * Voucher has been issued.
       **/
      VoucherIssued: AugmentedEvent<
        ApiType,
        [owner: AccountId32, spender: AccountId32, voucherId: PalletGearVoucherInternalVoucherId],
        { owner: AccountId32; spender: AccountId32; voucherId: PalletGearVoucherInternalVoucherId }
      >;
      /**
       * Voucher has been revoked by owner.
       *
       * NOTE: currently means only "refunded".
       **/
      VoucherRevoked: AugmentedEvent<
        ApiType,
        [spender: AccountId32, voucherId: PalletGearVoucherInternalVoucherId],
        { spender: AccountId32; voucherId: PalletGearVoucherInternalVoucherId }
      >;
      /**
       * Voucher has been updated.
       **/
      VoucherUpdated: AugmentedEvent<
        ApiType,
        [spender: AccountId32, voucherId: PalletGearVoucherInternalVoucherId, newOwner: Option<AccountId32>],
        { spender: AccountId32; voucherId: PalletGearVoucherInternalVoucherId; newOwner: Option<AccountId32> }
      >;
      /**
       * Generic event
       **/
      [key: string]: AugmentedEvent<ApiType>;
    };
  }
}
