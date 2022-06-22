import { UnsubscribePromise } from '@polkadot/api/types';
import { GearApi } from '../GearApi';
import { ISystemAccountInfo, IBalanceCallback, IBlocksCallback } from '../types/interfaces';
import { IGearEvent } from './types';
import { Transfer } from './GearEvents';

export class GearEvents {
  private api: GearApi;

  constructor(gearApi: GearApi) {
    this.api = gearApi;
  }

  subscribeToGearEvent<M extends keyof IGearEvent>(
    method: M,
    callback: (event: IGearEvent[M]) => void | Promise<void>,
  ) {
    return this.api.query.system.events((events) => {
      events
        .filter(({ event }) => event.method === method)
        .forEach(({ event }) => {
          callback(event as IGearEvent[M]);
        });
    });
  }

  subscribeToTransferEvents(callback: (event: Transfer) => void | Promise<void>): UnsubscribePromise {
    return this.api.query.system.events((events) => {
      events
        .filter(({ event }) => this.api.events.balances.Transfer.is(event))
        .forEach(({ event }) => {
          callback(event as Transfer);
        });
    });
  }

  subscribeToNewBlocks(callback: IBlocksCallback): UnsubscribePromise {
    return this.api.rpc.chain.subscribeNewHeads((header) => {
      callback(header);
    });
  }

  async subscribeToBalanceChange(accountAddress: string, callback: IBalanceCallback): UnsubscribePromise {
    let {
      data: { free: previousFree },
    } = (await this.api.query.system.account(accountAddress)) as ISystemAccountInfo;

    return this.api.query.system.account(accountAddress, ({ data: { free: currentFree } }) => {
      if (!currentFree.sub(previousFree).isZero()) {
        callback(this.api.createType('Balance', currentFree));
        previousFree = currentFree;
      }
    });
  }
}
