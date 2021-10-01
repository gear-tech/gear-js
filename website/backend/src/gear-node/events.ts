import { Injectable, Logger } from '@nestjs/common';
import { Subject } from 'rxjs';
import { ProgramsService } from 'src/programs/programs.service';
import { GearApi } from '@gear-js/api';
import { Codec } from '@polkadot/types/types';
import { MessagesService } from 'src/messages/messages.service';
import { InitStatus } from 'src/programs/entities/program.entity';

const logger = new Logger('EventsLogger');

@Injectable()
export class GearNodeEvents {
  public blocks: Subject<any>;
  public events: Subject<any>;

  constructor(private readonly programService: ProgramsService, private readonly messageService: MessagesService) {
    this.blocks = new Subject();
    this.events = new Subject();
  }

  getEventData(data: Codec): any {
    const humaned = data.toHuman();
    let result = new Map<string, any>();
    Object.keys(humaned).forEach((key) => {
      result.set(key, humaned[key]);
    });
    return Object.fromEntries(result);
  }

  async subscribeAllEvents(api: GearApi) {
    api.allEvents((events) => {
      events
        .filter(({ event }) => api.events.gear.InitMessageEnqueued.is(event))
        .forEach(async ({ event: { data } }) => {
          const { messageId, programId, origin } = this.getEventData(data[0]);
          try {
            const program = await this.programService.saveProgram({
              owner: origin,
              uploadedAt: new Date(),
              hash: programId,
            });
            console.log(program);
            this.messageService.save({ id: messageId, destination: origin, program: programId, date: new Date() });
          } catch (error) {
            console.log('ERROR', error);
          }
        });

      events
        .filter(({ event }) => api.events.gear.InitSuccess.is(event))
        .forEach(({ event: { data } }) => {
          const { programId } = this.getEventData(data[0]);
          this.programService.initStatus(programId, InitStatus.SUCCESS);
        });

      events
        .filter(({ event }) => api.events.gear.InitFailure.is(event))
        .forEach(({ event: { data } }) => {
          const { programId } = this.getEventData(data[0]);
          this.programService.initStatus(programId, InitStatus.FAILED);
        });

      events
        .filter(({ event }) => api.events.gear.Log.is(event))
        .forEach(({ event: { data } }) => {
          data.forEach((part) => {
            const { reply, source, dest, payload, id } = this.getEventData(part);
            if (reply) {
              reply[1] === 0 && this.messageService.update(reply[0], { responseId: id, response: payload });
            } else {
              this.messageService.save({
                id,
                destination: dest,
                program: source,
                date: new Date(),
                responseId: id,
                response: payload,
              });
            }
          });
        });
    });
  }
}
