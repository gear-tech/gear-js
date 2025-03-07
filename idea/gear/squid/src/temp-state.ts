import { Store } from '@subsquid/typeorm-store';
import { HexString } from '@gear-js/api';
import { getServiceNamePrefix, getFnNamePrefix } from 'sails-js';
import { xxhashAsHex } from '@polkadot/util-crypto';
import { TypeRegistry, Metadata } from '@polkadot/types';
import { SiLookupTypeId } from '@polkadot/types/interfaces';

import {
  ProgramStatus,
  CodeStatus,
  MessageReadReason,
  Code,
  Event,
  MessageFromProgram,
  MessageToProgram,
  Program,
  Voucher,
} from './model';
import { Block, ProcessorContext } from './processor';
import { MessageStatus } from './common';
import { In } from 'typeorm';
import { RedisClientType } from '@redis/client';
import { findChildMessageId } from './util';

const gearProgramModule = xxhashAsHex('GearProgram', 128);
const programStorageMethod = xxhashAsHex('ProgramStorage', 128);

const PROGRAM_STORAGE_PREFIX = gearProgramModule + programStorageMethod.slice(2);

function getServiceAndFn(payload: string | null) {
  if (payload === null) {
    return [null, null];
  }

  let service: string | null = null;
  let name: string | null = null;
  try {
    service = getServiceNamePrefix(payload as HexString) || null;
    if (service === null || /[^\x20-\x7E]/.test(service)) {
      return [null, null];
    }
    name = getFnNamePrefix(payload as HexString) || null;
    if (name === null || /[^\x20-\x7E]/.test(name)) {
      return [null, null];
    }
  } catch (_) {
    return [null, null];
  }

  return [service, name];
}

export class TempState {
  private programs: Map<string, Program>;
  private newPrograms: Set<string>;
  private codes: Map<string, Code>;
  private messagesFromProgram: Map<string, MessageFromProgram>;
  private messagesToProgram: Map<string, MessageToProgram>;
  private events: Map<string, Event>;
  private vouchers: Map<string, Voucher>;
  private revokedVouchers: Set<string>;
  private transfers: Map<string, bigint>;
  private cachedMessages: { [key: string]: number };
  private genesisHash: string;
  private _ctx: ProcessorContext<Store>;
  private _metadata: Metadata;
  private _registry: TypeRegistry;
  private _specVersion: number;
  private _programStorageTy: string;
  private _redis: RedisClientType;

  constructor(redisClient: RedisClientType, genesisHash: string) {
    this._redis = redisClient;
    this.genesisHash = genesisHash;
    this.programs = new Map();
    this.codes = new Map();
    this.messagesFromProgram = new Map();
    this.messagesToProgram = new Map();
    this.events = new Map();
    this.newPrograms = new Set();
    this.vouchers = new Map();
    this.revokedVouchers = new Set();
    this.transfers = new Map();
    this.cachedMessages = {};
  }

  async newState(ctx: ProcessorContext<Store>) {
    this._ctx = ctx;
    this.programs.clear();
    this.codes.clear();
    this.messagesFromProgram.clear();
    this.messagesToProgram.clear();
    this.events.clear();
    this.newPrograms.clear();
    this.vouchers.clear();
    this.revokedVouchers.clear();
    this.transfers.clear();

    this._redis.on('error', (error) => this._ctx.log.error(error));

    const temp = Object.entries(await this._redis.hGetAll(this.genesisHash));
    this.cachedMessages = {};
    temp.forEach(([key, value]) => {
      this.cachedMessages[key] = Number(value);
    });
  }

  addProgram(program: Program) {
    this.programs.set(program.id, program);
    this.newPrograms.add(program.id);
  }

  addCode(code: Code) {
    this.codes.set(code.id, code);
  }

  addMsgToProgram(msg: MessageToProgram) {
    const [service, name] = getServiceAndFn(msg.payload);

    msg.service = service;
    msg.fn = name;

    this.saveParentMsgId(msg.id);

    this.messagesToProgram.set(msg.id, msg);
  }

