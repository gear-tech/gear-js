import type { Address, Hash, Hex } from 'viem';

import type { ReplyCode } from '../../errors/index.js';
import type { Dispatch, MessageId } from './message.js';
import type { Expiring } from './common.js';

export interface ReplyInfo {
  readonly payload: Hex;
  readonly value: number;
  readonly code: ReplyCode;
}

export interface ProgramState {
  readonly program: Program;
  readonly queueHash: MaybeHash;
  readonly waitlistHash: MaybeHash;
  readonly stashHash: MaybeHash;
  readonly mailboxHash: MaybeHash;
  readonly balance: bigint;
  readonly executableBalance: bigint;
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

export type MaybeHash = Hash | null;

export type MessageQueue = Dispatch[];

export interface Waitlist {
  readonly inner: Record<MessageId, Expiring<Dispatch>>;
  readonly changed: boolean;
}

export type DispatchStash = Record<MessageId, Expiring<[Dispatch, Address | null]>>;

export interface Mailbox {
  readonly inner: Record<Address, Hash>;
  readonly changed: boolean;
}

export type MemoryPages = (Hex | null)[];

export interface FullProgramState {
  readonly program: Program;
  readonly canonicalQueue: MessageQueue | null;
  readonly injectedQueue: MessageQueue | null;
  readonly waitlist: Waitlist | null;
  readonly stash: DispatchStash | null;
  readonly mailbox: Mailbox | null;
  readonly balance: bigint;
  readonly executableBalance: bigint;
}
