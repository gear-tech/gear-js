import '@polkadot/api-base/types/submittable';

import type { AnyNumber, Codec, ITuple } from '@polkadot/types-codec/types';
import type { ApiTypes, AugmentedSubmittable } from '@polkadot/api-base/types';
import type { BTreeSet, Bytes, Option, Vec, bool, u128, u32, u64 } from '@polkadot/types-codec';
import {
  GearCoreIdsCodeId,
  GearCoreIdsMessageId,
  GearCoreIdsProgramId,
  PalletGearVoucherInternalPrepaidCall,
  PalletGearVoucherInternalVoucherId,
} from '../lookup';
import type { AccountId32 } from '@polkadot/types/interfaces/runtime';

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
        (messageId: GearCoreIdsMessageId | string | Uint8Array) => SubmittableExtrinsic<ApiType>,
        [GearCoreIdsMessageId]
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
          codeId: GearCoreIdsCodeId | string | Uint8Array,
          salt: Bytes | string | Uint8Array,
          initPayload: Bytes | string | Uint8Array,
          gasLimit: u64 | AnyNumber | Uint8Array,
          value: u128 | AnyNumber | Uint8Array,
          keepAlive: bool | boolean | Uint8Array,
        ) => SubmittableExtrinsic<ApiType>,
        [GearCoreIdsCodeId, Bytes, Bytes, u64, u128, bool]
      >;
      /**
       * Pay additional rent for the program.
       **/
      payProgramRent: AugmentedSubmittable<
        (
          programId: GearCoreIdsProgramId | string | Uint8Array,
          blockCount: u32 | AnyNumber | Uint8Array,
        ) => SubmittableExtrinsic<ApiType>,
        [GearCoreIdsProgramId, u32]
      >;
      /**
       * Finishes the program resume session.
       *
       * The origin must be Signed and should be the owner of the session.
       *
       * Parameters:
       * - `session_id`: id of the resume session.
       * - `block_count`: the specified period of rent.
       **/
      resumeSessionCommit: AugmentedSubmittable<
        (
          sessionId: u32 | AnyNumber | Uint8Array,
          blockCount: u32 | AnyNumber | Uint8Array,
        ) => SubmittableExtrinsic<ApiType>,
        [u32, u32]
      >;
      /**
       * Starts a resume session of the previously paused program.
       *
       * The origin must be Signed.
       *
       * Parameters:
       * - `program_id`: id of the program to resume.
       * - `allocations`: memory allocations of program prior to stop.
       * - `code_hash`: id of the program binary code.
       **/
      resumeSessionInit: AugmentedSubmittable<
        (
          programId: GearCoreIdsProgramId | string | Uint8Array,
          allocations: BTreeSet<u32> | number[],
          codeHash: GearCoreIdsCodeId | string | Uint8Array,
        ) => SubmittableExtrinsic<ApiType>,
        [GearCoreIdsProgramId, BTreeSet<u32>, GearCoreIdsCodeId]
      >;
      /**
       * Appends memory pages to the resume session.
       *
       * The origin must be Signed and should be the owner of the session.
       *
       * Parameters:
       * - `session_id`: id of the resume session.
       * - `memory_pages`: program memory (or its part) before it was paused.
       **/
      resumeSessionPush: AugmentedSubmittable<
        (
          sessionId: u128 | AnyNumber | Uint8Array,
          memoryPages:
            | Vec<ITuple<[u32, Bytes]>>
            | [u32 | AnyNumber | Uint8Array, Bytes | string | Uint8Array][]
            | string,
        ) => SubmittableExtrinsic<ApiType>,
        [u32, Vec<ITuple<[u32, Bytes]>>]
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
          destination: GearCoreIdsProgramId | string | Uint8Array,
          payload: Bytes | string | Uint8Array,
          gasLimit: u64 | AnyNumber | Uint8Array,
          value: u128 | AnyNumber | Uint8Array,
          keepAlive: bool | boolean | Uint8Array,
        ) => SubmittableExtrinsic<ApiType>,
        [GearCoreIdsProgramId, Bytes, u64, u128, bool]
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
          replyToId: GearCoreIdsMessageId | string | Uint8Array,
          payload: Bytes | string | Uint8Array,
          gasLimit: u64 | AnyNumber | Uint8Array,
          value: u128 | AnyNumber | Uint8Array,
          keepAlive: bool | boolean | Uint8Array,
        ) => SubmittableExtrinsic<ApiType>,
        [GearCoreIdsMessageId, Bytes, u64, u128, bool]
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
       * `ProgramId` is computed as Blake256 hash of concatenated bytes of `code` + `salt`. (todo #512 `code_hash` + `salt`)
       * Such `ProgramId` must not exist in the Program Storage at the time of this call.
       *
       * There is the same guarantee here as in `upload_code`. That is, future program's
       * `code` and metadata are stored before message was added to the queue and processed.
       *
       * The origin must be Signed and the sender must have sufficient funds to pay
       * for `gas` and `value` (in case the latter is being transferred).
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
    gearVoucher: {
      call: AugmentedSubmittable<
        (
          voucherId: PalletGearVoucherInternalVoucherId | string | Uint8Array,
          call:
            | PalletGearVoucherInternalPrepaidCall
            | {
                SendMessage: {
                  destination: string | Codec;
                  payload: string | Uint8Array | Codec;
                  gasLimit: number | bigint | Uint8Array | Codec;
                  value: number | bigint | Uint8Array | Codec;
                  keepAlive: boolean | Uint8Array | Codec;
                };
              }
            | {
                SendReply: {
                  replyToId: string | Codec;
                  payload: string | Uint8Array | Codec;
                  gasLimit: number | bigint | Uint8Array | Codec;
                  value: number | bigint | Uint8Array | Codec;
                  keepAlive: boolean | Uint8Array | Codec;
                };
              }
            | {
                UploadCode: {
                  code: string | Uint8Array | Codec;
                };
              }
            | { DeclineVoucher: null }
            | string
            | Uint8Array,
        ) => SubmittableExtrinsic<ApiType>,
        [PalletGearVoucherInternalVoucherId, PalletGearVoucherInternalPrepaidCall]
      >;
      /**
       * Dispatch allowed with voucher call.
       **/
      callDeprecated: AugmentedSubmittable<
        (
          call: PalletGearVoucherInternalPrepaidCall | { SendMessage: any } | { SendReply: any } | string | Uint8Array,
        ) => SubmittableExtrinsic<ApiType>,
        [PalletGearVoucherInternalPrepaidCall]
      >;
      decline: AugmentedSubmittable<
        (voucherId: PalletGearVoucherInternalVoucherId | string | Uint8Array) => SubmittableExtrinsic<ApiType>,
        [PalletGearVoucherInternalVoucherId]
      >;
      issue: AugmentedSubmittable<
        (
          spender: AccountId32 | string | Uint8Array,
          balance: u128 | AnyNumber | Uint8Array,
          programs:
            | Option<BTreeSet<GearCoreIdsProgramId>>
            | null
            | Uint8Array
            | BTreeSet<GearCoreIdsProgramId>
            | string[],
          codeUploading: bool | boolean | Uint8Array,
          duration: u32 | AnyNumber | Uint8Array,
        ) => SubmittableExtrinsic<ApiType>,
        [AccountId32, u128, Option<BTreeSet<GearCoreIdsProgramId>>, bool, u32]
      >;
      revoke: AugmentedSubmittable<
        (
          spender: AccountId32 | string | Uint8Array,
          voucherId: PalletGearVoucherInternalVoucherId | string | Uint8Array,
        ) => SubmittableExtrinsic<ApiType>,
        [AccountId32, PalletGearVoucherInternalVoucherId]
      >;
      update: AugmentedSubmittable<
        (
          spender: AccountId32 | string | Uint8Array,
          voucherId: PalletGearVoucherInternalVoucherId | string | Uint8Array,
          moveOwnership: Option<AccountId32> | null | Uint8Array | AccountId32 | string,
          balanceTopUp: Option<u128> | null | Uint8Array | u128 | AnyNumber,
          appendPrograms:
            | Option<Option<BTreeSet<GearCoreIdsProgramId>>>
            | null
            | Uint8Array
            | Option<BTreeSet<GearCoreIdsProgramId>>
            | BTreeSet<GearCoreIdsProgramId>
            | (string | Uint8Array)[],
          codeUploading: Option<bool> | null | Uint8Array | bool | boolean,
          prolongDuration: Option<u32> | null | Uint8Array | u32 | AnyNumber,
        ) => SubmittableExtrinsic<ApiType>,
        [
          AccountId32,
          PalletGearVoucherInternalVoucherId,
          Option<AccountId32>,
          Option<u128>,
          Option<Option<BTreeSet<GearCoreIdsProgramId>>>,
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
