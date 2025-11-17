import { HexString, IGearExeProvider, ProgramState } from '../../types/index.js';
import { transformMaybeHashes } from '../../util/maybe-hash.js';

export class ProgramQueries {
  constructor(private _provider: IGearExeProvider) {}

  async getIds(): Promise<HexString[]> {
    return this._provider.send<HexString[]>('program_ids', []);
  }

  async codeId(programId: string): Promise<HexString> {
    return this._provider.send<HexString>('program_codeId', [programId]);
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
