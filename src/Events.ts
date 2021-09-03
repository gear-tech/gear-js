import { GearApi } from '@gear-js';
import { ApiPromise } from '@polkadot/api';
import { Event } from '@polkadot/types/interfaces';

export class GearEvents {
  private api: ApiPromise;

  constructor(gearApi: GearApi) {
    this.api = gearApi.api;
  }

  async subscribeLogEvents(callback: (event: Event) => void) {
    try {
      await this.api.query.system.events((events) => {
        events
          .filter(({ event }) => this.api.events.gear.Log.is(event))
          .forEach(({ event }) => {
            callback(event);
          });
      });
    } catch (error) {}
  }

  async subsribeProgramEvents(callback: (event: Event) => void) {
    try {
      await this.api.query.system.events((events) => {
        events
          .filter(
            ({ event }) => this.api.events.gear.InitSuccess.is(event) || this.api.events.gear.InitFailure.is(event)
          )
          .forEach(({ event }) => {
            callback(event);
          });
      });
    } catch (error) {}
  }
}
