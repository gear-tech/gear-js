import { Logger } from '@nestjs/common';
import { ApiPromise } from '@polkadot/api';
import { Subject } from 'rxjs';
import { GearNodeError } from 'sample-polkadotjs-typegen/json-rpc/errors';
import { toU8a } from './utils';

const logger = new Logger('EventsLogger');

export async function subscribeEvents(api: ApiPromise, callback) {
  try {
    const blocksSubject = new Subject();
    const eventsSubject = new Subject();
    callback({ events: eventsSubject, blocks: blocksSubject });
    const unsub = api.rpc.chain.subscribeNewHeads(async (header) => {
      blocksSubject.next(header);
    });
    getBlockEvents(api, eventsSubject);
  } catch (error) {
    throw new GearNodeError(error.message);
  }
}

async function getBlockEvents(api: ApiPromise, eventsSubject: Subject<any>) {
  await api.query.system.events((events) => {
    events
      .filter(({ event }) => api.events.gear.Log.is(event))
      .forEach(({ event: { data } }) => {
        data.forEach((data) => {
          const res = data.toHuman();
          console.log(res);
          eventsSubject.next({
            type: 'log',
            id: res['id'],
            source: res['source'],
            dest: res['dest'],
            payload: data['payload'],
            reply: res['reply'][0],
            date: new Date(),
          });
        });
      });
    events
      .filter(
        ({ event }) =>
          api.events.gear.ProgramInitialized.is(event) ||
          api.events.gear.InitFailure.is(event),
      )
      .forEach(({ event: { method, data } }) => {
        // console.log(data)
        eventsSubject.next({
          type: 'program',
          method: method,
          programHash: data[0].toHuman(),
          date: new Date(),
        });
      });
  });
}
