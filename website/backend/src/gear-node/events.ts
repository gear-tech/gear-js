import { Injectable, Logger } from '@nestjs/common';
import { Subject } from 'rxjs';
import { ProgramsService } from 'src/programs/programs.service';
import { GearApi } from '@gear-js/api';

const logger = new Logger('EventsLogger');

@Injectable()
export class GearNodeEvents {
  public blocks: Subject<any>;
  public events: Subject<any>;

  constructor(private readonly programService: ProgramsService) {
    this.blocks = new Subject();
    this.events = new Subject();
  }

  async subscribeEvents(api: GearApi): Promise<void> {
    try {
      api.gearEvents.subscribeLogEvents(({ data }) => {
        const res = data.toHuman();
        this.events.next({
          type: 'log',
          id: res['reply'][0],
          program: res['source'],
          destination: res['dest'],
          date: new Date(),
          response: data['payload'],
          responseId: data['id'],
        });
      });
      api.gearEvents.subsribeProgramEvents(async ({ method, data }) => {
        const programId = data[0].toHuman()['program_id'];
        const program = await this.programService.findProgram(programId);
        this.events.next({
          type: 'program',
          status: method,
          destination: program ? program.user.publicKey : undefined,
          hash: programId,
          programName: program ? program.name : undefined,
          date: new Date(),
        });
      });
    } catch (error) {
      logger.error(error);
    }
  }
}