  addMsgFromProgram(msg: MessageFromProgram) {
    const [service, name] = getServiceAndFn(msg.payload);

    msg.service = service;
    msg.fn = name;

    this.messagesFromProgram.set(msg.id, msg);
  }

  addEvent(msg: MessageFromProgram) {
    const [service, name] = getServiceAndFn(msg.payload);

    if (service === null || name === null) {
      this.addMsgFromProgram(msg);
    } else {
      this.events.set(
        msg.id,
        new Event({
          timestamp: msg.timestamp,
          blockHash: msg.blockHash,
          blockNumber: msg.blockNumber,
          id: msg.id,
          parentId: msg.parentId,
          source: msg.source,
          payload: msg.payload,
          service,
          name,
        }),
      );
    }
  }

  addVoucher(voucher: Voucher) {
    this.vouchers.set(voucher.id, voucher);
  }

  async getProgram(id: string): Promise<Program | null> {
    if (this.programs.has(id)) {
      return this.programs.get(id) ?? null;
    }
    try {
      const program = (await this._ctx.store.findOneBy(Program, { id }))!;

      this.programs.set(program.id, program);
      return program;
    } catch (_) {
      return null;
    }
  }

  async getCode(id: string): Promise<Code | null> {
    if (this.codes.has(id)) {
      return this.codes.get(id) ?? null;
    }
    try {
      const code = (await this._ctx.store.findOneBy(Code, { id }))!;
      this.codes.set(code.id, code);
      return code;
    } catch (_) {
      return null;
    }
  }

  async getMsgToProgram(id: string): Promise<MessageToProgram | null> {
    if (this.messagesToProgram.has(id)) {
      return this.messagesToProgram.get(id) ?? null;
    }
    try {
      const msg = (await this._ctx.store.findOneBy(MessageToProgram, { id }))!;
      this.messagesToProgram.set(msg.id, msg);
      return msg;
    } catch (_) {
      return null;
    }
  }

  async getMsgFromProgram(id: string): Promise<MessageFromProgram | null> {
    if (this.messagesFromProgram.has(id)) {
      return this.messagesFromProgram.get(id) ?? null;
    }
    try {
      const msg = (await this._ctx.store.findOneBy(MessageFromProgram, { id }))!;
      this.messagesFromProgram.set(msg.id, msg);
      return msg;
    } catch (_) {
      return null;
    }
  }

  async getVoucher(id: string): Promise<Voucher | null> {
    if (this.vouchers.has(id)) {
      return this.vouchers.get(id) ?? null;
    }
    try {
      const voucher = (await this._ctx.store.findOneBy(Voucher, { id }))!;
      voucher.balance = BigInt(voucher.balance);
      this.vouchers.set(voucher.id, voucher);
      return voucher;
    } catch (_) {
      return null;
    }
  }

  getTransfer(id: string, defaultReturn: bigint = BigInt(0)) {
    return this.transfers.get(id) || defaultReturn;
  }

  async isProgramIndexed(id: string): Promise<boolean> {
    return !!(await this.getProgram(id));
  }

  async setProgramStatus(id: string, status: ProgramStatus, expiration?: string) {
    const program = await this.getProgram(id);

    if (!program) {
      this._ctx.log.error(`setProgramStatus :: Program ${id} not found`);
      return;
    }

    program.status = status;
    if (expiration) {
      program.expiration = expiration;
    }
  }

  async setCodeStatus(id: string, status: CodeStatus) {
    const code = await this.getCode(id);
    if (code) {
      code.status = status;
    }
  }

  async setDispatchedStatus(id: string, status: MessageStatus) {
    const msg = await this.getMsgToProgram(id);
    if (msg) {
      msg.processedWithPanic = status !== 'Success';
    }
  }

  async setReadStatus(id: string, reason: MessageReadReason) {
    const msg = await this.getMsgFromProgram(id);
    if (msg) {
      msg.readReason = reason;
    }
  }

