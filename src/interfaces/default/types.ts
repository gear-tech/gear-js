// Auto-generated via `yarn polkadot-types-from-defs`, do not edit
/* eslint-disable */

import type { Bytes, Enum, Option, Struct, u128, u64 } from '@polkadot/types';
import type { H256 } from '@polkadot/types/interfaces/runtime';

// /** @name IntermediateMessage */
// export interface IntermediateMessage extends Enum {
//   readonly isInitProgram: boolean;
//   readonly asInitProgram: {
//     readonly external_origin: H256;
//     readonly program_id: H256;
//     readonly code: Bytes;
//     readonly payload: Bytes;
//     readonly gas_limit: u64;
//     readonly value: u128;
//   } & Struct;
//   readonly isDispatchMessage: boolean;
//   readonly asDispatchMessage: {
//     readonly id: H256;
//     readonly route: MessageRoute;
//     readonly payload: Bytes;
//     readonly gas_limit: u64;
//     readonly value: u128;
//   } & Struct;
// }

/** @name Message */
export interface Message extends Struct {
  readonly id: H256;
  readonly source: H256;
  readonly dest: H256;
  readonly payload: Bytes;
  readonly gas_limit: u64;
  readonly value: u128;
  readonly reply: Option<H256>;
}

/** @name MessageError */
export interface MessageError extends Enum {
  readonly isValueTransfer: boolean;
  readonly isDispatch: boolean;
}

/** @name Node */
export interface Node extends Struct {
  readonly value: Message;
  readonly next: Option<H256>;
}

export type PHANTOM_DEFAULT = 'default';
