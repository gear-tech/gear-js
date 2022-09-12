import { UnsubscribePromise } from '@polkadot/api/types';

import { ISystemAccountInfo, IBalanceCallback, IBlocksCallback, Hex } from '../types';
import { IGearEvent } from './types';
import { GearApi } from '../GearApi';
import { Transfer, UserMessageSent } from './GearEvents';

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

  #umsActorsMatch(from: Hex, to: Hex, event: UserMessageSent): boolean {
    if (event.data.message.source.eq(from) || event.data.message.destination.eq(to)) {
      return true;
    }
    return false;
  }

  subscribeToUserMessageSent(options: { from?: Hex; to?: Hex }, callback: (event: UserMessageSent) => void) {
    return this.api.query.system.events((events) => {
      events
        .filter(({ event }) => ['UserMessageSent', 'MessageEnqueued'].includes(event.method))
        .forEach(({ event }) => {
          if (this.#umsActorsMatch(options.from, options.to, event as UserMessageSent)) {
            callback(event as UserMessageSent);
          }
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

  /**
   * @deprecated Use api.blocks.subscribeNewHeads instead
   */
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
