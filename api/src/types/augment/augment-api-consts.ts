import '@polkadot/api-base/types/consts';

import { GearCommonGasMultiplier, PalletGearSchedule } from '../lookup';
import type { Option, bool, u128, u32, u64, u8 } from '@polkadot/types-codec';
import type { AccountId32 } from '@polkadot/types/interfaces/runtime';
import type { ApiTypes } from '@polkadot/api-base/types';
import type { Codec } from '@polkadot/types-codec/types';
import { FrameSupportPalletId } from '@polkadot/types/lookup';

declare module '@polkadot/api-base/types/consts' {
  interface AugmentedConsts<ApiType extends ApiTypes> {
    gear: {
      /**
       * The minimal gas amount for message to be inserted in mailbox.
       *
       * This gas will be consuming as rent for storing and message will be available
       * for reply or claim, once gas ends, message removes.
       *
       * Messages with gas limit less than that minimum will not be added in mailbox,
       * but will be seen in events.
       **/
      mailboxThreshold: u64 & AugmentedConst<ApiType>;
      /**
       * The maximum amount of bytes in outgoing messages during message execution.
       **/
      outgoingBytesLimit: u32 & AugmentedConst<ApiType>;
      /**
       * The maximum amount of messages that can be produced in during all message executions.
       **/
      outgoingLimit: u32 & AugmentedConst<ApiType>;
      /**
       * Performance multiplier.
       **/
      performanceMultiplier: u32 & AugmentedConst<ApiType>;
      /**
       * The program rent cost per block.
       **/
      programRentCostPerBlock: u128 & AugmentedConst<ApiType>;
      /**
       * The constant defines value that is added if the program
       * rent is disabled.
       **/
      programRentDisabledDelta: u32 & AugmentedConst<ApiType>;
      /**
       * The flag determines if program rent mechanism enabled.
       **/
      programRentEnabled: bool & AugmentedConst<ApiType>;
      /**
       * The free of charge period of rent.
       **/
      programRentFreePeriod: u32 & AugmentedConst<ApiType>;
      /**
       * The minimal amount of blocks to resume.
       **/
      programResumeMinimalRentPeriod: u32 & AugmentedConst<ApiType>;
      /**
       * The amount of blocks for processing resume session.
       **/
      programResumeSessionDuration: u32 & AugmentedConst<ApiType>;
      /**
       * The account id of the rent pool if any.
       **/
      rentPoolId: Option<AccountId32> & AugmentedConst<ApiType>;
      /**
       * Amount of reservations can exist for 1 program.
       **/
      reservationsLimit: u64 & AugmentedConst<ApiType>;
      /**
       * Cost schedule and limits.
       **/
      schedule: PalletGearSchedule & AugmentedConst<ApiType>;
      /**
       * Generic const
       **/
      [key: string]: Codec;
    };
    gearBank: {
      /**
       * Bank account address, that will keep all reserved funds.
       **/
      bankAddress: AccountId32 & AugmentedConst<ApiType>;
      /**
       * Gas price converter.
       **/
      gasMultiplier: GearCommonGasMultiplier & AugmentedConst<ApiType>;
      /**
       * Generic const
       **/
      [key: string]: Codec;
    };
    gearEthBridge: {
      /**
       * Constant defining maximal payload size in bytes of message for bridging.
       **/
      maxPayloadSize: u32 & AugmentedConst<ApiType>;
      /**
       * Constant defining maximal amount of messages that are able to be
       * bridged within the single staking era.
       **/
      queueCapacity: u32 & AugmentedConst<ApiType>;
      /**
       * Constant defining amount of sessions in manager for keys rotation.
       * Similar to `pallet_staking::SessionsPerEra`.
       **/
      sessionsPerEra: u32 & AugmentedConst<ApiType>;
      /**
       * Generic const
       **/
      [key: string]: Codec;
    };
    gearGas: {
      /**
       * The maximum amount of gas that can be used within a single block.
       **/
      blockGasLimit: u64 & AugmentedConst<ApiType>;
      /**
       * Generic const
       **/
      [key: string]: Codec;
    };
    gearScheduler: {
      /**
       * Cost for reservation holding.
       **/
      dispatchHoldCost: u64 & AugmentedConst<ApiType>;
      /**
       * Cost for storing in mailbox per block.
       **/
      mailboxCost: u64 & AugmentedConst<ApiType>;
      /**
       * Cost for reservation holding.
       **/
      reservationCost: u64 & AugmentedConst<ApiType>;
      /**
       * Amount of blocks for extra delay used to secure from outdated tasks.
       **/
      reserveThreshold: u32 & AugmentedConst<ApiType>;
      /**
       * Cost for storing in waitlist per block.
       **/
      waitlistCost: u64 & AugmentedConst<ApiType>;
      /**
       * Generic const
       **/
      [key: string]: Codec;
    };
    gearVoucher: {
      /**
       * Maximal duration in blocks voucher could be issued/prolonged for.
       **/
      maxDuration: u32 & AugmentedConst<ApiType>;
      /**
       * Maximal amount of programs to be specified to interact with.
       **/
      maxProgramsAmount: u8 & AugmentedConst<ApiType>;
      /**
       * Minimal duration in blocks voucher could be issued/prolonged for.
       **/
      minDuration: u32 & AugmentedConst<ApiType>;
      /**
       * The pallet id, used for deriving its sovereign account ID.
       **/
      palletId: FrameSupportPalletId & AugmentedConst<ApiType>;
      /**
       * Generic const
       **/
      [key: string]: Codec;
    };
  }
}
