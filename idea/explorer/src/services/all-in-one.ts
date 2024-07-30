import { DataSource } from 'indexer-db';
import { CodeService } from './code';
import { EventService } from './event';
import { MessageService } from './message';
import { ProgramService } from './program';

export class AllInOneService {
  public code: CodeService;
  public program: ProgramService;
  public message: MessageService;
  public event: EventService;

  constructor(dataSource: DataSource) {
    this.code = new CodeService(dataSource);
    this.program = new ProgramService(dataSource);
    this.message = new MessageService(dataSource);
    this.event = new EventService(dataSource);
  }
}
