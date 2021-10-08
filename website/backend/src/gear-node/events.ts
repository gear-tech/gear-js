import { Injectable, Logger } from '@nestjs/common';
import { Subject } from 'rxjs';
import { ProgramsService } from 'src/programs/programs.service';
import {
  DispatchMessageEnqueuedData,
  GearApi,
  InitFailureData,
  InitMessageEnqueuedData,
  InitSuccessData,
  LogData,
} from '@gear-js/api';
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

  async subscribeAllEvents(api: GearApi) {
    api.allEvents((events) => {
      events
        .filter(({ event }) => api.events.gear.InitMessageEnqueued.is(event))
        .forEach(async ({ event: { data } }) => {
          data.forEach(async (eventData: InitMessageEnqueuedData) => {
            try {
              await this.programService.saveProgram({
                owner: eventData.origin.toHex(),
                uploadedAt: new Date(),
                hash: eventData.programId.toHex(),
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
        });

      events
        .filter(({ event }) => api.events.gear.DispatchMessageEnqueued.is(event))
        .forEach(async ({ event: { data } }) => {
          data.forEach(async (eventData: DispatchMessageEnqueuedData) => {
            await this.messageService.save({
              id: eventData.messageId.toHex(),
              destination: eventData.origin.toHex(),
              program: eventData.programId.toHex(),
              date: new Date(),
            });
          });
        });

      events
        .filter(({ event }) => api.events.gear.InitSuccess.is(event))
        .forEach(({ event: { data } }) => {
          data.forEach((eventData: InitSuccessData) => {
            try {
              this.programService.initStatus(eventData.programId.toHex(), InitStatus.SUCCESS);
            } catch (error) {
              logger.error(error.message);
            }
          });
        });

      events
        .filter(({ event }) => api.events.gear.InitFailure.is(event))
        .forEach(({ event: { data } }) => {
          data.forEach((eventData: InitFailureData) => {
            try {
              this.programService.initStatus(eventData.programId.toHex(), InitStatus.FAILED);
            } catch (error) {
              logger.error(error.message);
            }
          });
        });

      events
        .filter(({ event }) => api.events.gear.Log.is(event))
        .forEach(({ event: { data } }) => {
          data.forEach(async (eventData: LogData) => {
            await new Promise((resolve) => {
              setTimeout(() => {
                resolve(0);
              }, 100);
            });
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
    });
  }
}
