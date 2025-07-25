import '@polkadot/api-base/types/errors';

import type { ApiTypes } from '@polkadot/api-base/types';

declare module '@polkadot/api-base/types/errors' {
  interface AugmentedErrors<ApiType extends ApiTypes> {
    gear: {
      /**
       * Program is active.
       **/
      ActiveProgram: AugmentedError<ApiType>;
      /**
       * Code already exists.
       *
       * Occurs when trying to save to storage a program code that has been saved there.
       **/
      CodeAlreadyExists: AugmentedError<ApiType>;
      /**
       * Code does not exist.
       *
       * Occurs when trying to get a program code from storage, that doesn't exist.
       **/
      CodeDoesntExist: AugmentedError<ApiType>;
      /**
       * The code supplied to `upload_code` or `upload_program` exceeds the limit specified in the
       * current schedule.
       **/
      CodeTooLarge: AugmentedError<ApiType>;
      /**
       * Gas limit too high.
       *
       * Occurs when an extrinsic's declared `gas_limit` is greater than a block's maximum gas limit.
       **/
      GasLimitTooHigh: AugmentedError<ApiType>;
      /**
       * Gear::run() already included in current block.
       **/
      GearRunAlreadyInBlock: AugmentedError<ApiType>;
      /**
       * Program is terminated.
       *
       * Program init failed, so such message destination is no longer unavailable.
       **/
      InactiveProgram: AugmentedError<ApiType>;
      /**
       * Not enough balance to execute an action.
       *
       * Usually occurs when the gas_limit specified is such that the origin account can't afford the message.
       **/
      InsufficientBalance: AugmentedError<ApiType>;
      /**
       * Message wasn't found in the mailbox.
       **/
      MessageNotFound: AugmentedError<ApiType>;
      /**
       * Message queue processing is disabled.
       **/
      MessageQueueProcessingDisabled: AugmentedError<ApiType>;
      /**
       * Message gas tree is not found.
       *
       * When a message claimed from the mailbox has a corrupted or non-extant gas tree associated.
       **/
      NoMessageTree: AugmentedError<ApiType>;
      /**
       * Program already exists.
       *
       * Occurs if a program with some specific program id already exists in program storage.
       **/
      ProgramAlreadyExists: AugmentedError<ApiType>;
      /**
       * Failed to create a program.
       **/
      ProgramConstructionFailed: AugmentedError<ApiType>;
      /**
       * Program with the specified id is not found.
       **/
      ProgramNotFound: AugmentedError<ApiType>;
      /**
       * The program rent logic is disabled.
       **/
      ProgramRentDisabled: AugmentedError<ApiType>;
      /**
       * Block count doesn't cover MinimalResumePeriod.
       **/
      ResumePeriodLessThanMinimal: AugmentedError<ApiType>;
      /**
       * Generic error
       **/
      [key: string]: AugmentedError<ApiType>;
    };
    gearBank: {
      /**
       * Insufficient user balance.
       **/
      InsufficientBalance: AugmentedError<ApiType>;
      /**
       * Insufficient bank account balance.
       * **Must be unreachable in Gear main protocol.**
       **/
      InsufficientBankBalance: AugmentedError<ApiType>;
      /**
       * Deposit of funds that will not keep bank account alive.
       * **Must be unreachable in Gear main protocol.**
       **/
      InsufficientDeposit: AugmentedError<ApiType>;
      /**
       * Insufficient user's bank account gas balance.
       **/
      InsufficientGasBalance: AugmentedError<ApiType>;
      /**
       * Insufficient user's bank account gas balance.
       **/
      InsufficientValueBalance: AugmentedError<ApiType>;
      /**
       * Overflow during funds transfer.
       * **Must be unreachable in Gear main protocol.**
       **/
      Overflow: AugmentedError<ApiType>;
      /**
       * Generic error
       **/
      [key: string]: AugmentedError<ApiType>;
    };
    gearDebug: {
      /**
       * Generic error
       **/
      [key: string]: AugmentedError<ApiType>;
    };
    gearEthBridge: {
      /**
       * The error happens when bridge got called before
       * proper initialization after deployment.
       **/
      BridgeIsNotYetInitialized: AugmentedError<ApiType>;
      /**
       * The error happens when bridge got called when paused.
       **/
      BridgeIsPaused: AugmentedError<ApiType>;
      /**
       * The error happens when bridging thorough builtin and message value
       * is inapplicable to operation or insufficient.
       **/
      IncorrectValueApplied: AugmentedError<ApiType>;
      /**
       * The error happens when bridging message sent with too big payload.
       **/
      MaxPayloadSizeExceeded: AugmentedError<ApiType>;
      /**
       * The error happens when bridging queue capacity exceeded,
       * so message couldn't be sent.
       **/
      QueueCapacityExceeded: AugmentedError<ApiType>;
      /**
       * Generic error
       **/
      [key: string]: AugmentedError<ApiType>;
    };
    gearGas: {
      /**
       * `GasTree::consume` called on node, which has some balance locked.
       **/
      ConsumedWithLock: AugmentedError<ApiType>;
      /**
       * `GasTree::consume` called on node, which has some system reservation.
       **/
      ConsumedWithSystemReservation: AugmentedError<ApiType>;
      Forbidden: AugmentedError<ApiType>;
      InsufficientBalance: AugmentedError<ApiType>;
      NodeAlreadyExists: AugmentedError<ApiType>;
      NodeNotFound: AugmentedError<ApiType>;
      NodeWasConsumed: AugmentedError<ApiType>;
      ParentHasNoChildren: AugmentedError<ApiType>;
      /**
       * Errors stating that gas tree has been invalidated
       **/
      ParentIsLost: AugmentedError<ApiType>;
      /**
       * `GasTree::create` called with some value amount leading to
       * the total value overflow.
       **/
      TotalValueIsOverflowed: AugmentedError<ApiType>;
      /**
       * Either `GasTree::consume` or `GasTree::spent` called on a node creating
       * negative imbalance which leads to the total value drop below 0.
       **/
      TotalValueIsUnderflowed: AugmentedError<ApiType>;
      /**
       * Output of `Tree::consume` procedure that wasn't expected.
       *
       * Outputs of consumption procedure are determined. The error is returned
       * when unexpected one occurred. That signals, that algorithm works wrong
       * and expected invariants are not correct.
       **/
      UnexpectedConsumeOutput: AugmentedError<ApiType>;
      /**
       * Node type that can't occur if algorithm work well
       **/
      UnexpectedNodeType: AugmentedError<ApiType>;
      /**
       * Value must have been caught or moved upstream, but was blocked (for more info see `ValueNode::catch_value`).
       **/
      ValueIsBlocked: AugmentedError<ApiType>;
      /**
       * Value must have been blocked, but was either moved or caught (for more info see `ValueNode::catch_value`).
       **/
      ValueIsNotBlocked: AugmentedError<ApiType>;
      /**
       * Value must have been caught, but was missed or blocked (for more info see `ValueNode::catch_value`).
       **/
      ValueIsNotCaught: AugmentedError<ApiType>;
      /**
       * Generic error
       **/
      [key: string]: AugmentedError<ApiType>;
    };
    gearMessenger: {
      /**
       * Occurs when given value already exists in mailbox.
       **/
      MailboxDuplicateKey: AugmentedError<ApiType>;
      /**
       * Occurs when mailbox's element wasn't found in storage.
       **/
      MailboxElementNotFound: AugmentedError<ApiType>;
      /**
       * Occurs when given key already exists in queue.
       **/
      QueueDuplicateKey: AugmentedError<ApiType>;
      /**
       * Occurs when queue's element wasn't found in storage.
       **/
      QueueElementNotFound: AugmentedError<ApiType>;
      /**
       * Occurs when queue's head should contain value,
       * but it's empty for some reason.
       **/
      QueueHeadShouldBeSet: AugmentedError<ApiType>;
      /**
       * Occurs when queue's head should be empty,
       * but it contains value for some reason.
       **/
      QueueHeadShouldNotBeSet: AugmentedError<ApiType>;
      /**
       * Occurs when queue's tail element contains link
       * to the next element.
       **/
      QueueTailHasNextKey: AugmentedError<ApiType>;
      /**
       * Occurs when while searching queue's pre-tail,
       * element wasn't found.
       **/
      QueueTailParentNotFound: AugmentedError<ApiType>;
      /**
       * Occurs when queue's tail should contain value,
       * but it's empty for some reason.
       **/
      QueueTailShouldBeSet: AugmentedError<ApiType>;
      /**
       * Occurs when queue's tail should be empty,
       * but it contains value for some reason.
       **/
      QueueTailShouldNotBeSet: AugmentedError<ApiType>;
      /**
       * Occurs when given value already exists in waitlist.
       **/
      WaitlistDuplicateKey: AugmentedError<ApiType>;
      /**
       * Occurs when waitlist's element wasn't found in storage.
       **/
      WaitlistElementNotFound: AugmentedError<ApiType>;
      /**
       * Generic error
       **/
      [key: string]: AugmentedError<ApiType>;
    };
    gearProgram: {
      CannotFindDataForPage: AugmentedError<ApiType>;
      DuplicateItem: AugmentedError<ApiType>;
      NotActiveProgram: AugmentedError<ApiType>;
      ProgramCodeNotFound: AugmentedError<ApiType>;
      ProgramNotFound: AugmentedError<ApiType>;
      /**
       * Generic error
       **/
      [key: string]: AugmentedError<ApiType>;
    };
    gearScheduler: {
      /**
       * Occurs when given task already exists in task pool.
       **/
      DuplicateTask: AugmentedError<ApiType>;
      /**
       * Occurs when task wasn't found in storage.
       **/
      TaskNotFound: AugmentedError<ApiType>;
      /**
       * Generic error
       **/
      [key: string]: AugmentedError<ApiType>;
    };
    gearVoucher: {
      /**
       * The origin is not eligible to execute call.
       **/
      BadOrigin: AugmentedError<ApiType>;
      /**
       * Error trying transfer balance to/from voucher account.
       **/
      BalanceTransfer: AugmentedError<ApiType>;
      /**
       * Voucher is disabled for code uploading, but requested.
       **/
      CodeUploadingDisabled: AugmentedError<ApiType>;
      /**
       * Voucher update function tries to cut voucher ability of code upload.
       **/
      CodeUploadingEnabled: AugmentedError<ApiType>;
      /**
       * Voucher issue/prolongation duration out of [min; max] constants.
       **/
      DurationOutOfBounds: AugmentedError<ApiType>;
      /**
       * Destination program is not in whitelisted set for voucher.
       **/
      InappropriateDestination: AugmentedError<ApiType>;
      /**
       * Voucher with given identifier doesn't exist for given spender id.
       **/
      InexistentVoucher: AugmentedError<ApiType>;
      /**
       * Voucher still valid and couldn't be revoked.
       **/
      IrrevocableYet: AugmentedError<ApiType>;
      /**
       * Try to whitelist more programs than allowed.
       **/
      MaxProgramsLimitExceeded: AugmentedError<ApiType>;
      /**
       * Failed to query destination of the prepaid call.
       **/
      UnknownDestination: AugmentedError<ApiType>;
      /**
       * Voucher has expired and couldn't be used.
       **/
      VoucherExpired: AugmentedError<ApiType>;
      /**
       * Generic error
       **/
      [key: string]: AugmentedError<ApiType>;
    };
  }
}
