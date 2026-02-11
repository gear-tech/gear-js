import { Hex } from 'viem';
import { IVaraEthProvider, ProgramState } from '../../types/index.js';
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

    transformMaybeHashes(state, ['queueHash', 'waitlistHash', 'mailboxHash']);

    if ('Active' in state.program) {
      transformMaybeHashes(state.program.Active, ['allocationsHash', 'pagesHash']);
    }

    return state;
  }
}
