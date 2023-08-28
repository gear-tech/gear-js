import { ISubmittableResult } from '@polkadot/types/types';
import { SubmittableExtrinsic } from '@polkadot/api/types';
import { u8aToHex } from '@polkadot/util';

import { IResumeSessionCommitArgs, IResumeSessionInitArgs, IResumeSessionPushArgs } from './types';
import { ResumeSessionCommitError, ResumeSessionInitError, ResumeSessionPushError } from './errors';
import { CreateType } from './metadata';
import { GearApi } from './GearApi';
import { GearTransaction } from './Transaction';

const SIXTEEN_KB = 0x4000;

export class GearResumeSession extends GearTransaction {
  constructor(protected _api: GearApi) {
    super(_api);
  }

  /**
   * ## Create a session for program resume. Get session id from `ProgramResumeSessionStarted` event
   * @param args Resume program args
   * @returns Submittable result
   * @example
   * ```javascript
   * const program = await api.programStorage.getProgram(programId, oneBlockBeforePauseHash);
   * const initTx = api.program.resumeSession.init({
   *   programId,
   *   allocations: program.allocations,
   *   codeHash: program.codeHash.toHex(),
   * });
   *
   * let sessionId: HexString;
   * initTx.signAndSend(account, ({ events }) => {
   *   events.forEach(({ event: { method, data }}) => {
   *     if (method === 'ProgramResumeSessionStarted') {
   *       sessionId = data.sessionId.toNumber();
   *     }
   *   })
   * })
   * ```
   */
  init({
    programId,
    allocations,
    codeHash,
  }: IResumeSessionInitArgs): SubmittableExtrinsic<'promise', ISubmittableResult> {
    try {
      this.extrinsic = this._api.tx.gear.resumeSessionInit(
        programId,
        Array.from(CreateType.create('BTreeSet<u32>', allocations).toU8a()),
        codeHash,
      );
      return this.extrinsic;
    } catch (error) {
      console.log(error);
      throw new ResumeSessionInitError(programId, error.message);
    }
  }

  /**
   * ## Append program memory pages to the session data.
   * @param args Push pages args
   * @returns Submittable result
   * @example
   * ```javascript
   * const pages = await api.programStorage.getProgramPages(programId, program, oneBlockBeforePauseHash);
   * for (const memPage of Object.entries(page)) {
   *   const tx = api.program.resumeSession.push({ sessionId, memoryPages: [memPage] });
   *   tx.signAndSend(account);
   * }
   * ```
   */
  push({ sessionId, memoryPages }: IResumeSessionPushArgs): SubmittableExtrinsic<'promise', ISubmittableResult> {
    if (
      !memoryPages.every(([_, page]) => {
        if (typeof page === 'string') {
          return page.length === SIXTEEN_KB * 2 + 2;
        } else {
          return page.length === SIXTEEN_KB;
        }
      })
    ) {
      throw new ResumeSessionPushError(sessionId, 'Invalid memory page length. Must be 16KB.');
    }

    const vecLen = CreateType.create('Compact<u8>', memoryPages.length).toHex();

    const tuples = memoryPages.map(([number, page]) => {
      const num = CreateType.create('u32', number).toHex();
      const p = typeof page === 'string' ? page : u8aToHex(page);
      return num + p.slice(2);
    });

    try {
      this.extrinsic = this._api.tx.gear.resumeSessionPush(sessionId, vecLen + tuples.slice(2));
      return this.extrinsic;
    } catch (error) {
      throw new ResumeSessionPushError(sessionId);
    }
  }

  /**
   * ## Finish program resume session with the given key `sessionId`.
   * @param args Commit session args
   * @returns Submittable result
   * @example
   * ```javascript
   * const tx = api.program.resumeSession.commit({ sessionId, blockCount: 20_000 });
   * tx.signAndSend(account);
   * ```
   */
  commit({ sessionId, blockCount }: IResumeSessionCommitArgs): SubmittableExtrinsic<'promise', ISubmittableResult> {
    try {
      this.extrinsic = this._api.tx.gear.resumeSessionCommit(sessionId, blockCount);
      return this.extrinsic;
    } catch (error) {
      console.log(error);
      throw new ResumeSessionCommitError(sessionId, error.message);
    }
  }
}
