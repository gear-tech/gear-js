import { CodeStatus, MessageReadReason } from '@gear-js/common';

import { MessageStatus, ProgramStatus, generateUUID } from '../common';
import { Block, Code, Message, Meta, Program } from '../database';
import { BlockService, CodeService, MessageService, MetaService, ProgramService } from '../services';

export class TempState {
  private programs: Map<string, Program>;
  private codes: Map<string, Code>;
  private messages: Map<string, Message>;
  private blocks: Map<string, Block>;
  private meta: Map<string, Meta>;
  private genesis: string;

  constructor(
    private programService: ProgramService,
    private messageService: MessageService,
    private codeService: CodeService,
    private blockService: BlockService,
    private metaService: MetaService,
  ) {
    this.programs = new Map();
    this.codes = new Map();
    this.messages = new Map();
    this.blocks = new Map();
    this.meta = new Map();
  }

  newState(genesis: string) {
    this.genesis = genesis;
    this.programs.clear();
    this.codes.clear();
    this.messages.clear();
    this.blocks.clear();
    this.meta.clear();
  }

  addProgram(program: Program) {
    if (!this.programs.has(program.id)) {
      if (!program._id) {
        program._id = generateUUID();
      }
      this.programs.set(program.id, program);
    }
  }

  addCode(code: Code) {
    if (!this.codes.has(code.id)) {
      if (!code._id) {
        code._id = generateUUID();
      }
      this.codes.set(code.id, code);
    }
  }

  async addMsg(msg: Message) {
    if (!this.messages.has(msg.id)) {
      if (msg.replyToMessageId) {
        const replyTo = await this.getMsg(msg.replyToMessageId);
        if (replyTo) {
          msg.entry = replyTo.entry;
        }
      }
      this.messages.set(msg.id, msg);
    }
  }

  addBlock(block: Block) {
    this.blocks.set(block.hash, block);
  }

  async getProgram(id: string): Promise<Program> {
    if (this.programs.has(id)) {
      return this.programs.get(id);
    }
    try {
      const program = await this.programService.get({ id, genesis: this.genesis });
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
      const code = await this.codeService.get({ id, genesis: this.genesis });
      this.codes.set(code.id, code);
      return code;
    } catch (err) {
      return null;
    }
  }

  async getMeta(hash: string): Promise<Meta> {
    if (this.meta.has(hash)) {
      return this.meta.get(hash);
    }
    const meta = await this.metaService.getByHashOrCreate(hash);
    this.meta.set(meta.hash, meta);
    return meta;
  }

  async getMsg(id: string): Promise<Message> {
    if (this.messages.has(id)) {
      return this.messages.get(id);
    }
    try {
      const msg = await this.messageService.get({ id, genesis: this.genesis });
      this.messages.set(msg.id, msg);
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

  async setCodeStatus(id: string, status: CodeStatus, expiration: string) {
    const code = await this.getCode(id);
    if (code) {
      code.status = status;
      code.expiration = expiration;
    }
  }

  async setDispatchedStatus(statuses: { [key: string]: MessageStatus }) {
    for (const [id, status] of Object.entries(statuses)) {
      const msg = await this.getMsg(id);
      if (msg) {
        msg.processedWithPanic = status !== 'Success';
      }
    }
  }

  async setReadStatus(id: string, reason: MessageReadReason) {
    const msg = await this.getMsg(id);
    if (msg) {
      msg.readReason = reason;
    }
  }

  async save() {
    await this.codeService.save(Array.from(this.codes.values()));
    await this.programService.save(Array.from(this.programs.values()));
    await this.messageService.save(Array.from(this.messages.values()));
    await this.blockService.save(Array.from(this.blocks.values()));
  }
}
