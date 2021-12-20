import { GearApi } from '.';
import { LogEvent, ProgramEvent, TransferEvent } from './types';
import { Header } from '@polkadot/types/interfaces';
import { UnsubscribePromise } from '@polkadot/api/types';
import { Balance } from '@polkadot/types/interfaces';

export class GearEvents {
  private api: GearApi;

  constructor(gearApi: GearApi) {
    this.api = gearApi;
  }

  subscribeLogEvents(callback: (event: LogEvent) => void | Promise<void>): UnsubscribePromise {
    try {
      return this.api.query.system.events((events) => {
        events
          .filter(({ event }) => this.api.events.gear.Log.is(event))
          .forEach(({ event }) => {
            setTimeout(() => {
              callback(new LogEvent(event));
            }, 100);
          });
      });
    } catch (error) {
      throw error;
    }
  }

  subscribeProgramEvents(callback: (event: ProgramEvent) => void | Promise<void>): UnsubscribePromise {
    try {
      return this.api.query.system.events((events) => {
        events
          .filter(
            ({ event }) => this.api.events.gear.InitSuccess.is(event) || this.api.events.gear.InitFailure.is(event),
          )
          .forEach(({ event }) => {
            setTimeout(() => {
              callback(new ProgramEvent(event));
            }, 100);
          });
      });
    } catch (error) {
      throw error;
    }
  }

  subscribeTransferEvents(callback: (event: TransferEvent) => void | Promise<void>): UnsubscribePromise {
    try {
      return this.api.query.system.events((events) => {
        events
          .filter(({ event }) => this.api.events.balances.Transfer.is(event))
          .forEach(({ event }) => {
            callback(new TransferEvent(event));
          });
      });
    } catch (error) {
      throw error;
    }
  }

  subscribeNewBlocks(callback: (header: Header) => void | Promise<void>): UnsubscribePromise {
    try {
      return this.api.rpc.chain.subscribeNewHeads((header) => {
        callback(header);
      });
    } catch (error) {}
  }

  async subsribeBalanceChange(accountAddress: string, callback: (currentBalance: Balance) => void): Promise<void> {
    let {
      data: { free: previousFree },
      nonce: previousNonce,
    } = await this.api.query.system.account(accountAddress);

    this.api.query.system.account(accountAddress, ({ data: { free: currentFree }, nonce: currentNonce }) => {
      if (!currentFree.sub(previousFree).isZero()) {
        callback(this.api.createType('Balance', currentFree));
        previousFree = currentFree;
        previousNonce = currentNonce;
      }
    });
  }
}
