import { GearApi, GearKeyring } from '@gear-js/api';
import config from './config';
import { BN } from '@polkadot/util';
import { KeyringPair } from '@polkadot/keyring/types';
import { Logger } from './logger';
import { DbService } from './db';

const log = Logger('GearService');

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

  async connect() {
    this.api = await GearApi.create({ providerAddress: config.gear.providerAddress });
    log.info(`Connected to ${await this.api.chain()} with genesis ${this.genesisHash}`);
    this.account = await GearKeyring.fromSeed(config.gear.accountSeed);
    this.rootAccount =
      config.gear.rootAccountSeed === '//Alice'
        ? GearKeyring.fromSuri('//Alice')
        : await GearKeyring.fromSeed(config.gear.rootAccountSeed);
    this.accountBalance = new BN(config.gear.accountBalance);
    this.balanceToTransfer = new BN(config.gear.balanceToTransfer);
    if (await this.accountBalanceIsSmall()) {
      this.transferBalance(this.account.address, this.rootAccount, this.accountBalance);
    }
  }

  get genesisHash(): string {
    return this.api.genesisHash.toHex();
  }

  async accountBalanceIsSmall(): Promise<boolean> {
    const balance = await this.api.balance.findOut(this.account.address);
    if (balance.lt(this.accountBalance)) {
      return true;
    }
    return false;
  }

  async transferBalance(to: string, from = this.account, value = this.balanceToTransfer) {
    try {
      console.log(from.address, to, value);
      await this.api.balance.transferBalance(from, to, value);
      if (to !== this.account.address) {
        await this.dbService.setTransferDate(to, this.genesisHash);
      }
      return { status: 'ok', transferedBalance: value.toString() };
    } catch (error) {
      log.error(error.message);
      return { error: error.message };
    }
  }
}
