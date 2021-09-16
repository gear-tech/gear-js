import { GearApi } from '.';
import { ApiPromise } from '@polkadot/api';
import { Event, Header } from '@polkadot/types/interfaces';
import { UnsubscribePromise } from '@polkadot/api/types';

export class GearEvents {
  private api: ApiPromise;

  constructor(gearApi: GearApi) {
    this.api = gearApi.api;
  }

  subscribeLogEvents(callback: (event: Event) => void | Promise<void>): UnsubscribePromise {
    try {
      return this.api.query.system.events((events) => {
        events
          .filter(({ event }) => this.api.events.gear.Log.is(event))
          .forEach(({ event }) => {
            setTimeout(() => {
              callback(event);
            }, 100);
          });
      });
    } catch (error) {}
  }

  subsribeProgramEvents(callback: (event: Event) => void | Promise<void>): UnsubscribePromise {
    try {
      return this.api.query.system.events((events) => {
        events
          .filter(
            ({ event }) => this.api.events.gear.InitSuccess.is(event) || this.api.events.gear.InitFailure.is(event)
          )
          .forEach(({ event }) => {
            setTimeout(() => {
              callback(event);
            }, 100);
          });
      });
    } catch (error) {}
  }

  async subscribeNewBlocks(callback: (header: Header) => void | Promise<void>): UnsubscribePromise {
    try {
      return this.api.rpc.chain.subscribeNewHeads((header) => {
        callback(header);
      });
    } catch (error) {}
  }
}
