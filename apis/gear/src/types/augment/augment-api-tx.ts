import '@polkadot/api-base/types/submittable';

import type { AccountId32, H160, Percent } from '@polkadot/types/interfaces/runtime';
import type { bool, BTreeSet, Bytes, Option, u128, u32, u64 } from '@polkadot/types-codec';
import {
  GprimitivesActorId,
  GprimitivesCodeId,
  GprimitivesMessageId,
  PalletGearVoucherInternalPrepaidCall,
  PalletGearVoucherInternalVoucherId,
} from '../lookup';
import type { AnyNumber } from '@polkadot/types-codec/types';
import type { ApiTypes } from '@polkadot/api-base/types';

declare module '@polkadot/api-base/types/submittable' {
  interface AugmentedSubmittables<ApiType extends ApiTypes> {
    gear: {
      /**
       * Claim value from message in `Mailbox`.
       *
       * Removes message by given `MessageId` from callers `Mailbox`:
       * rent funds become free, associated with the message value
       * transfers from message sender to extrinsic caller.
       *
       * NOTE: only user who is destination of the message, can claim value
       * or reply on the message from mailbox.
       **/
      claimValue: AugmentedSubmittable<
        (messageId: GprimitivesMessageId | string | Uint8Array) => SubmittableExtrinsic<ApiType>,
        [GprimitivesMessageId]
      >;
      /**
       * Transfers value from chain of terminated or exited programs to its final inheritor.
       *
       * `depth` parameter is how far to traverse to inheritor.
       * A value of 10 is sufficient for most cases.
       *
       * # Example of chain
       *
       * - Program #1 exits (e.g `gr_exit syscall) with argument pointing to user.
       * Balance of program #1 has been sent to user.
       * - Program #2 exits with inheritor pointing to program #1.
       * Balance of program #2 has been sent to exited program #1.
       * - Program #3 exits with inheritor pointing to program #2
       * Balance of program #1 has been sent to exited program #2.
       *
       * So chain of inheritors looks like: Program #3 -> Program #2 -> Program #1 -> User.
       *
       * We have programs #1 and #2 with stuck value on their balances.
       * The balances should've been transferred to user (final inheritor) according to the chain.
       * But protocol doesn't traverse the chain automatically, so user have to call this extrinsic.
       **/
      claimValueToInheritor: AugmentedSubmittable<
        (
          programId: GprimitivesActorId | string | Uint8Array,
          depth: u32 | AnyNumber | Uint8Array,
        ) => SubmittableExtrinsic<ApiType>,
        [GprimitivesActorId, u32]
      >;
      /**
       * Creates program via `code_id` from storage.
       *
       * Parameters:
       * - `code_id`: wasm code id in the code storage.
       * - `salt`: randomness term (a seed) to allow programs with identical code
       * to be created independently.
       * - `init_payload`: encoded parameters of the wasm module `init` function.
       * - `gas_limit`: maximum amount of gas the program can spend before it is halted.
       * - `value`: balance to be transferred to the program once it's been created.
       *
       * Emits the following events:
       * - `InitMessageEnqueued(MessageInfo)` when init message is placed in the queue.
       *
       * # NOTE
       *
       * For the details of this extrinsic, see `upload_code`.
       **/
      createProgram: AugmentedSubmittable<
        (
          codeId: GprimitivesCodeId | string | Uint8Array,
          salt: Bytes | string | Uint8Array,
          initPayload: Bytes | string | Uint8Array,
          gasLimit: u64 | AnyNumber | Uint8Array,
          value: u128 | AnyNumber | Uint8Array,
          keepAlive: bool | boolean | Uint8Array,
        ) => SubmittableExtrinsic<ApiType>,
        [GprimitivesCodeId, Bytes, Bytes, u64, u128, bool]
      >;
      /**
       * Process message queue
       **/
      run: AugmentedSubmittable<
        (maxGas: Option<u64> | null | Uint8Array | u64 | AnyNumber) => SubmittableExtrinsic<ApiType>,
        [Option<u64>]
      >;
      /**
       * Sends a message to a program or to another account.
       *
       * The origin must be Signed and the sender must have sufficient funds to pay
       * for `gas` and `value` (in case the latter is being transferred).
       *
       * To avoid an undefined behavior a check is made that the destination address
       * is not a program in uninitialized state. If the opposite holds true,
       * the message is not enqueued for processing.
       *
       * Parameters:
       * - `destination`: the message destination.
       * - `payload`: in case of a program destination, parameters of the `handle` function.
       * - `gas_limit`: maximum amount of gas the program can spend before it is halted.
       * - `value`: balance to be transferred to the program once it's been created.
       *
       * Emits the following events:
       * - `DispatchMessageEnqueued(MessageInfo)` when dispatch message is placed in the queue.
       **/
      sendMessage: AugmentedSubmittable<
        (
          destination: GprimitivesActorId | string | Uint8Array,
          payload: Bytes | string | Uint8Array,
          gasLimit: u64 | AnyNumber | Uint8Array,
          value: u128 | AnyNumber | Uint8Array,
          keepAlive: bool | boolean | Uint8Array,
        ) => SubmittableExtrinsic<ApiType>,
        [GprimitivesActorId, Bytes, u64, u128, bool]
      >;
      /**
       * Send reply on message in `Mailbox`.
       *
       * Removes message by given `MessageId` from callers `Mailbox`:
       * rent funds become free, associated with the message value
       * transfers from message sender to extrinsic caller.
       *
       * Generates reply on removed message with given parameters
       * and pushes it in `MessageQueue`.
       *
       * NOTE: source of the message in mailbox guaranteed to be a program.
       *
       * NOTE: only user who is destination of the message, can claim value
       * or reply on the message from mailbox.
       **/
      sendReply: AugmentedSubmittable<
        (
          replyToId: GprimitivesMessageId | string | Uint8Array,
          payload: Bytes | string | Uint8Array,
          gasLimit: u64 | AnyNumber | Uint8Array,
          value: u128 | AnyNumber | Uint8Array,
          keepAlive: bool | boolean | Uint8Array,
        ) => SubmittableExtrinsic<ApiType>,
        [GprimitivesMessageId, Bytes, u64, u128, bool]
      >;
      /**
       * Sets `ExecuteInherent` flag.
       *
       * Requires root origin (eventually, will only be set via referendum)
       **/
      setExecuteInherent: AugmentedSubmittable<
        (value: bool | boolean | Uint8Array) => SubmittableExtrinsic<ApiType>,
        [bool]
      >;
      /**
       * Saves program `code` in storage.
       *
       * The extrinsic was created to provide _deploy program from program_ functionality.
       * Anyone who wants to define a "factory" logic in program should first store the code and metadata for the "child"
       * program in storage. So the code for the child will be initialized by program initialization request only if it exists in storage.
       *
       * More precisely, the code and its metadata are actually saved in the storage under the hash of the `code`. The code hash is computed
       * as Blake256 hash. At the time of the call the `code` hash should not be in the storage. If it was stored previously, call will end up
       * with an `CodeAlreadyExists` error. In this case user can be sure, that he can actually use the hash of his program's code bytes to define
       * "program factory" logic in his program.
       *
       * Parameters
       * - `code`: wasm code of a program as a byte vector.
       *
       * Emits the following events:
       * - `SavedCode(H256)` - when the code is saved in storage.
       **/
      uploadCode: AugmentedSubmittable<(code: Bytes | string | Uint8Array) => SubmittableExtrinsic<ApiType>, [Bytes]>;
      /**
       * Creates program initialization request (message), that is scheduled to be run in the same block.
       *
       * There are no guarantees that initialization message will be run in the same block due to block
       * gas limit restrictions. For example, when it will be the message's turn, required gas limit for it
       * could be more than remaining block gas limit. Therefore, the message processing will be postponed
       * until the next block.
       *
       * `ActorId` is computed as Blake256 hash of concatenated bytes of `code` + `salt`. (todo #512 `code_hash` + `salt`)
       * Such `ActorId` must not exist in the Program Storage at the time of this call.
       *
       * There is the same guarantee here as in `upload_code`. That is, future program's
       * `code` and metadata are stored before message was added to the queue and processed.
       *
       * The origin must be Signed and the sender must have sufficient funds to pay
       * for `gas` and `value` (in case the latter is being transferred).
       *
       * Gear runtime guarantees that an active program always has an account to store value.
       * If the underlying account management platform (e.g. Substrate's System pallet) requires
       * an existential deposit to keep an account alive, the related overhead is considered an
       * extra cost related with a program instantiation and is charged to the program's creator
       * and is released back to the creator when the program is removed.
       * In context of the above, the `value` parameter represents the so-called `reducible` balance
       * a program should have at its disposal upon instantiation. It is not used to offset the
       * existential deposit required for an account creation.
       *
       * Parameters:
       * - `code`: wasm code of a program as a byte vector.
       * - `salt`: randomness term (a seed) to allow programs with identical code
       * to be created independently.
       * - `init_payload`: encoded parameters of the wasm module `init` function.
       * - `gas_limit`: maximum amount of gas the program can spend before it is halted.
       * - `value`: balance to be transferred to the program once it's been created.
       *
       * Emits the following events:
       * - `InitMessageEnqueued(MessageInfo)` when init message is placed in the queue.
       *
       * # Note
       * Faulty (uninitialized) programs still have a valid addresses (program ids) that can deterministically be derived on the
       * caller's side upfront. It means that if messages are sent to such an address, they might still linger in the queue.
       *
       * In order to mitigate the risk of users' funds being sent to an address,
       * where a valid program should have resided, while it's not,
       * such "failed-to-initialize" programs are not silently deleted from the
       * program storage but rather marked as "ghost" programs.
       * Ghost program can be removed by their original author via an explicit call.
       * The funds stored by a ghost program will be release to the author once the program
       * has been removed.
       **/
      uploadProgram: AugmentedSubmittable<
        (
          code: Bytes | string | Uint8Array,
          salt: Bytes | string | Uint8Array,
          initPayload: Bytes | string | Uint8Array,
          gasLimit: u64 | AnyNumber | Uint8Array,
          value: u128 | AnyNumber | Uint8Array,
          keepAlive: bool | boolean | Uint8Array,
        ) => SubmittableExtrinsic<ApiType>,
        [Bytes, Bytes, Bytes, u64, u128, bool]
      >;
      /**
       * Generic tx
       **/
      [key: string]: SubmittableExtrinsicFunction<ApiType>;
    };
    gearDebug: {
      /**
       * Turn the debug mode on and off.
       *
       * The origin must be the root.
       *
       * Parameters:
       * - `debug_mode_on`: if true, debug mode will be turned on, turned off otherwise.
       *
       * Emits the following events:
       * - `DebugMode(debug_mode_on).
       **/
      enableDebugMode: AugmentedSubmittable<
        (debugModeOn: bool | boolean | Uint8Array) => SubmittableExtrinsic<ApiType>,
        [bool]
      >;
      /**
       * A dummy extrinsic with programmatically set weight.
       *
       * Used in tests to exhaust block resources.
       *
       * Parameters:
       * - `fraction`: the fraction of the `max_extrinsic` the extrinsic will use.
       **/
      exhaustBlockResources: AugmentedSubmittable<
        (fraction: Percent | AnyNumber | Uint8Array) => SubmittableExtrinsic<ApiType>,
        [Percent]
      >;
      /**
       * Generic tx
       **/
      [key: string]: SubmittableExtrinsicFunction<ApiType>;
    };
    gearEthBridge: {
      /**
       * Root extrinsic that pauses pallet.
       * When paused, no new messages could be queued.
       **/
      pause: AugmentedSubmittable<() => SubmittableExtrinsic<ApiType>, []>;
      /**
       * Extrinsic that inserts message in a bridging queue,
       * updating queue merkle root at the end of the block.
       **/
      sendEthMessage: AugmentedSubmittable<
        (
          destination: H160 | string | Uint8Array,
          payload: Bytes | string | Uint8Array,
        ) => SubmittableExtrinsic<ApiType>,
        [H160, Bytes]
      >;
      /**
       * Root extrinsic that sets fee for the transport of messages.
       **/
      setFee: AugmentedSubmittable<(fee: u128 | AnyNumber | Uint8Array) => SubmittableExtrinsic<ApiType>, [u128]>;
      /**
       * Root extrinsic that unpauses pallet.
       * When paused, no new messages could be queued.
       **/
      unpause: AugmentedSubmittable<() => SubmittableExtrinsic<ApiType>, []>;
      /**
       * Generic tx
       **/
      [key: string]: SubmittableExtrinsicFunction<ApiType>;
    };
    gearVoucher: {
      /**
       * Execute prepaid call with given voucher id.
       *
       * Arguments:
       * * voucher_id: associated with origin existing vouchers id,
       * that should be used to pay for fees and gas
       * within the call;
       * * call:       prepaid call that is requested to execute.
       **/
      call: AugmentedSubmittable<
        (
          voucherId: PalletGearVoucherInternalVoucherId | string | Uint8Array,
          call:
            | PalletGearVoucherInternalPrepaidCall
            | { SendMessage: any }
            | { SendReply: any }
            | { UploadCode: any }
            | { DeclineVoucher: any }
            | string
            | Uint8Array,
        ) => SubmittableExtrinsic<ApiType>,
        [PalletGearVoucherInternalVoucherId, PalletGearVoucherInternalPrepaidCall]
      >;
      /**
       * Decline existing and not expired voucher.
       *
       * This extrinsic expires voucher of the caller, if it's still active,
       * allowing it to be revoked.
       *
       * Arguments:
       * * voucher_id:   voucher id to be declined.
       **/
      decline: AugmentedSubmittable<
        (voucherId: PalletGearVoucherInternalVoucherId | string | Uint8Array) => SubmittableExtrinsic<ApiType>,
        [PalletGearVoucherInternalVoucherId]
      >;
      /**
       * Issue a new voucher.
       *
       * Deposits event `VoucherIssued`, that contains `VoucherId` to be
       * used by spender for balance-less on-chain interactions.
       *
       * Arguments:
       * * spender:  user id that is eligible to use the voucher;
       * * balance:  voucher balance could be used for transactions
       * fees and gas;
       * * programs: pool of programs spender can interact with,
       * if None - means any program,
       * limited by Config param;
       * * code_uploading:
       * allow voucher to be used as payer for `upload_code`
       * transactions fee;
       * * duration: amount of blocks voucher could be used by spender
       * and couldn't be revoked by owner.
       * Must be out in [MinDuration; MaxDuration] constants.
       * Expiration block of the voucher calculates as:
       * current bn (extrinsic exec bn) + duration + 1.
       **/
      issue: AugmentedSubmittable<
        (
          spender: AccountId32 | string | Uint8Array,
          balance: u128 | AnyNumber | Uint8Array,
          programs: Option<BTreeSet<GprimitivesActorId>> | null | Uint8Array | BTreeSet<GprimitivesActorId> | string[],
          codeUploading: bool | boolean | Uint8Array,
          duration: u32 | AnyNumber | Uint8Array,
        ) => SubmittableExtrinsic<ApiType>,
        [AccountId32, u128, Option<BTreeSet<GprimitivesActorId>>, bool, u32]
      >;
      /**
       * Revoke existing voucher.
       *
       * This extrinsic revokes existing voucher, if current block is greater
       * than expiration block of the voucher (it is no longer valid).
       *
       * Currently it means sending of all balance from voucher account to
       * voucher owner without voucher removal from storage map, but this
       * behavior may change in future, as well as the origin validation:
       * only owner is able to revoke voucher now.
       *
       * Arguments:
       * * spender:    account id of the voucher spender;
       * * voucher_id: voucher id to be revoked.
       **/
      revoke: AugmentedSubmittable<
        (
          spender: AccountId32 | string | Uint8Array,
          voucherId: PalletGearVoucherInternalVoucherId | string | Uint8Array,
        ) => SubmittableExtrinsic<ApiType>,
        [AccountId32, PalletGearVoucherInternalVoucherId]
      >;
      /**
       * Update existing voucher.
       *
       * This extrinsic updates existing voucher: it can only extend vouchers
       * rights in terms of balance, validity or programs to interact pool.
       *
       * Can only be called by the voucher owner.
       *
       * Arguments:
       * * spender:          account id of the voucher spender;
       * * voucher_id:       voucher id to be updated;
       * * move_ownership:   optionally moves ownership to another account;
       * * balance_top_up:   optionally top ups balance of the voucher from
       * origins balance;
       * * append_programs:  optionally extends pool of programs by
       * `Some(programs_set)` passed or allows
       * it to interact with any program by
       * `None` passed;
       * * code_uploading:   optionally allows voucher to be used to pay
       * fees for `upload_code` extrinsics;
       * * prolong_duration: optionally increases expiry block number.
       * If voucher is expired, prolongs since current bn.
       * Validity prolongation (since current block number
       * for expired or since storage written expiry)
       * should be in [MinDuration; MaxDuration], in other
       * words voucher couldn't have expiry greater than
       * current block number + MaxDuration.
       **/
      update: AugmentedSubmittable<
        (
          spender: AccountId32 | string | Uint8Array,
          voucherId: PalletGearVoucherInternalVoucherId | string | Uint8Array,
          moveOwnership: Option<AccountId32> | null | Uint8Array | AccountId32 | string,
          balanceTopUp: Option<u128> | null | Uint8Array | u128 | AnyNumber,
          appendPrograms:
            | Option<Option<BTreeSet<GprimitivesActorId>>>
            | null
            | Uint8Array
            | Option<BTreeSet<GprimitivesActorId>>
            | BTreeSet<GprimitivesActorId>
            | (string | Uint8Array)[],
          codeUploading: Option<bool> | null | Uint8Array | bool | boolean,
          prolongDuration: Option<u32> | null | Uint8Array | u32 | AnyNumber,
        ) => SubmittableExtrinsic<ApiType>,
        [
          AccountId32,
          PalletGearVoucherInternalVoucherId,
          Option<AccountId32>,
          Option<u128>,
          Option<Option<BTreeSet<GprimitivesActorId>>>,
          Option<bool>,
          Option<u32>,
        ]
      >;
      /**
       * Generic tx
       **/
      [key: string]: SubmittableExtrinsicFunction<ApiType>;
    };
  } // AugmentedSubmittables
} // declare module
