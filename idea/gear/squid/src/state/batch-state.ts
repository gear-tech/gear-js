import { Metadata, TypeRegistry } from '@polkadot/types';
import type { SiLookupTypeId } from '@polkadot/types/interfaces';
import { xxhashAsHex } from '@polkadot/util-crypto';
import type { Store } from '@subsquid/typeorm-store';
import type { DataCache } from 'gear-idea-common';
import { cacheKey, type PgByteaString } from 'gear-idea-indexer-db';
import { In } from 'typeorm';

import { Code, type CodeStatus, Program, type ProgramStatus } from '../model/index.js';
import type { Block, ProcessorContext } from '../processor.js';
import { SPEC_VERSION } from '../util.js';
import { MessageState } from './message-state.js';
import { VoucherState } from './voucher-state.js';

const gearProgramModule = xxhashAsHex('GearProgram', 128);
const programStorageMethod = xxhashAsHex('ProgramStorage', 128);

const PROGRAM_STORAGE_PREFIX = gearProgramModule + programStorageMethod.slice(2);

export class BatchState {
  private _programs: Map<PgByteaString, Program>;
  private _newPrograms: Set<PgByteaString>;
  private _changedProgramIds: Set<PgByteaString>;
  private _codes: Map<PgByteaString, Code>;
  private _programStatusUpdates: Map<PgByteaString, { status: ProgramStatus; expiration?: string }>;
  private _codeStatusUpdates: Map<PgByteaString, CodeStatus>;
  private _ctx: ProcessorContext<Store>;
  private _metadata: Metadata;
  private _registry: TypeRegistry;
  private _specVersion: number;
  private _programStorageTy: string;
  private readonly _cache: DataCache;
  private readonly _genesisHash: string;
  public readonly messages: MessageState;
  public readonly vouchers: VoucherState;

  constructor(cache: DataCache, genesisHash: string) {
    this._cache = cache;
    this._genesisHash = genesisHash;
    this._programs = new Map();
    this._codes = new Map();
    this._newPrograms = new Set();
    this._changedProgramIds = new Set();
    this._programStatusUpdates = new Map();
    this._codeStatusUpdates = new Map();
    this.messages = new MessageState(cache, genesisHash);
    this.vouchers = new VoucherState();
  }

  async newState(ctx: ProcessorContext<Store>) {
    this._ctx = ctx;
    this._programs.clear();
    this._codes.clear();
    this._newPrograms.clear();
    this._changedProgramIds.clear();
    this._programStatusUpdates.clear();
    this._codeStatusUpdates.clear();

    await this.messages.newBatch(ctx);
    await this.vouchers.newBatch(ctx);
  }

  async save() {
    try {
      if (this._newPrograms.size > 0) {
        await Promise.all(
          Array.from(this._newPrograms.keys()).map(async (id) => {
            const p = this._programs.get(id);
            if (p) {
              const code = await this.getCode(p.codeId);
              if (code) {
                p.metahash = code.metahash!;
                p.metaType = code.metaType;
              }
            }
          }),
        );
      }

      await this.messages.save();
      await this.vouchers.save();
      await this._applyProgramStatusUpdates();
      await this._applyCodeStatusUpdates();

      await this._ctx.store.save(Array.from(this._codes.values()));
      await this._ctx.store.save(Array.from(this._programs.values()));

      if (this._programs.size || this._codes.size) {
        this._ctx.log.info(
          {
            programs: this._programs.size || undefined,
            codes: this._codes.size || undefined,
          },
          'Data saved',
        );
      }

      await this.messages.persistRedis();
      await this._invalidatePrograms();
    } catch (error) {
      this._ctx.log.error({ error: error.message, stack: error.stack }, 'Failed to save data');
      throw error;
    }
  }

  // ── Program / Code ────────────────────────────────────────────────────────

  addProgram(program: Program) {
    this._ctx.log.debug({ id: program.id, codeId: program.codeId, owner: program.owner }, 'addProgram');
    this._programs.set(program.id, program);
    this._newPrograms.add(program.id);
    this._changedProgramIds.add(program.id);
  }

  addCode(code: Code) {
    this._ctx.log.debug({ id: code.id, status: code.status }, 'addCode');
    this._codes.set(code.id, code);
  }

  async getProgram(id: PgByteaString): Promise<Program | null> {
    if (this._programs.has(id)) {
      return this._programs.get(id) ?? null;
    }
    try {
      const program = (await this._ctx.store.findOneBy(Program, { id }))!;
      this._programs.set(program.id, program);
      return program;
    } catch (_) {
      return null;
    }
  }

  async getCode(id: PgByteaString): Promise<Code | null> {
    if (this._codes.has(id)) {
      return this._codes.get(id) ?? null;
    }
    try {
      const code = (await this._ctx.store.findOneBy(Code, { id }))!;
      this._codes.set(code.id, code);
      return code;
    } catch (_) {
      return null;
    }
  }

