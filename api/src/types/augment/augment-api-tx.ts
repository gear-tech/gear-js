import '@polkadot/api-base/types/submittable';

import type { AccountId32, H160, Percent } from '@polkadot/types/interfaces/runtime';
import type { BTreeSet, Bytes, Option, bool, u128, u32, u64 } from '@polkadot/types-codec';
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
       * See [`Pallet::claim_value`].
       **/
      claimValue: AugmentedSubmittable<
        (messageId: GprimitivesMessageId | string | Uint8Array) => SubmittableExtrinsic<ApiType>,
        [GprimitivesMessageId]
      >;
      /**
       * See [`Pallet::create_program`].
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
       * See [`Pallet::run`].
       **/
      run: AugmentedSubmittable<
        (maxGas: Option<u64> | null | Uint8Array | u64 | AnyNumber) => SubmittableExtrinsic<ApiType>,
        [Option<u64>]
      >;
      /**
       * See [`Pallet::send_message`].
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
       * See [`Pallet::send_reply`].
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
       * See [`Pallet::set_execute_inherent`].
       **/
      setExecuteInherent: AugmentedSubmittable<
        (value: bool | boolean | Uint8Array) => SubmittableExtrinsic<ApiType>,
        [bool]
      >;
      /**
       * See [`Pallet::upload_code`].
       **/
      uploadCode: AugmentedSubmittable<(code: Bytes | string | Uint8Array) => SubmittableExtrinsic<ApiType>, [Bytes]>;
      /**
       * See [`Pallet::upload_program`].
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
       * See [`Pallet::enable_debug_mode`].
       **/
      enableDebugMode: AugmentedSubmittable<
        (debugModeOn: bool | boolean | Uint8Array) => SubmittableExtrinsic<ApiType>,
        [bool]
      >;
      /**
       * See [`Pallet::exhaust_block_resources`].
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
       * See [`Pallet::pause`].
       **/
      pause: AugmentedSubmittable<() => SubmittableExtrinsic<ApiType>, []>;
      /**
       * See [`Pallet::send_eth_message`].
       **/
      sendEthMessage: AugmentedSubmittable<
        (destination: H160, payload: Bytes | string | Uint8Array) => SubmittableExtrinsic<ApiType>,
        [H160, Bytes]
      >;
      /**
       * Generic tx
       **/
      [key: string]: SubmittableExtrinsicFunction<ApiType>;
    };
    gearVoucher: {
      /**
       * See [`Pallet::call`].
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
       * See [`Pallet::call_deprecated`].
       **/
      callDeprecated: AugmentedSubmittable<
        (
          call:
            | PalletGearVoucherInternalPrepaidCall
            | { SendMessage: any }
            | { SendReply: any }
            | { UploadCode: any }
            | { DeclineVoucher: any }
            | string
            | Uint8Array,
        ) => SubmittableExtrinsic<ApiType>,
        [PalletGearVoucherInternalPrepaidCall]
      >;
      /**
       * See [`Pallet::decline`].
       **/
      decline: AugmentedSubmittable<
        (voucherId: PalletGearVoucherInternalVoucherId | string | Uint8Array) => SubmittableExtrinsic<ApiType>,
        [PalletGearVoucherInternalVoucherId]
      >;
      /**
       * See [`Pallet::issue`].
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
       * See [`Pallet::revoke`].
       **/
      revoke: AugmentedSubmittable<
        (
          spender: AccountId32 | string | Uint8Array,
          voucherId: PalletGearVoucherInternalVoucherId | string | Uint8Array,
        ) => SubmittableExtrinsic<ApiType>,
        [AccountId32, PalletGearVoucherInternalVoucherId]
      >;
      /**
       * See [`Pallet::update`].
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
