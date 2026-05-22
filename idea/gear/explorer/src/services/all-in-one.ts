import type { DataCache } from 'gear-idea-common';
import type { DataSource } from 'gear-idea-indexer-db';
import { CodeService } from './code.js';
import { EventService } from './event.js';
import { MessageService } from './message.js';
import { ProgramService } from './program.js';
import { VoucherService } from './voucher.js';

export class AllInOneService {
  public code: CodeService;
  public program: ProgramService;
  public message: MessageService;
  public event: EventService;
  public voucher: VoucherService;

  constructor(dataSource: DataSource, genesis: string, dataCache: DataCache) {
    this.code = new CodeService(dataSource);
    this.program = new ProgramService(dataSource, genesis, dataCache);
    this.message = new MessageService(dataSource, genesis, dataCache);
    this.event = new EventService(dataSource, genesis, dataCache);
    this.voucher = new VoucherService(dataSource);
  }
}
