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
        data.forEach((part) => {
          const res = part.toHuman();
          console.log(res);
          this.events.next({
            type: 'log',
            id: res['reply'][0],
            program: res['source'],
            destination: res['dest'],
            date: new Date(),
            response: res['payload'],
            responseId: res['id'],
            error: +res['reply'][1] !== 0 ? true : false,
          });
        });
      });
      api.gearEvents.subsribeProgramEvents(async ({ method, data }) => {
        data.forEach(async (part) => {
          const eventData = part.toHuman();
          const program = await this.programService.findProgram(
            eventData['programId'],
          );
          this.events.next({
            type: 'program',
            status: method,
            destination: program ? program.user.publicKeyRaw : undefined,
            hash: eventData['programId'],
            messageId: eventData['messageId'],
            programName: program ? program.name : undefined,
            date: new Date(),
          });
        });
      });
    } catch (error) {
      logger.error(error);
    }
  }
}
