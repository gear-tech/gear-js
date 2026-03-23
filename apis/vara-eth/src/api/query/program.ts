import { Hex } from 'viem';
import {
  DispatchStash,
  FullProgramState,
  IVaraEthProvider,
  Mailbox,
  MemoryPages,
  MessageQueue,
  ProgramState,
  Waitlist,
} from '../../types/index.js';
import { transformMaybeHashes } from '../../util/maybe-hash.js';
import { normalizeDispatch } from '../../util/normalize.js';

function normalizeProgramBalances(state: any): void {
  state.balance = BigInt(state.balance);
  state.executableBalance = BigInt(state.executableBalance);
}

export class ProgramQueries {
  constructor(private _provider: IVaraEthProvider) {}

  async getIds(): Promise<Hex[]> {
    const ids = await this._provider.send<Hex[]>('program_ids', []);

    return ids.map((id) => id.toLowerCase() as Hex);
  }

  async codeId(programId: string): Promise<Hex> {
    return this._provider.send<Hex>('program_codeId', [programId]);
  }

  async readState(hash: string): Promise<ProgramState> {
    const state = await this._provider.send<any>('program_readState', [hash]);

    transformMaybeHashes(state, ['queueHash', 'waitlistHash', 'stashHash', 'mailboxHash']);

    if ('Active' in state.program) {
      transformMaybeHashes(state.program.Active, ['allocationsHash', 'pagesHash']);
    }

    normalizeProgramBalances(state);

    return state;
  }

  async readQueue(hash: string): Promise<MessageQueue> {
    const queue = await this._provider.send<any[]>('program_readQueue', [hash]);
    queue.forEach(normalizeDispatch);
    return queue;
  }

  async readWaitlist(hash: string): Promise<Waitlist> {
    const waitlist = await this._provider.send<Waitlist>('program_readWaitlist', [hash]);
    for (const entry of Object.values(waitlist.inner)) {
      normalizeDispatch(entry.value);
    }
    return waitlist;
  }

  async readStash(hash: string): Promise<DispatchStash> {
    const stash = await this._provider.send<DispatchStash>('program_readStash', [hash]);
    for (const entry of Object.values(stash)) {
      normalizeDispatch(entry.value[0]);
    }
    return stash;
  }

  async readMailbox(hash: string): Promise<Mailbox> {
    return this._provider.send<Mailbox>('program_readMailbox', [hash]);
  }

  async readFullState(hash: string): Promise<FullProgramState> {
    const state = await this._provider.send<FullProgramState>('program_readFullState', [hash]);

    if ('Active' in state.program) {
      transformMaybeHashes(state.program.Active, ['allocationsHash', 'pagesHash']);
    }

    normalizeProgramBalances(state);

    state.canonicalQueue?.forEach(normalizeDispatch);
    state.injectedQueue?.forEach(normalizeDispatch);

    if (state.waitlist) {
      for (const entry of Object.values(state.waitlist.inner)) normalizeDispatch(entry.value);
    }
    if (state.stash) {
      for (const entry of Object.values(state.stash)) normalizeDispatch(entry.value[0]);
    }

    return state;
  }

  async readPages(hash: string): Promise<MemoryPages> {
    return this._provider.send<MemoryPages>('program_readPages', [hash]);
  }

  async readPageData(hash: string): Promise<Hex> {
    return this._provider.send<Hex>('program_readPageData', [hash]);
  }
}
