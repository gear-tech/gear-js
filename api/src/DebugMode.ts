import { UnsubscribePromise } from '@polkadot/api/types';
import { GearTransaction } from './Transaction';
import { DebugDataSnapshotEvent } from './events-types';

export class DebugMode extends GearTransaction {
  enabled: any;

  enable() {
    this.enabled = this.api.tx.sudo.sudo(this.api.tx.gearDebug.enableDebugMode(true));
  }

  disable() {
    this.enabled = this.api.tx.sudo.sudo(this.api.tx.gearDebug.enableDebugMode(false));
  }

  snapshots(callback: (event: DebugDataSnapshotEvent) => void | Promise<void>): UnsubscribePromise {
    return this.api.query.system.events((events) => {
      events
        .filter(({ event }) => this.api.events.gearDebug.DebugDataSnapshot.is(event))
        .forEach(({ event }) => callback(new DebugDataSnapshotEvent(event)));
    });
  }
}
