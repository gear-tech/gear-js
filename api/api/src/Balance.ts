import { GearApi, GearKeyring } from '.';
import { TransactionError } from './errors';
import { ApiPromise } from '@polkadot/api';
import { Balance } from '@polkadot/types/interfaces';
import { KeyringPair } from '@polkadot/keyring/types';

export class GearBalance {
  private api: GearApi;

  constructor(gearApi: GearApi) {
    this.api = gearApi;
  }

  async findOut(publicKey: string): Promise<Balance> {
    const { data: balance } = await this.api.query.system.account(publicKey);
    return balance.free;
  }

  transferFromAlice(to: string, value: number, eventsCallback?: (event: any, data: any) => void): Promise<any> {
    return new Promise(async (resolve, reject) => {
      try {
        const unsub = await this.api.tx.balances
          .transfer(to, value)
          .signAndSend(GearKeyring.fromSuri('//Alice', 'Alice default'), ({ events, status }) => {
            events.forEach(({ event: { data, method } }) => {
              if (eventsCallback) {
                eventsCallback(method, data);
              }
              if (method === 'Transfer') {
                unsub();
                resolve(0);
              }
            });
          });
      } catch (error) {
        reject(new TransactionError(error.message));
      }
    });
  }

  transferBalance(
    keyring: KeyringPair,
    to: string,
    value: number,
    eventsCallback?: (event: any, data: any) => void
  ): Promise<any> {
    return new Promise(async (resolve, reject) => {
      try {
        const unsub = await this.api.tx.balances.transfer(to, value).signAndSend(keyring, ({ events, status }) => {
          events.forEach(({ event: { data, method } }) => {
            if (eventsCallback) {
              eventsCallback(method, data);
            }
            if (method === 'Transfer') {
              unsub();
              resolve(0);
            }
          });
        });
      } catch (error) {
        reject(new TransactionError(error.message));
      }
    });
  }
}
