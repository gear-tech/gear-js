import { IGearexeProvider, ProgramState } from '../../types/index.js';
import { transformMaybeHashes } from '../../util/maybe-hash.js';

export class ProgramQueries {
  constructor(private _provider: IGearexeProvider) {}

  async getIds(): Promise<`0x${string}`[]> {
    return this._provider.send<`0x${string}`[]>('program_ids', []);
  }

  async codeId(programId: string): Promise<`0x${string}`> {
    return this._provider.send<`0x${string}`>('program_codeId', [programId]);
  }

  async readState(hash: string): Promise<ProgramState> {
    const state = await this._provider.send<any>('program_readState', [hash]);

    transformMaybeHashes(state, ['queueHash', 'waitlistHash', 'mailboxHash']);

    if ('Active' in state.program) {
      transformMaybeHashes(state.program.Active, ['allocationsHash', 'pagesHash']);
    }

    return state;
  }
}