  async setVoucherDeclined(id: string) {
    const voucher = await this.getVoucher(id);

    if (!voucher) {
      this._ctx.log.error(`setVoucherDeclined :: Voucher ${id} not found`);
      return;
    }

    voucher.isDeclined = true;
  }

  setVoucherRevoked(id: string) {
    this.revokedVouchers.add(id);
  }

  setTransfer(id: string, amount: bigint) {
    this.transfers.set(id, amount);
  }

  async getCodeId(programId: string, block: Block) {
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

    return decoded.isActive ? decoded.asActive.codeHash.toHex() : '0x';
  }

  async saveVouchers() {
    if (this.vouchers.size > 0) {
      const voucherIds = Array.from(this.vouchers.keys());

      for (const id of voucherIds) {
        if (this.transfers.has(id)) {
          this.vouchers.get(id)!.balance += this.transfers.get(id)!;
          this.transfers.delete(id);
        }
        if (this.revokedVouchers.has(id)) {
          this.vouchers.delete(id);
        }
      }

      const vouchers = Array.from(this.vouchers.values());

      await this._ctx.store.save(vouchers);
    }

    if (this.revokedVouchers.size > 0) {
      const revoked = Array.from(this.revokedVouchers);
      await this._ctx.store.remove(Voucher, revoked);
    }

    if (this.transfers.size > 0) {
      const trasnferIds = Array.from(this.transfers.keys());
      const voucherTransfers = await this._ctx.store.find(Voucher, { where: { id: In(trasnferIds) } });

      if (voucherTransfers.length > 0) {
        for (const voucher of voucherTransfers) {
          const balance = this.transfers.get(voucher.id)!;
          voucher.balance = BigInt(voucher.balance) + balance;
        }

        await this._ctx.store.save(voucherTransfers);
      }
    }
  }

  async save() {
    try {
      if (this.newPrograms.size > 0) {
        await Promise.all(
          Array.from(this.newPrograms.keys()).map(async (id) => {
            const p = this.programs.get(id);
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

      await Promise.all([
        this._ctx.store.save(Array.from(this.codes.values())),
        this._ctx.store.save(Array.from(this.programs.values())),
        this._ctx.store.save(Array.from(this.messagesFromProgram.values())),
        this._ctx.store.save(Array.from(this.messagesToProgram.values())),
        this._ctx.store.save(Array.from(this.events.values())),
        this.saveVouchers(),
      ]);

      if (
        this.programs.size ||
        this.codes.size ||
        this.messagesFromProgram.size ||
        this.messagesToProgram.size ||
        this.events.size
      ) {
        this._ctx.log.info(
          {
            programs: this.programs.size || undefined,
            codes: this.codes.size || undefined,
            msgsFrom: this.messagesFromProgram.size || undefined,
            msgsTo: this.messagesToProgram.size || undefined,
            events: this.events.size || undefined,
          },
          'Data saved',
        );
      }

      await this._redis.del(this.genesisHash);
      if (Object.keys(this.cachedMessages).length > 0) {
        await this._redis.hSet(this.genesisHash, this.cachedMessages);
      }
    } catch (error) {
      this._ctx.log.error({ error: error.message, stack: error.stack }, 'Failed to save data');
      throw error;
    }
  }

  saveParentMsgId(parentId: string, nonce: number = 0) {
    this.cachedMessages[parentId] = nonce;
    return parentId;
  }

  removeParentMsgId(parentId: string) {
    delete this.cachedMessages[parentId];
  }

  async getMessageId(childId: string) {
    const finder = Object.entries(this.cachedMessages).map(([parentId, nonce]) => {
      return findChildMessageId(parentId, childId, Number(nonce));
    });

    return Promise.any(finder)
      .then(({ parentId, nonce }) => {
        return this.saveParentMsgId(parentId, nonce);
      })
      .catch<null>(() => null);
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
