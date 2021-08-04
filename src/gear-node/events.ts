import { ApiPromise } from '@polkadot/api';
import { Subject } from 'rxjs';
import { GearNodeError } from 'sample-polkadotjs-typegen/json-rpc/errors';
import { ProgramsService } from 'sample-polkadotjs-typegen/programs/programs.service';

export async function subscribetEvents(api: ApiPromise, callback) {
  try {
    const blocksSubject = new Subject();
    const eventsSubject = new Subject();
    callback({ events: eventsSubject, blocks: blocksSubject });
    const unsub = api.rpc.chain.subscribeNewHeads((header) => {
      blocksSubject.next(header);
      getBlockEvents(api, header.hash, eventsSubject);
    });
  } catch (error) {
    throw new GearNodeError(error.message);
  }
}

async function getBlockEvents(
  api: ApiPromise,
  blockHash,
  eventsSubject: Subject<any>,
) {
  let events = await api.query.system.events.at(blockHash);
  events
    .filter(({ event }) => api.events.gear.Log.is(event))
    .forEach(({ event: { data } }) => {
      data.forEach((data) => {
        const res = data.toHuman();
        eventsSubject.next({
          type: 'log',
          id: res['id'],
          source: res['source'],
          dest: res['dest'],
          payload: res['payload'],
          reply: res['reply'],
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
      eventsSubject.next({
        type: 'program',
        method: method,
        programHash: data[0].toHuman(),
        date: new Date(),
      });
    });
}
