import { Injectable, Logger } from '@nestjs/common';
import { ApiPromise } from '@polkadot/api';
import { Subject } from 'rxjs';
import { ProgramsService } from 'src/programs/programs.service';
import { GearNodeError } from 'src/json-rpc/errors';
import { UnsubscribePromise } from '@polkadot/api/types';

const logger = new Logger('EventsLogger');

@Injectable()
export class GearNodeEvents {
  public blocks: Subject<any>;
  public events: Subject<any>;

  constructor(private readonly programService: ProgramsService) {
    this.blocks = new Subject();
    this.events = new Subject();
  }

  async subscribeBlocks(api: ApiPromise): Promise<UnsubscribePromise> {
    try {
      const unsub = api.rpc.chain.subscribeNewHeads(async (header) => {
        this.blocks.next(header);
      });
      return unsub;
    } catch (error) {
      throw new GearNodeError(error.message);
    }
  }

  async subscribeEvents(api: ApiPromise): Promise<void> {
    try {
      await api.query.system.events((events) => {
        // events.forEach(({ event: { section, method, data } }) => {
        //   if (section === 'gear') {
        //     console.log(`${section}.${method} :: Data:`);
        //     console.log(data.toHuman());
        //   }
        // });

        events
          .filter(({ event }) => api.events.gear.Log.is(event))
          .forEach(({ event: { data } }) => {
            data.forEach((data) => {
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
          });
        events
          .filter(
            ({ event }) =>
              api.events.gear.InitSuccess.is(event) ||
              api.events.gear.InitFailure.is(event),
          )
          .forEach(async ({ event: { method, data } }) => {
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
      });
    } catch (error) {
      logger.error(error);
    }
  }
}
