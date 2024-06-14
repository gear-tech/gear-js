import { Store } from '@subsquid/typeorm-store';
import { HexString } from '@gear-js/api';
import { getServiceNamePrefix, getFnNamePrefix } from 'sails-js';

import { Code, Event, MessageFromProgram, MessageToProgram, Program } from './model';
import { ProcessorContext } from './processor';
import { ProgramStatus, CodeStatus, MessageReadReason } from './model/enums';
import { MessageStatus } from './common';

export class TempState {
  private programs: Map<string, Program>;
  private codes: Map<string, Code>;
  private messagesFromProgram: Map<string, MessageFromProgram>;
  private messagesToProgram: Map<string, MessageToProgram>;
  private events: Map<string, Event>;
  private metahashes: Map<string, string>;
  private _ctx: ProcessorContext<Store>;

  constructor() {
    this.programs = new Map();
    this.codes = new Map();
    this.metahashes = new Map();
    this.messagesFromProgram = new Map();
    this.messagesToProgram = new Map();
    this.events = new Map();
  }

  newState(ctx: ProcessorContext<Store>) {
    this._ctx = ctx;
    this.programs.clear();
    this.codes.clear();
    this.metahashes.clear();
    this.messagesFromProgram.clear();
    this.messagesToProgram.clear();
    this.events.clear();
  }

  addProgram(program: Program) {
    this.programs.set(program.id, program);
  }

  addCode(code: Code) {
    this.codes.set(code.id, code);
    if (code.metahash) {
      this.metahashes.set(code.id, code.metahash);
    }
  }

  addMsgToProgram(msg: MessageToProgram) {
    this.messagesToProgram.set(msg.id, msg);
  }

  addMsgFromProgram(msg: MessageFromProgram) {
    this.messagesFromProgram.set(msg.id, msg);
  }

  addEvent(event: Event) {
    try {
      event.service = getServiceNamePrefix(event.payload as HexString) || null;
      if (/[^\x20-\x7E]/.test(event.service)) {
        event.service = null;
      }
    } catch (_) {
      event.service = null;
    }

    if (event.service) {
      try {
        event.name = getFnNamePrefix(event.payload as HexString) || null;
        if (/[^\x20-\x7E]/.test(event.name)) {
          event.name = null;
        }
      } catch (_) {
        event.name = null;
      }
    }

    this.events.set(event.id, event);
  }

  async getProgram(id: string): Promise<Program> {
    if (this.programs.has(id)) {
      return this.programs.get(id);
    }
    try {
      const program = await this._ctx.store.findOneBy(Program, { id });

      this.programs.set(program.id, program);
      return program;
    } catch (err) {
      return null;
    }
  }

  async getCode(id: string): Promise<Code> {
    if (this.codes.has(id)) {
      return this.codes.get(id);
    }
    try {
      const code = await this._ctx.store.findOneBy(Code, { id });
      this.codes.set(code.id, code);
      return code;
    } catch (err) {
      return null;
    }
  }

  async getMsgToProgram(id: string): Promise<MessageToProgram> {
    if (this.messagesToProgram.has(id)) {
      return this.messagesToProgram.get(id);
    }
    try {
      const msg = await this._ctx.store.findOneBy(MessageToProgram, { id });
      this.messagesToProgram.set(msg.id, msg);
      return msg;
    } catch (err) {
      return null;
    }
  }

  async getMsgFromProgram(id: string): Promise<MessageFromProgram> {
    if (this.messagesFromProgram.has(id)) {
      return this.messagesFromProgram.get(id);
    }
    try {
      const msg = await this._ctx.store.findOneBy(MessageFromProgram, { id });
      this.messagesFromProgram.set(msg.id, msg);
      return msg;
    } catch (err) {
      return null;
    }
  }

  async setProgramStatus(id: string, status: ProgramStatus, expiration?: string) {
    const program = await this.getProgram(id);
    if (program) {
      program.status = status;
      if (expiration) {
        program.expiration = expiration;
      }
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

  async save() {
    try {
      await Promise.all([
        this._ctx.store.save(Array.from(this.codes.values())),
        this._ctx.store.save(Array.from(this.programs.values())),
        this._ctx.store.save(Array.from(this.messagesFromProgram.values())),
        this._ctx.store.save(Array.from(this.messagesToProgram.values())),
        this._ctx.store.save(Array.from(this.events.values())),
      ]);
    } catch (error) {
      this._ctx.log.error({ error: error.message, stack: error.stack }, 'Failed to save data');
      throw error;
    }
  }
}
