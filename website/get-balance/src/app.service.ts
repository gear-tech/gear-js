import { GearApi, GearKeyring } from '@gear-js/api';
import { Injectable, Logger } from '@nestjs/common';
import configuration from './config/configuration';
import { KeyringPair } from '@polkadot/keyring/types';
import { BN } from '@polkadot/util';
import { DbService } from './db/db.service';

const logger = new Logger('Gear');

@Injectable()
export class AppService {
  api: GearApi;
  account: KeyringPair;
  rootAccount: KeyringPair;
  accountBalance: BN;
  balanceToTransfer: BN;

  constructor(private readonly dbService: DbService) {
    const config = configuration().gear;
    GearApi.create({ providerAddress: config.providerAddress }).then(
      async (api) => {
        this.api = api;
        logger.log(
          `Connected to ${await api.chain()}. Address: ${
            process.env.WS_PROVIDER
          }`,
        );
        this.account = await GearKeyring.fromSeed(config.accountSeed);
        this.rootAccount =
          config.rootAccountSeed === '//Alice'
            ? GearKeyring.fromSuri('//Alice')
            : await GearKeyring.fromSeed(config.rootAccountSeed);
        this.accountBalance = new BN(config.accountBalance);
        this.balanceToTransfer = new BN(config.balanceToTransfer);
        if (await this.accountBalanceIsSmall()) {
          this.transferBalance(
            this.account.address,
            this.rootAccount,
            this.accountBalance,
          );
        }
      },
    );
  }

  async accountBalanceIsSmall(): Promise<boolean> {
    const balance = await this.api.balance.findOut(this.account.address);
    if (balance.lt(this.accountBalance)) {
      return true;
    }
    return false;
  }

  async transferBalance(
    to: string,
    from = this.account,
    value = this.balanceToTransfer,
  ) {
    try {
      await this.api.balance.transferBalance(from, to, value);
      if (to !== this.account.address) {
        await this.dbService.setTransferDate(to);
      }
      return { status: 'ok', transferedBalance: value.toString() };
    } catch (error) {
      logger.error(error.message);
      return { error: error.message };
    }
  }
}
