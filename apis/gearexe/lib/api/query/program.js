import { transformMaybeHashes } from '../../util/maybe-hash.js';

class ProgramQueries {
    _provider;
    constructor(_provider) {
        this._provider = _provider;
    }
    async getIds() {
        return this._provider.send('program_ids', []);
    }
    async codeId(programId) {
        return this._provider.send('program_codeId', [programId]);
    }
    async readState(hash) {
        const state = await this._provider.send('program_readState', [hash]);
        transformMaybeHashes(state, ['queueHash', 'waitlistHash', 'mailboxHash']);
        if ('Active' in state.program) {
            transformMaybeHashes(state.program.Active, ['allocationsHash', 'pagesHash']);
        }
        return state;
    }
}

export { ProgramQueries };
