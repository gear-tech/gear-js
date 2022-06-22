import { GearApi, GearKeyring, TransferData } from '@gear-js/api';
import { initLogger } from '@gear-js/common';
import { BN } from '@polkadot/util';
import { KeyringPair } from '@polkadot/keyring/types';
import { DbService } from '../database/db';

import config from '../config/config';

const log = initLogger('GearService');

export class GearService {
  api: GearApi;
  account: KeyringPair;
  rootAccount: KeyringPair;
  accountBalance: BN;
  balanceToTransfer: BN;
  dbService: DbService;

  constructor(dbService: DbService) {
    this.dbService = dbService;
  }

  public async connect() {
    this.api = await GearApi.create({ providerAddress: config.gear.providerAddress });
    this.api.on('error', () => {
      GearApi.create({ providerAddress: config.gear.providerAddress }).then(
        (newApi) => {
          this.api = newApi;
        },
        (error) => {
          console.error('could not reconnect:', error);
          throw error;
        },
      );
    });
    log.info(`Connected to ${await this.api.chain()} with genesis ${this.getGenesisHash}`);

    const [account, rootAccountByGearKeyring] = await Promise.all([
      GearKeyring.fromSeed(config.gear.accountSeed),
      this.setRootAccountSeedByGearKeyring(),
    ]);

    this.account = account;
    this.rootAccount = rootAccountByGearKeyring;
    this.accountBalance = new BN(config.gear.accountBalance);
    this.balanceToTransfer = new BN(config.gear.balanceToTransfer);
    if (await this.isSmallAccountBalance()) {
      await this.transferBalance(this.account.address, this.rootAccount, this.accountBalance);
    }
  }

  public async transferBalance(to: string, from: KeyringPair = this.account, balance: BN = this.accountBalance) {
    this.api.balance.transfer(to, balance);
    await this.sendTransaction(from).catch((err) => log.error(err));

    if (to !== this.account.address) {
      await this.dbService.setTransferDate(to, this.getGenesisHash);
    }
    return { status: 'ok', transferredBalance: balance.toString() };
  }

  public get getGenesisHash(): string {
    return this.api.genesisHash.toHex();
  }

  private async sendTransaction(from: KeyringPair): Promise<TransferData> {
    return new Promise((resolve, reject) => {
      this.api.balance.signAndSend(from, ({ events }) => {
        events.forEach(({ event: { method, data } }) => {
          if (method === 'Transfer') {
            resolve(data as TransferData);
          } else if (method === 'ExtrinsicFailed') {
            reject(data);
          }
        });
      });
    });
  }

  private async isSmallAccountBalance(): Promise<boolean> {
    const balance = await this.api.balance.findOut(this.account.address);
    if (balance.lt(this.accountBalance)) {
      return true;
    }
    return false;
  }

  private async setRootAccountSeedByGearKeyring(): Promise<KeyringPair> {
    const envVar = config.gear.rootAccountSeed;
    if (envVar === '//Alice') {
      return GearKeyring.fromSuri('//Alice');
    } else {
      return GearKeyring.fromSeed(config.gear.rootAccountSeed);
    }
  }
}
