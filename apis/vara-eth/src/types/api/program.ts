import { ReplyCode } from '../../errors/index.js';
import { HexString } from '../../types/index.js';

export interface ReplyInfo {
  readonly payload: HexString;
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
