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

    return state;
  }

  async readQueue(hash: string): Promise<MessageQueue> {
    return this._provider.send<MessageQueue>('program_readQueue', [hash]);
  }

  async readWaitlist(hash: string): Promise<Waitlist> {
    return this._provider.send<Waitlist>('program_readWaitlist', [hash]);
  }

  async readStash(hash: string): Promise<DispatchStash> {
    return this._provider.send<DispatchStash>('program_readStash', [hash]);
  }

  async readMailbox(hash: string): Promise<Mailbox> {
    return this._provider.send<Mailbox>('program_readMailbox', [hash]);
  }

  async readFullState(hash: string): Promise<FullProgramState> {
    const state = await this._provider.send<FullProgramState>('program_readFullState', [hash]);

    if ('Active' in state.program) {
      transformMaybeHashes(state.program.Active, ['allocationsHash', 'pagesHash']);
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
