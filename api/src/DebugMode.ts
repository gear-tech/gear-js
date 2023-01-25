import { SubmittableExtrinsic, UnsubscribePromise } from '@polkadot/api/types';
import { ISubmittableResult } from '@polkadot/types/types';

import { DebugDataSnapshot } from './events';
import { GearTransaction } from './Transaction';

export class DebugMode extends GearTransaction {
  enabled: SubmittableExtrinsic<'promise', ISubmittableResult>;

  enable() {
    this.enabled = this._api.tx.sudo.sudo(this._api.tx.gearDebug.enableDebugMode(true));
  }

  disable() {
    this.enabled = this._api.tx.sudo.sudo(this._api.tx.gearDebug.enableDebugMode(false));
  }

  snapshots(callback: (event: DebugDataSnapshot) => void | Promise<void>): UnsubscribePromise {
    return this._api.query.system.events((events) => {
      events
        .filter(({ event }) => this._api.events.gearDebug.DebugDataSnapshot.is(event))
        .forEach(({ event }) => callback(event as DebugDataSnapshot));
    });
  }
}
