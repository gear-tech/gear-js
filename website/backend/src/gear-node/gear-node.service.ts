import { GearApi, GearKeyring } from '@gear-js/api';
import { KeyringPair } from '@polkadot/keyring/types';
import { Injectable, Logger } from '@nestjs/common';
import { ProgramsService } from 'src/programs/programs.service';
import { GearNodeError, TransactionError } from 'src/json-rpc/errors';
import { GearNodeEvents } from './events';
import { BN } from '@polkadot/util';

const logger = new Logger('GearNodeService');
@Injectable()
export class GearNodeService {
  private api: GearApi;
  private rootKeyring: KeyringPair;

  constructor(private readonly programService: ProgramsService, private readonly subscription: GearNodeEvents) {
    GearApi.create({ providerAddress: process.env.WS_PROVIDER }).then(async (api) => {
      this.api = api;
      logger.log(`Connected to ${await api.chain()}. Address: ${process.env.WS_PROVIDER}`);
      const accountSeed = process.env.ACCOUNT_SEED;
      try {
        this.rootKeyring = accountSeed
          ? await GearKeyring.fromSeed(process.env.ACCOUNT_SEED, 'websiteAccount')
          : (await GearKeyring.create('websiteAccount')).keyring;
      } catch (error) {
        logger.error('createRootKeyring', error.message);
      }
      try {
        await this.updateSiteAccountBalance();
      } catch (error) {
        logger.error('updateSiteAccountBalance', error.message);
      }
      this.subscription.subscribeAllEvents(api);
    });
  }

  async updateSiteAccountBalance() {
    const currentBalance = await this.api.balance.findOut(this.rootKeyring.address);
    const siteAccBalance = +process.env.SITE_ACCOUNT_BALANCE;
    if (currentBalance.lt(new BN(siteAccBalance))) {
      const sudoKeyring = parseInt(process.env.DEBUG)
        ? GearKeyring.fromSuri('//Alice', 'Alice default')
        : await GearKeyring.fromSeed(process.env.SUDO_SEED, 'websiteAccount');
      await this.api.balance.transferBalance(
        sudoKeyring,
        this.rootKeyring.address,
        siteAccBalance - currentBalance.toNumber(),
        () => {},
      );
    }
  }

  async balanceTopUp(to: string, value: number): Promise<string> {
    if (!to) {
      throw new TransactionError('Destination address is not specified');
    }
    try {
      await this.api.balance.transferBalance(this.rootKeyring, to, value, () => {});
      return 'Transfer balance succeed';
    } catch (error) {
      logger.error(error.message);
      throw new GearNodeError(error.message);
    }
  }

  async getAllNoGUIPrograms() {
    let programs = await this.api.program.allUploadedPrograms();
    const filter = async (array, condition) => {
      const results = await Promise.all(array.map(condition));
      return array.filter((_v, index) => results[index]);
    };
    programs = await filter(programs, async (hash) => !(await this.programService.isInDB(hash)));
    return programs;
  }
}
