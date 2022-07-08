import { SubmittableExtrinsic, UnsubscribePromise } from '@polkadot/api/types';
import { ISubmittableResult } from '@polkadot/types/types';

import { GearTransaction } from './Transaction';
import { DebugDataSnapshot } from './events';

export class DebugMode extends GearTransaction {
  enabled: SubmittableExtrinsic<'promise', ISubmittableResult>;

  enable() {
    this.enabled = this.api.tx.sudo.sudo(this.api.tx.gearDebug.enableDebugMode(true));
  }

  disable() {
    this.enabled = this.api.tx.sudo.sudo(this.api.tx.gearDebug.enableDebugMode(false));
  }

  snapshots(callback: (event: DebugDataSnapshot) => void | Promise<void>): UnsubscribePromise {
    return this.api.query.system.events((events) => {
      events
        .filter(({ event }) => this.api.events.gearDebug.DebugDataSnapshot.is(event))
        .forEach(({ event }) => callback(event as DebugDataSnapshot));
    });
  }
}
