import { GearApi } from './GearApi';
import { IBalanceCallback, IBlocksCallback, IEventCallback } from './types/interfaces';
import { LogEvent, ProgramEvent, TransferEvent } from './events-types';
import { UnsubscribePromise } from '@polkadot/api/types';
import { ISystemAccountInfo } from './types/interfaces';

export class GearEvents {
  private api: GearApi;

  constructor(gearApi: GearApi) {
    this.api = gearApi;
  }

  subscribeToLogEvents(callback: IEventCallback<LogEvent>): UnsubscribePromise {
    return this.api.query.system.events((events) => {
      events
        .filter(({ event }) => this.api.events.gear.Log.is(event))
        .forEach(({ event }) => {
          setTimeout(() => {
            callback(new LogEvent(event));
          }, 100);
        });
    });
  }

  subscribeToProgramEvents(callback: IEventCallback<ProgramEvent>): UnsubscribePromise {
    return this.api.query.system.events((events) => {
      events
        .filter(({ event }) => this.api.events.gear.InitSuccess.is(event) || this.api.events.gear.InitFailure.is(event))
        .forEach(({ event }) => {
          setTimeout(() => {
            callback(new ProgramEvent(event));
          }, 100);
        });
    });
  }

  subscribeToTransferEvents(callback: IEventCallback<TransferEvent>): UnsubscribePromise {
    return this.api.query.system.events((events) => {
      events
        .filter(({ event }) => this.api.events.balances.Transfer.is(event))
        .forEach(({ event }) => {
          callback(new TransferEvent(event));
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
