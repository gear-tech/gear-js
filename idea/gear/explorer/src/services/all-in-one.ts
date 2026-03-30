import { DataSource } from 'gear-idea-indexer-db';
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

  constructor(dataSource: DataSource) {
    this.code = new CodeService(dataSource);
    this.program = new ProgramService(dataSource);
    this.message = new MessageService(dataSource);
    this.event = new EventService(dataSource);
    this.voucher = new VoucherService(dataSource);
  }
}
