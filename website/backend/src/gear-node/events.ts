import { Injectable, Logger } from '@nestjs/common';
import { Subject } from 'rxjs';
import { ProgramsService } from 'src/programs/programs.service';
import { GearApi } from '@gear-js/api';
import { MessagesService } from 'src/messages/messages.service';
import { InitStatus } from 'src/programs/entities/program.entity';
import {
  DispatchMessageEnqueuedData,
  InitFailureData,
  InitMessageEnqueuedData,
  InitSuccessData,
  LogData,
} from '@gear-js/api';

const logger = new Logger('EventsLogger');

@Injectable()
export class GearNodeEvents {
  public blocks: Subject<any>;
  public events: Subject<any>;

  constructor(private readonly programService: ProgramsService, private readonly messageService: MessagesService) {
    this.blocks = new Subject();
    this.events = new Subject();
  }

  async subscribeAllEvents(api: GearApi) {
    const chain = await api.chain();
    api.allEvents((events) => {
      events
        .filter(({ event }) => api.events.gear.InitMessageEnqueued.is(event))
        .forEach(async ({ event }) => {
          const eventData: InitMessageEnqueuedData = new InitMessageEnqueuedData(event.data);
          try {
            await this.programService.saveProgram({
              owner: eventData.origin.toHex(),
              uploadedAt: new Date(),
              hash: eventData.programId.toHex(),
              chain,
            });
            await this.messageService.save({
              id: eventData.messageId.toHex(),
              destination: eventData.origin.toHex(),
              program: eventData.programId.toHex(),
              date: new Date(),
            });
          } catch (error) {
            logger.error(error.message);
          }
        });

      events
        .filter(({ event }) => api.events.gear.DispatchMessageEnqueued.is(event))
        .forEach(async ({ event }) => {
          const eventData: DispatchMessageEnqueuedData = new DispatchMessageEnqueuedData(event.data);
          await this.messageService.save({
            id: eventData.messageId.toHex(),
            destination: eventData.origin.toHex(),
            program: eventData.programId.toHex(),
            date: new Date(),
          });
        });

      events
        .filter(({ event }) => api.events.gear.InitSuccess.is(event))
        .forEach(async ({ event }) => {
          const eventData: InitSuccessData = new InitSuccessData(event.data);
          await timeOut();
          try {
            this.programService.initStatus(eventData.programId.toHex(), InitStatus.SUCCESS);
          } catch (error) {
            logger.error(error.message);
          }
        });

      events
        .filter(({ event }) => api.events.gear.InitFailure.is(event))
        .forEach(async ({ event }) => {
          const eventData: InitFailureData = new InitFailureData(event.data);
          await timeOut();
          try {
            this.programService.initStatus(eventData.info.programId.toHex(), InitStatus.FAILED);
          } catch (error) {
            logger.error(error.message);
          }
        });

      events
        .filter(({ event }) => api.events.gear.Log.is(event))
        .forEach(async ({ event }) => {
          const eventData: LogData = new LogData(event.data);
          await timeOut();
          try {
            if (eventData.reply.isSome) {
              eventData.reply.toHuman()[1] === '0' &&
                this.messageService.update(eventData.reply.unwrap()[0].toHex(), {
                  responseId: eventData.id.toHex(),
                  response: eventData.payload.toHex(),
                });
            } else {
              this.messageService.save({
                id: eventData.id.toHex(),
                destination: eventData.dest.toHex(),
                program: eventData.source.toHex(),
                date: new Date(),
                responseId: eventData.id.toHex(),
                response: eventData.payload.toHex(),
              });
            }
          } catch (error) {
            logger.error(error);
          }
        });
    });
  }
}

function timeOut() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(0);
    }, 100);
  });
}
