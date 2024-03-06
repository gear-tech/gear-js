import { CodeStatus, MessageReadReason } from '@gear-js/common';

import { MessageStatus, ProgramStatus } from '../common';
import { Block, Code, Message, Program } from '../database';
import { BlockService, CodeService, MessageService, ProgramService } from '../services';
import { RMQService } from '../rmq';

export class TempState {
  private programs: Map<string, Program>;
  private codes: Map<string, Code>;
  private messages: Map<string, Message>;
  private blocks: Map<string, Block>;
  private genesis: string;
  private metahashes: Map<string, string>;

  constructor(
    private programService: ProgramService,
    private messageService: MessageService,
    private codeService: CodeService,
    private blockService: BlockService,
    private rmq: RMQService,
  ) {
    this.programs = new Map();
    this.codes = new Map();
    this.messages = new Map();
    this.blocks = new Map();
    this.metahashes = new Map();
  }

  newState(genesis: string) {
    this.genesis = genesis;
    this.programs.clear();
    this.codes.clear();
    this.messages.clear();
    this.blocks.clear();
    this.metahashes.clear();
  }

  addProgram(program: Program) {
    this.programs.set(program.id, program);
  }

  addCode(code: Code) {
    this.codes.set(code.id, code);
    if (code.metahash) {
      this.metahashes.set(code.id, code.metahash);
      this.rmq.sendMetahashToMetaStorage(code.metahash, code.id);
    }
  }

  addMsg(msg: Message) {
    if (!this.messages.has(msg.id)) {
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

  async getMetahash(codeId: string) {
    if (this.metahashes.has(codeId)) {
      return this.metahashes.get(codeId);
    } else {
      const metahash = await this.codeService.getMetahash(codeId);
      if (metahash) {
        this.metahashes.set(codeId, metahash);
      }
      return metahash;
    }
  }

  async save() {
    await Promise.all([
      (async () => {
        const codeIds = Array.from(this.codes.keys());
        const existingCodes = await this.codeService.getManyIds(codeIds, this.genesis);

        for (const { _id, id } of existingCodes) {
          this.codes.get(id)._id = _id;
        }

        await this.codeService.save(Array.from(this.codes.values()));
      })(),
      this.messageService.save(Array.from(this.messages.values())),
      (async () => {
        const programIds = Array.from(this.programs.keys());
        const existingPrograms = await this.programService.getManyIds(programIds, this.genesis);

        for (const { _id, id } of existingPrograms) {
          this.programs.get(id)._id = _id;
        }

        for (const program of this.programs.values()) {
          program.metahash = await this.getMetahash(program.codeId);
        }
        await this.programService.save(Array.from(this.programs.values()));
      })(),
    ]);

    await this.blockService.save(Array.from(this.blocks.values()));

    return {
      c: this.codes.size,
      p: this.programs.size,
      m: this.messages.size,
    };
  }
}
