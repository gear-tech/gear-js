import { GearApi, GearKeyring } from '@gear-js/api';
import { KeyringPair } from '@polkadot/keyring/types';
import { Injectable, Logger } from '@nestjs/common';
import { ProgramsService } from 'src/programs/programs.service';
import { GearNodeError } from 'src/json-rpc/errors';
import { GearNodeEvents } from './events';

const logger = new Logger('GearNodeService');
@Injectable()
export class GearNodeService {
  private api: GearApi;
  private rootKeyring: KeyringPair;

  constructor(private readonly programService: ProgramsService, private readonly subscription: GearNodeEvents) {
    GearApi.create({ providerAddress: process.env.WS_PROVIDER }).then(async (api) => {
      this.api = api;
      const accountSeed = process.env.ACCOUNT_SEED;
      this.rootKeyring = accountSeed
        ? await GearKeyring.fromSeed(process.env.ACCOUNT_SEED, 'websiteAccount')
        : (await GearKeyring.create('websiteAccount')).keyring;
      this.updateSiteAccountBalance();
      this.subscription.subscribeAllEvents(api);
    });
  }

  async updateSiteAccountBalance() {
    const currentBalance = (await this.api.balance.findOut(this.rootKeyring.address)).toNumber();
    const siteAccBalance = +process.env.SITE_ACCOUNT_BALANCE;
    if (currentBalance < siteAccBalance) {
      const sudoKeyring = parseInt(process.env.DEBUG)
        ? GearKeyring.fromSuri('//Alice', 'Alice default')
        : await GearKeyring.fromSeed('websiteAccount', process.env.SUDO_SEED);
      await this.api.balance.transferBalance(
        sudoKeyring,
        this.rootKeyring.address,
        siteAccBalance - currentBalance,
        () => {},
      );
    }
  }

  async balanceTopUp(to: string, value: number): Promise<string> {
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