  async isProgramIndexed(id: PgByteaString): Promise<boolean> {
    return !!(await this.getProgram(id));
  }

  setProgramStatus(id: PgByteaString, status: ProgramStatus, expiration?: string) {
    this._ctx.log.debug({ id, status, expiration }, 'setProgramStatus');
    this._programStatusUpdates.set(id, { status, expiration });
    this._changedProgramIds.add(id);
  }

  setCodeStatus(id: PgByteaString, status: CodeStatus) {
    this._ctx.log.debug({ id, status }, 'setCodeStatus');
    this._codeStatusUpdates.set(id, status);
  }

  async getCodeId(programId: PgByteaString, block: Block) {
    const param = PROGRAM_STORAGE_PREFIX + programId.slice(2);

    const calls = [{ method: 'state_getStorage', params: [param, block.hash] }];

    const isMetadataRequired = !this._specVersion || block.specVersion !== this._specVersion;

    if (isMetadataRequired) {
      calls.push({ method: 'state_getMetadata', params: [block.hash] });
    }

    const [storage, metadata] = await this._ctx._chain.rpc.batchCall(calls);

    if (isMetadataRequired) {
      this._registry = new TypeRegistry();
      this._metadata = new Metadata(this._registry, metadata);
      this._specVersion = block.specVersion;

      const gearProgramPallet = this._metadata.asLatest.pallets.find(({ name }) => name.toString() === 'GearProgram')!;
      const programStorage = gearProgramPallet.storage
        .unwrap()
        .items.find(({ name }) => name.toString() === 'ProgramStorage')!;

      const tydef = this._metadata.asLatest.lookup.getTypeDef(programStorage.type.asMap.value);

      this._programStorageTy = tydef.lookupName!;

      const types = getAllNeccesaryTypes(this._metadata, programStorage.type.asMap.value);

      this._registry.register(types);
      this._registry.setKnownTypes(types);
    }

    const decoded = this._registry.createType<any>(this._programStorageTy, storage);

    if (decoded.isActive) {
      if (block._runtime.specVersion >= SPEC_VERSION['1.9.0']) return decoded.asActive.codeId.toHex();
      return decoded.asActive.codeHash.toHex();
    }
    return '0x';
  }

  private async _queryPrograms(ids: PgByteaString[]) {
    const programsToQuery = ids.filter((id) => !this._programs.has(id));
    if (programsToQuery.length > 0) {
      const programs = await this._ctx.store.find(Program, { where: { id: In(programsToQuery) } });
      for (const program of programs) {
        this._programs.set(program.id, program);
      }
    }
  }

  private async _applyProgramStatusUpdates() {
    await this._queryPrograms(Array.from(this._programStatusUpdates.keys()));
    for (const [id, { status, expiration }] of this._programStatusUpdates) {
      const program = this._programs.get(id);
      if (!program) {
        this._ctx.log.error(`setProgramStatus :: Program ${id} not found`);
        continue;
      }
      program.status = status;
      if (expiration) program.expiration = expiration;
    }
  }

  private async _applyCodeStatusUpdates() {
    const ids = Array.from(this._codeStatusUpdates.keys());
    const codesToQuery = ids.filter((id) => !this._codes.has(id));
    if (codesToQuery.length > 0) {
      const codes = await this._ctx.store.find(Code, { where: { id: In(codesToQuery) } });
      for (const code of codes) {
        this._codes.set(code.id, code);
      }
    }
    for (const [id, status] of this._codeStatusUpdates) {
      const code = this._codes.get(id);
      if (code) code.status = status;
    }
  }

  private async _invalidatePrograms() {
    if (this._changedProgramIds.size === 0) return;

    const g = this._genesisHash;
    await this._cache.increment(cacheKey.programsVersion(g));

    for (const id of this._changedProgramIds) {
      this._cache.invalidate(cacheKey.programData(g, id)).catch(() => {});
    }
  }
}

const getAllNeccesaryTypes = (metadata: Metadata, tyindex: SiLookupTypeId | number): Record<string, string> => {
  if (!tyindex) {
    return {};
  }

  const tydef = metadata.asLatest.lookup.getTypeDef(tyindex);

  let types = {};

  if (tydef.sub) {
    if (Array.isArray(tydef.sub)) {
      for (const sub of tydef.sub) {
        types = { ...types, ...getAllNeccesaryTypes(metadata, sub.lookupIndex!) };
      }
    } else {
      types = getAllNeccesaryTypes(metadata, tydef.sub.lookupIndex!);
    }
  }

  if (!tydef.lookupName) {
    return types;
  }

  types[tydef.lookupName] = tydef.type;

  return types;
};
