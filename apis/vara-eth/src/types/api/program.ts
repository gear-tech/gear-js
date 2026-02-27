import type { Address, Hash, Hex } from 'viem';

import type { ReplyCode } from '../../errors/index.js';
import { Dispatch, MessageId } from './message.js';
import { Expiring } from './common.js';

export interface ReplyInfo {
  readonly payload: Hex;
  readonly value: number;
  readonly code: ReplyCode;
}

export interface ProgramState {
  readonly program: Program;
  readonly queueHash: MaybeHash;
  readonly waitlistHash: MaybeHash;
  readonly mailboxHash: MaybeHash;
  readonly balance: number;
  readonly executableBalance: number;
}

export type Program = ActiveProgram | ExitedProgram | TerminatedProgram;

interface ActiveProgram {
  readonly Active: {
    readonly allocationsHash: MaybeHash;
    readonly pagesHash: MaybeHash;
    readonly memoryInfix: number;
    readonly initialized: boolean;
  };
}

interface ExitedProgram {
  readonly Exited: string;
}

interface TerminatedProgram {
  readonly Terminated: string;
}

export type MaybeHash = { readonly hash: string; readonly len: number } | null;

export interface Waitlist {
  readonly inner: Record<MessageId, Expiring<Dispatch>>;
  readonly changed: boolean;
}

export type DispatchStash = Record<MessageId, Expiring<[Dispatch, Address | null]>>;

export interface Mailbox {
  readonly inner: Record<Address, Hash>;
  readonly changed: boolean;
}

export interface FullProgramState {
  readonly program: Program;
  readonly canonicalQueue: Array<Dispatch>;
  readonly injectedQueue: Array<Dispatch>;
  readonly waitlist: Waitlist | null;
  readonly stash: DispatchStash | null;
  readonly mailbox: Mailbox | null;
  readonly balance: bigint;
  readonly executableBalance: bigint;
}
