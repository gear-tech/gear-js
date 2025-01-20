import { FrameSystemAccountInfo, FrameSystemEventRecord } from '@polkadot/types/lookup';
import { HexString } from '@polkadot/util/types';
import { UnsubscribePromise } from '@polkadot/api/types';

import { IBalanceCallback, IBlocksCallback } from '../types';
import { IGearEvent, IGearVoucherEvent } from './types';
import { Transfer, UserMessageSent } from './GearEvents';
import { GearApi } from '../GearApi';
import { Vec } from '@polkadot/types-codec';

export class GearEvents {
  private api: GearApi;

  constructor(gearApi: GearApi) {
    this.api = gearApi;
  }

  subscribeToGearEvent<M extends keyof IGearEvent>(
    method: M,
    callback: (event: IGearEvent[M]) => void | Promise<void>,
    fromBlock?: number | HexString,
    blocks: 'finalized' | 'latest' = 'latest',
  ) {
    const handler = (events: Vec<FrameSystemEventRecord>) => {
      events
        .filter(({ event }) => event.method === method)
        .forEach(({ event }) => {
          callback(event as IGearEvent[M]);
        });
    };

    if (fromBlock) {
      return this.api.blocks.subscribeToHeadsFrom(
        fromBlock,
        (header) => {
          this.api
            .at(header.hash)
            .then((apiAt) => apiAt.query.system.events())
            .then(handler);
        },
        blocks,
      );
    }

    if (blocks === 'latest') {
      return this.api.query.system.events(handler);
    }

    return this.api.rpc.chain.subscribeFinalizedHeads((header) => {
      this.api
        .at(header.hash)
        .then((apiAt) => apiAt.query.system.events())
        .then(handler);
    });
  }

  subscribeToGearVoucherEvent<M extends keyof IGearVoucherEvent>(
    method: M,
    callback: (event: IGearVoucherEvent[M]) => void | Promise<void>,
  ) {
    return this.api.query.system.events((events) => {
      events
        .filter(({ event }) => event.method === method)
        .forEach(({ event }) => {
          callback(event as IGearVoucherEvent[M]);
        });
    });
  }

  #umsActorsMatch(from: HexString, to: HexString, event: UserMessageSent): boolean {
    if (event.data.message.source.eq(from) || event.data.message.destination.eq(to)) {
      return true;
    }
    return false;
  }

  subscribeToUserMessageSentByActor(
    options: { from?: HexString; to?: HexString },
    callback: (event: UserMessageSent) => void,
  ) {
    return this.api.query.system.events((events) => {
      events
        .filter(({ event }) => event.method === 'UserMessageSent')
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

  async subscribeToBalanceChanges(accountAddress: string, callback: IBalanceCallback): UnsubscribePromise {
    let {
      data: { free: previousFree },
    } = (await this.api.query.system.account(accountAddress)) as FrameSystemAccountInfo;

    return this.api.query.system.account(accountAddress, ({ data: { free: currentFree } }) => {
      if (!currentFree.sub(previousFree).isZero()) {
        callback(this.api.createType('Balance', currentFree));
        previousFree = currentFree;
      }
    });
  }
}
